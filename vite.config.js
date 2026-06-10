import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// IDs válidos de asignatura — lista explícita, sin path traversal posible
const VALID_ASIG = new Set(['smpc', 'casi', 'te', 'iaic', 'aamd', 'isa'])
// temaId debe ser tema-N (solo dígitos, sin separadores de ruta)
const VALID_TEMA = /^tema-\d+$/

/**
 * Plugin de administración local — SOLO activo en el servidor de desarrollo.
 * Expone:
 *   POST /api/admin/publicar-tema           → escribe un tema en src/data/public/
 *   POST /api/admin/publicar-banco-preguntas → escribe banco-preguntas.json en src/data/public/
 *   POST /api/admin/actualizar-pregunta      → actualiza una pregunta existente del banco
 * Este middleware no se incluye en el build de producción.
 */
function localAdminPlugin() {
  return {
    name: 'studyhub-local-admin',
    configureServer(server) {
      server.middlewares.use('/api/admin/publicar-tema', (req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')

        if (req.method !== 'POST') {
          res.writeHead(405).end(JSON.stringify({ error: 'Method Not Allowed' }))
          return
        }

        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', () => {
          try {
            const data = JSON.parse(body)
            const { asignaturaId, temaId } = data

            // Validar asignaturaId contra whitelist
            if (!asignaturaId || !VALID_ASIG.has(asignaturaId)) {
              res.writeHead(400).end(JSON.stringify({
                error: `asignaturaId "${asignaturaId}" no válido. Opciones: ${[...VALID_ASIG].join(', ')}`
              }))
              return
            }

            // Validar temaId contra patrón estricto (sin /, \, ..)
            if (!temaId || !VALID_TEMA.test(temaId)) {
              res.writeHead(400).end(JSON.stringify({
                error: `temaId "${temaId}" no válido. Debe seguir el patrón tema-N (ej: tema-1)`
              }))
              return
            }

            // Construir ruta INTERNA usando solo valores validados — sin path del cliente
            const targetDir = path.resolve(process.cwd(), 'src', 'data', 'public', asignaturaId, 'temas')
            const filePath = path.resolve(targetDir, `${temaId}-contenido.json`)

            // Verificación de contención (paranoia extra)
            if (!filePath.startsWith(targetDir + path.sep)) {
              res.writeHead(403).end(JSON.stringify({ error: 'Ruta no permitida' }))
              return
            }

            const existed = fs.existsSync(filePath)
            fs.mkdirSync(targetDir, { recursive: true })
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')

            const publicPath = `src/data/public/${asignaturaId}/temas/${temaId}-contenido.json`
            res.writeHead(200).end(JSON.stringify({ ok: true, existed, path: publicPath }))
          } catch (e) {
            res.writeHead(500).end(JSON.stringify({ error: e.message }))
          }
        })
      })

      server.middlewares.use('/api/admin/publicar-banco-preguntas', (req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')

        if (req.method !== 'POST') {
          res.writeHead(405).end(JSON.stringify({ error: 'Method Not Allowed' }))
          return
        }

        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body)

            // Acepta { asignaturaId, preguntas } o array directo
            let asignaturaId, preguntas
            if (Array.isArray(parsed)) {
              preguntas = parsed
              asignaturaId = preguntas[0]?.asignaturaId
            } else {
              asignaturaId = parsed.asignaturaId
              preguntas = parsed.preguntas
            }

            // Validar asignaturaId contra whitelist
            if (!asignaturaId || !VALID_ASIG.has(asignaturaId)) {
              res.writeHead(400).end(JSON.stringify({
                error: `asignaturaId "${asignaturaId}" no válido. Opciones: ${[...VALID_ASIG].join(', ')}`
              }))
              return
            }

            // Validar que preguntas es un array
            if (!Array.isArray(preguntas)) {
              res.writeHead(400).end(JSON.stringify({ error: '"preguntas" debe ser un array' }))
              return
            }

            if (preguntas.length === 0) {
              res.writeHead(400).end(JSON.stringify({ error: 'El banco está vacío (0 preguntas)' }))
              return
            }

            // Validar que todas las preguntas pertenecen a la misma asignatura
            const wrongAsig = preguntas.filter(q => q.asignaturaId !== asignaturaId)
            if (wrongAsig.length > 0) {
              res.writeHead(400).end(JSON.stringify({
                error: `${wrongAsig.length} pregunta(s) tienen asignaturaId diferente a "${asignaturaId}"`
              }))
              return
            }

            // Construir ruta INTERNA usando solo valores validados — sin path del cliente
            const targetDir = path.resolve(process.cwd(), 'src', 'data', 'public', asignaturaId, 'preguntas')
            const filePath = path.resolve(targetDir, 'banco-preguntas.json')

            // Verificación de contención
            if (!filePath.startsWith(targetDir + path.sep)) {
              res.writeHead(403).end(JSON.stringify({ error: 'Ruta no permitida' }))
              return
            }

            const existed = fs.existsSync(filePath)
            fs.mkdirSync(targetDir, { recursive: true })
            fs.writeFileSync(filePath, JSON.stringify(preguntas, null, 2), 'utf-8')

            const publicPath = `src/data/public/${asignaturaId}/preguntas/banco-preguntas.json`
            res.writeHead(200).end(JSON.stringify({ ok: true, existed, path: publicPath, total: preguntas.length }))
          } catch (e) {
            res.writeHead(500).end(JSON.stringify({ error: e.message }))
          }
        })
      })

      server.middlewares.use('/api/admin/actualizar-pregunta', (req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')

        if (req.method !== 'POST') {
          res.writeHead(405).end(JSON.stringify({ error: 'Method Not Allowed' }))
          return
        }

        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', () => {
          try {
            const { asignaturaId, questionId, question } = JSON.parse(body)

            // Validar asignaturaId contra whitelist
            if (!asignaturaId || !VALID_ASIG.has(asignaturaId)) {
              res.writeHead(400).end(JSON.stringify({
                error: `asignaturaId "${asignaturaId}" no válido. Opciones: ${[...VALID_ASIG].join(', ')}`
              }))
              return
            }

            // Validar questionId
            if (!questionId || typeof questionId !== 'string') {
              res.writeHead(400).end(JSON.stringify({ error: '"questionId" es obligatorio' }))
              return
            }

            // Validar question
            if (!question || typeof question !== 'object' || Array.isArray(question)) {
              res.writeHead(400).end(JSON.stringify({ error: '"question" debe ser un objeto' }))
              return
            }

            // Construir ruta INTERNA usando solo valores validados — sin path del cliente
            const targetDir = path.resolve(process.cwd(), 'src', 'data', 'public', asignaturaId, 'preguntas')
            const filePath = path.resolve(targetDir, 'banco-preguntas.json')

            // Verificación de contención
            if (!filePath.startsWith(targetDir + path.sep)) {
              res.writeHead(403).end(JSON.stringify({ error: 'Ruta no permitida' }))
              return
            }

            if (!fs.existsSync(filePath)) {
              res.writeHead(404).end(JSON.stringify({
                error: `No existe banco de preguntas para "${asignaturaId}"`
              }))
              return
            }

            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            if (!Array.isArray(data)) {
              res.writeHead(500).end(JSON.stringify({ error: 'El banco de preguntas no es un array' }))
              return
            }

            const index = data.findIndex(q => q.id === questionId)
            if (index === -1) {
              res.writeHead(404).end(JSON.stringify({
                error: `No se encontró la pregunta "${questionId}" en el banco de "${asignaturaId}"`
              }))
              return
            }

            // id y asignaturaId no se pueden cambiar desde el editor
            data[index] = {
              ...question,
              id: data[index].id,
              asignaturaId: data[index].asignaturaId,
            }

            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')

            res.writeHead(200).end(JSON.stringify({ ok: true, updated: true, asignaturaId, questionId }))
          } catch (e) {
            res.writeHead(500).end(JSON.stringify({ error: e.message }))
          }
        })
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), localAdminPlugin()],
  base: '/StudyHub/',
})

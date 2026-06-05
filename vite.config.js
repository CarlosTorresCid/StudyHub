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
 * Expone POST /api/admin/publicar-tema para que la interfaz web pueda escribir
 * archivos JSON en src/data/public/ sin salir del navegador.
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
    }
  }
}

export default defineConfig({
  plugins: [react(), localAdminPlugin()],
  base: '/StudyHub/',
})

// localAdminService.js
// Cliente del endpoint de administración local (solo disponible en desarrollo).
// En producción (GitHub Pages), isAvailable() devuelve false y los métodos de escritura lanzan error.

export const localAdminService = {
  /** true solo durante npm run dev */
  isAvailable() {
    return import.meta.env.DEV
  },

  /**
   * Escribe el JSON de contenido en src/data/public/[asigId]/temas/[temaId]-contenido.json.
   * @returns {{ ok: true, existed: boolean, path: string }}
   */
  async publicarTema(content) {
    if (!this.isAvailable()) {
      throw new Error('La escritura de archivos solo está disponible en desarrollo local.')
    }
    const res = await fetch('/api/admin/publicar-tema', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    })
    const json = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    if (!res.ok) throw new Error(json.error || `Error HTTP ${res.status}`)
    return json
  },

  /**
   * Escribe el banco de preguntas en src/data/public/[asigId]/preguntas/banco-preguntas.json.
   * @returns {{ ok: true, existed: boolean, path: string, total: number }}
   */
  async publicarBancoPreguntas(asignaturaId, preguntas) {
    if (!this.isAvailable()) {
      throw new Error('La escritura de archivos solo está disponible en desarrollo local.')
    }
    const res = await fetch('/api/admin/publicar-banco-preguntas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asignaturaId, preguntas }),
    })
    const json = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    if (!res.ok) throw new Error(json.error || `Error HTTP ${res.status}`)
    return json
  },

  /**
   * Actualiza una pregunta existente dentro de src/data/public/[asigId]/preguntas/banco-preguntas.json.
   * @returns {{ ok: true, updated: true, asignaturaId: string, questionId: string }}
   */
  async actualizarPregunta({ asignaturaId, questionId, question }) {
    if (!this.isAvailable()) {
      throw new Error('La escritura de archivos solo está disponible en desarrollo local.')
    }
    const res = await fetch('/api/admin/actualizar-pregunta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asignaturaId, questionId, question }),
    })
    const json = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    if (!res.ok) throw new Error(json.error || `Error HTTP ${res.status}`)
    return json
  },
}

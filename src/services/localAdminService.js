// localAdminService.js
// Cliente del endpoint de administración local (solo disponible en desarrollo).
// En producción (GitHub Pages), isAvailable() devuelve false y publicarTema() lanza error.

export const localAdminService = {
  /** true solo durante npm run dev */
  isAvailable() {
    return import.meta.env.DEV
  },

  /**
   * Escribe el JSON de contenido en src/data/public/[asigId]/temas/[temaId]-contenido.json.
   * Solo funciona cuando el servidor de desarrollo Vite está activo.
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
}

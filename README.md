# StudyHub · UNIR

Aplicación personal de estudio para las asignaturas de Ingeniería Informática.

## Asignaturas
- SMPC · Sistemas Multiagente y Percepción Computacional
- CASI · Calidad y Auditoría de Sistemas de Información
- TE · Tecnologías Emergentes
- IAIC · Inteligencia Artificial e Ingeniería del Conocimiento
- AAMD · Aprendizaje Automático y Minería de Datos
- ISA · Ingeniería de Software Avanzada

## Desarrollo local
```bash
npm install
npm run dev
```

## Añadir contenido
Usa el prompt de carga para generar el JSON de cada asignatura y ponlo en `src/data/[id].json`.

## Publicar en GitHub Pages
1. Cambia `base` en `vite.config.js` por el nombre de tu repositorio
2. Haz push a `main`
3. El workflow de GitHub Actions desplegará automáticamente

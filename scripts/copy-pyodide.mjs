import fs from 'fs';
import path from 'path';

const sourceDir = path.resolve('node_modules/pyodide');
const targetDir = path.resolve('public/pyodide');

if (!fs.existsSync(sourceDir)) {
  console.error('No existe node_modules/pyodide. Ejecuta primero: npm install pyodide');
  process.exit(1);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });

    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }

    return;
  }

  fs.copyFileSync(src, dest);
}

copyRecursive(sourceDir, targetDir);

console.log('Pyodide copiado completo a public/pyodide');
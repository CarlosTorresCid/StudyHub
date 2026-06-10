import fs from 'fs';
import path from 'path';

const pyodideDir = path.resolve('public/pyodide');
const lockPath = path.join(pyodideDir, 'pyodide-lock.json');
const packagePath = path.join(pyodideDir, 'package.json');

if (!fs.existsSync(lockPath)) {
  console.error('No existe public/pyodide/pyodide-lock.json');
  console.error('Ejecuta primero: node scripts/copy-pyodide.mjs');
  process.exit(1);
}

if (!fs.existsSync(packagePath)) {
  console.error('No existe public/pyodide/package.json');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const pyodideVersion = packageJson.version;

const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
const packages = lock.packages || {};

const CDN_BASE = `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full`;

const rootPackages = [
  'micropip',
  'packaging',
  'numpy',
  'pandas',
  'scipy',
  'scikit-learn',
  'joblib',
  'threadpoolctl',
];

function normalizeName(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/[<>=!~].*$/, '');
}

function extractDependencyName(dep) {
  return normalizeName(dep.split(';')[0].trim());
}

function collectPackages(packageNames) {
  const selected = new Set();
  const pending = [...packageNames.map(normalizeName)];

  while (pending.length > 0) {
    const name = pending.pop();

    if (selected.has(name)) continue;
    if (!packages[name]) {
      console.warn(`Paquete no encontrado en lockfile: ${name}`);
      continue;
    }

    selected.add(name);

    const deps = packages[name].depends || [];
    for (const dep of deps) {
      const depName = extractDependencyName(dep);
      if (depName && !selected.has(depName)) {
        pending.push(depName);
      }
    }
  }

  return [...selected];
}

async function downloadFile(url, dest) {
  if (fs.existsSync(dest)) {
    console.log(`Ya existe: ${path.basename(dest)}`);
    return;
  }

  console.log(`Descargando: ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error descargando ${url}: ${response.status} ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(dest, buffer);
}

const selectedPackages = collectPackages(rootPackages);

console.log(`Versión Pyodide: ${pyodideVersion}`);
console.log(`Paquetes a descargar: ${selectedPackages.join(', ')}`);

for (const packageName of selectedPackages) {
  const info = packages[packageName];

  if (!info?.file_name) {
    console.warn(`Sin file_name para ${packageName}`);
    continue;
  }

  const url = `${CDN_BASE}/${info.file_name}`;
  const dest = path.join(pyodideDir, info.file_name);

  await downloadFile(url, dest);
}

console.log('Paquetes descargados correctamente en public/pyodide');
import { mkdir, readdir, copyFile, lstat, access, readFile, writeFile } from 'node:fs/promises';
import { resolve, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const destination = join(root, 'deployments', new Date().toISOString().replace(/[:.]/g, '-'));
const blocked = new Set(['node_modules', 'target', '.git', '.DS_Store', 'dist']);
async function copy(source, target) {
  const name = basename(source);
  if (blocked.has(name) || (/^\.env/.test(name) && !name.endsWith('.example')) || /\.(pem|key|local|log)$/.test(name)) return;
  const stat = await lstat(source);
  if (stat.isSymbolicLink()) throw new Error(`Refusing to export symlink: ${source}`);
  if (stat.isDirectory()) {
    await mkdir(target, { recursive: true });
    for (const entry of await readdir(source)) await copy(join(source, entry), join(target, entry));
  } else if (stat.isFile()) {
    await mkdir(resolve(target, '..'), { recursive: true }); await copyFile(source, target);
  }
}
const frontend = ['src', 'public', 'package.json', 'package-lock.json', 'index.html', 'vite.config.ts', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'tailwind.config.ts', 'postcss.config.js', 'eslint.config.js', 'components.json', 'vercel.json', 'netlify.toml', '.env.production.example', '.gitignore', '.dockerignore', 'deploy/frontend', 'tests/frontend'];
const backend = ['auth', 'organization', 'course', 'ai', 'migration', 'app', 'ops', 'scripts', 'contracts', 'docs', 'pom.xml', 'Dockerfile', 'compose.yml', 'compose.prod.yml', '.env.example', '.env.production.example', '.gitignore', '.dockerignore', 'README.md', 'STATUS.md'];
// Explicit allowlists keep credentials and unrelated project directories out of exports.
for (const file of frontend) { await access(join(root, file)); await copy(join(root, file), join(destination, 'frontend', file)); }
for (const file of backend) { await access(join(root, 'backend', file)); await copy(join(root, 'backend', file), join(destination, 'backend', file)); }
await copy(join(root, 'docs/DEPLOY.md'), join(destination, 'README.md'));
const packagePath = join(destination, 'frontend/package.json');
const manifest = JSON.parse(await readFile(packagePath, 'utf8'));
delete manifest.scripts['export:deploy'];
await writeFile(packagePath, JSON.stringify(manifest, null, 2) + '\n');
await copy(join(root, 'docs/DEPLOY.md'), join(destination, 'frontend/README.md'));
await copy(join(root, 'docs/DEPLOY.md'), join(destination, 'backend/DEPLOY.md'));
console.log(`Independent deployment packages: ${destination}`);

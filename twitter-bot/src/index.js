import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { TwitterApi } from 'twitter-api-v2';
import { pickNext, todayIn, validatePosts } from './queue.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_FILE = process.env.POSTS_FILE ?? path.join(root, 'posts.json');
const STATE_FILE = process.env.STATE_FILE ?? path.join(root, 'state.json');

const DRY_RUN = process.env.DRY_RUN === 'true';
const FORCE = process.env.FORCE === 'true';
const LOOP = process.env.LOOP !== 'false';
const TIMEZONE = process.env.TIMEZONE || 'America/Montevideo';

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT' && fallback !== undefined) return fallback;
    throw new Error(`No se pudo leer ${file}: ${err.message}`);
  }
}

function getClient() {
  const required = ['X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_SECRET'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Faltan variables de entorno: ${missing.join(', ')}`);
  }
  return new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_SECRET,
  });
}

async function main() {
  const posts = await readJson(POSTS_FILE);
  const errors = validatePosts(posts);
  if (errors.length) {
    throw new Error(`posts.json tiene errores:\n  - ${errors.join('\n  - ')}`);
  }

  const state = await readJson(STATE_FILE, { published: [] });
  const today = todayIn(TIMEZONE);
  const result = pickNext(posts, state, { today, loop: LOOP, force: FORCE });

  if (!result.post) {
    console.log(`Nada para publicar: ${result.reason}.`);
    return;
  }
  if (result.cycleReset) console.log('Se terminó la cola, empezando un nuevo ciclo.');

  console.log(`Publicación elegida (${result.post.id}):\n---\n${result.post.text}\n---`);

  if (DRY_RUN) {
    console.log('DRY_RUN activo: no se publica ni se guarda el estado.');
    return;
  }

  const { data } = await getClient().v2.tweet(result.post.text);
  console.log(`Publicado: https://x.com/i/web/status/${data.id}`);

  await writeFile(STATE_FILE, JSON.stringify(result.state, null, 2) + '\n');
  console.log(`Estado guardado en ${path.relative(process.cwd(), STATE_FILE)}`);
}

main().catch((err) => {
  console.error(err.data ? `${err.message}\n${JSON.stringify(err.data, null, 2)}` : err.message);
  process.exit(1);
});

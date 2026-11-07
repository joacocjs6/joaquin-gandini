// Lógica pura de la cola de publicaciones (sin red ni disco), fácil de testear.

export const MAX_TWEET_LENGTH = 280;

/** Fecha YYYY-MM-DD en la zona horaria dada (por defecto Montevideo). */
export function todayIn(timeZone = 'America/Montevideo', now = new Date()) {
  // en-CA formatea como YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', { timeZone }).format(now);
}

/** Largo aproximado según X: cada URL cuenta 23 caracteres. */
export function tweetLength(text) {
  const withoutUrls = text.replace(/https?:\/\/\S+/g, 'x'.repeat(23));
  return [...withoutUrls].length;
}

/** Valida la cola y devuelve una lista de errores (vacía si está todo bien). */
export function validatePosts(posts) {
  const errors = [];
  if (!Array.isArray(posts)) return ['posts.json debe ser un array'];
  const ids = new Set();
  posts.forEach((p, i) => {
    const where = `posts[${i}]`;
    if (!p || typeof p.id !== 'string' || !p.id.trim()) errors.push(`${where}: falta "id"`);
    else if (ids.has(p.id)) errors.push(`${where}: id duplicado "${p.id}"`);
    else ids.add(p.id);
    if (!p || typeof p.text !== 'string' || !p.text.trim()) errors.push(`${where}: falta "text"`);
    else if (tweetLength(p.text) > MAX_TWEET_LENGTH) {
      errors.push(`${where} (${p.id}): ${tweetLength(p.text)} caracteres, máximo ${MAX_TWEET_LENGTH}`);
    }
  });
  return errors;
}

/**
 * Elige la próxima publicación.
 * Devuelve { post, state } con el estado actualizado, o { post: null, reason }.
 */
export function pickNext(posts, state, { today, loop = true, force = false } = {}) {
  const published = new Set(state.published ?? []);

  if (!force && state.lastPostDate === today) {
    return { post: null, reason: `ya se publicó hoy (${today})` };
  }

  let pending = posts.filter((p) => !published.has(p.id));
  let cycleReset = false;
  if (pending.length === 0) {
    if (!loop || posts.length === 0) {
      return { post: null, reason: 'no quedan publicaciones pendientes en la cola' };
    }
    // Se terminó la cola: empieza un nuevo ciclo desde el principio.
    pending = posts;
    published.clear();
    cycleReset = true;
  }

  const post = pending[0];
  published.add(post.id);
  return {
    post,
    cycleReset,
    state: {
      published: [...published],
      lastPostDate: today,
      lastPostId: post.id,
    },
  };
}

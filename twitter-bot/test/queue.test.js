import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pickNext, todayIn, tweetLength, validatePosts } from '../src/queue.js';

const posts = [
  { id: 'a', text: 'uno' },
  { id: 'b', text: 'dos' },
];

test('elige la primera publicación pendiente', () => {
  const r = pickNext(posts, { published: ['a'] }, { today: '2026-11-07' });
  assert.equal(r.post.id, 'b');
  assert.deepEqual(r.state.published, ['a', 'b']);
  assert.equal(r.state.lastPostDate, '2026-11-07');
});

test('no publica dos veces el mismo día salvo con force', () => {
  const state = { published: ['a'], lastPostDate: '2026-11-07' };
  assert.equal(pickNext(posts, state, { today: '2026-11-07' }).post, null);
  assert.equal(pickNext(posts, state, { today: '2026-11-07', force: true }).post.id, 'b');
});

test('reinicia el ciclo al terminar la cola si loop está activo', () => {
  const state = { published: ['a', 'b'] };
  const r = pickNext(posts, state, { today: 'x', loop: true });
  assert.equal(r.post.id, 'a');
  assert.equal(r.cycleReset, true);
  assert.deepEqual(r.state.published, ['a']);
  assert.equal(pickNext(posts, state, { today: 'x', loop: false }).post, null);
});

test('las URLs cuentan 23 caracteres', () => {
  assert.equal(tweetLength('hola https://example.com/una/ruta/muy/larga/de/verdad'), 5 + 23);
});

test('detecta errores en la cola', () => {
  const errors = validatePosts([{ id: 'a', text: 'x' }, { id: 'a', text: '' }, { id: 'c', text: 'y'.repeat(281) }]);
  assert.equal(errors.length, 3);
});

test('posts.json del repo es válido', () => {
  const real = JSON.parse(readFileSync(new URL('../posts.json', import.meta.url), 'utf8'));
  assert.deepEqual(validatePosts(real), []);
});

test('todayIn usa la zona horaria', () => {
  const d = new Date('2026-11-08T01:00:00Z'); // 22:00 del 7 en Montevideo
  assert.equal(todayIn('America/Montevideo', d), '2026-11-07');
});

import 'dotenv/config';
import InstagramPost from '../models/InstagramPost.js';

// RapidAPI envs
function getRapidEnv() {
  const host = process.env.RAPIDAPI_HOST; // ex: instagram-scraper-stable-api.p.rapidapi.com
  const key  = process.env.RAPIDAPI_KEY;
  if (!host || !key) {
    console.error('[instagram.service] RAPIDAPI_HOST/KEY faltando');
    throw new Error('RAPIDAPI_MISCONFIG');
  }
  return { host, key };
}

// Busca posts via RapidAPI (quando não usamos o DB)
export async function getUserPostsByUsername(username) {
  if (!username) throw new Error('username obrigatório');
  const { host, key } = getRapidEnv();
  const url  = `https://${host}/get_ig_user_posts.php`;
  const body = new URLSearchParams({ username });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-rapidapi-host': host,
      'x-rapidapi-key': key,
    },
    body,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`RapidAPI ${res.status}: ${txt || res.statusText}`);
  }
  return res.json();
}

// ---- DB helpers ----
export async function getDbPostsByUsername(username, limit = 50) {
  const user = String(username).replace(/^@/, '').trim().toLowerCase();
  return InstagramPost.find({ username: user })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function replaceUserPosts(username, posts = []) {
  const user = String(username).replace(/^@/, '').trim().toLowerCase();
  await InstagramPost.deleteMany({ username: user });

  if (!posts.length) return { inserted: 0 };

  const docs = posts.map(p => ({
    username: user,
    createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
    likes:     Number(p.likes ?? 0),
    comments:  Number(p.comments ?? 0),
    caption:   String(p.caption ?? ''),
    image:     p.image ?? null,
    mediaType: p.mediaType ?? null,
  }));

  const res = await InstagramPost.insertMany(docs, { ordered: false });
  return { inserted: res.length };
}

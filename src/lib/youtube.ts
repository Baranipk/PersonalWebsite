// YouTube bağlantılarıyla ilgili yardımcılar. API anahtarı gerekmez.

const VIDEO_ID = /^[\w-]{11}$/;
const YOUTUBE_HOSTS = ['youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com'];

function parse(url: string): URL | null {
  try {
    const parsed = new URL(url.trim());
    parsed.hostname = parsed.hostname.replace(/^www\./, '');
    return parsed;
  } catch {
    return null;
  }
}

// Bağlantıdan video kimliğini çıkarır, bulamazsa null döner.
// Desteklenenler: youtu.be/ID, watch?v=ID, /embed/ID, /shorts/ID, /live/ID
export function getYouTubeId(url: string): string | null {
  const parsed = parse(url);
  if (!parsed) return null;

  let id: string | null = null;
  if (parsed.hostname === 'youtu.be') {
    id = parsed.pathname.split('/')[1];
  } else if (YOUTUBE_HOSTS.includes(parsed.hostname)) {
    const [, first, second] = parsed.pathname.split('/');
    if (first === 'watch') id = parsed.searchParams.get('v');
    else if (['embed', 'shorts', 'live', 'v'].includes(first)) id = second;
  }
  return id && VIDEO_ID.test(id) ? id : null;
}

// Oynatma listesi bağlantısından liste kimliğini çıkarır (…?list=ID)
export function getPlaylistId(url: string): string | null {
  const parsed = parse(url);
  if (!parsed || ![...YOUTUBE_HOSTS, 'youtu.be'].includes(parsed.hostname)) return null;
  const id = parsed.searchParams.get('list');
  return id && /^[\w-]+$/.test(id) ? id : null;
}

// Gömme adresleri (çerez kullanmayan alan adı)
export const embedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`;
export const playlistEmbedUrl = (listId: string) =>
  `https://www.youtube-nocookie.com/embed/videoseries?list=${listId}`;

// Küçük resimler. mqdefault (320×180) ve hqdefault (480×360) her videoda bulunur.
export const thumbnailUrl = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
export const posterUrl = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

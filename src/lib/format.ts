// Tarihi "7 Oct 2026" biçiminde yazar
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Adın baş harfleri (logo için): "Baran İpek" → "Bİ"
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toLocaleUpperCase('tr') ?? '')
    .join('');
}

// Okuma süresi (dakika). Dakikada yaklaşık 200 kelime varsayılır.
export function readingTime(text = ''): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// Etiketi adreste kullanılabilir hale getirir: "Game Jam" → "game-jam", "Tasarım" → "tasarim"
export function tagSlug(tag: string): string {
  return tag
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // aksan işaretlerini at (ş → s, ğ → g)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

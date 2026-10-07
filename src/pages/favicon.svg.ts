// Sekme simgesi: adın baş harfleri. Ad panelden değişince simge de değişir.
import site from '../data/site.json';
import { initials } from '../lib/format';

export function GET() {
  const text = initials(site.name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#ff8552"/>
  <text x="32" y="33" text-anchor="middle" dominant-baseline="central"
    font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="${text.length > 1 ? 28 : 36}"
    fill="#0e1014">${text}</text>
</svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
}

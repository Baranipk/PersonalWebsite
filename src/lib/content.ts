// İçerik listelerini getiren yardımcılar.
// Taslaklar geliştirme sunucusunda görünür, derlenmiş sitede gizlenir.
import { getCollection } from 'astro:content';
import { tagSlug } from './format';

const showDrafts = import.meta.env.DEV;

// Blog yazıları, en yeni önce
export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => showDrafts || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

// Projeler, "order" değeri küçük olan önce
export async function getProjects() {
  const projects = await getCollection('projects', ({ data }) => showDrafts || !data.draft);
  return projects.sort((a, b) => a.data.order - b.data.order);
}

// Tüm etiketler, her biri kaç yazıda geçtiğiyle birlikte (çok kullanılan önce).
// "Unity" ve "unity" aynı etiket sayılır; ilk görülen yazılış gösterilir.
export async function getTags() {
  const tags = new Map<string, { slug: string; name: string; count: number }>();
  for (const post of await getPosts()) {
    for (const name of post.data.tags) {
      const slug = tagSlug(name);
      if (!slug) continue; // yalnızca işaretten oluşan etiketleri atla
      const tag = tags.get(slug) ?? { slug, name, count: 0 };
      tag.count++;
      tags.set(slug, tag);
    }
  }
  return [...tags.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

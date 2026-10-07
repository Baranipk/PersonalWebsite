// İçerik listelerini getiren yardımcılar.
// Taslaklar geliştirme sunucusunda görünür, derlenmiş sitede gizlenir.
import { getCollection } from 'astro:content';

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

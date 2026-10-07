// RSS akışı: /rss.xml
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import site from '../data/site.json';
import { ui } from '../data/ui';
import { getPosts } from '../lib/content';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `${site.name} — ${ui.blog.title}`,
    description: ui.blog.intro,
    // Domain astro.config.mjs içine yazılana kadar yerel adres kullanılır
    site: context.site ?? 'http://localhost:4321',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: `/blog/${post.id}/`,
    })),
  });
}

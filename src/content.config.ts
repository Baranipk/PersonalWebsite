// İçerik şemaları. Buradaki alanlar public/admin/config.yml ile birebir aynı olmalı.
import { defineCollection, type ImageFunction } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { getPlaylistId, getYouTubeId } from './lib/youtube';

// YouTube bağlantısı alanları: geçersiz bağlantı derlemede açık bir hata verir
const youtubeVideo = z
  .string()
  .refine((url) => getYouTubeId(url), 'Not a valid YouTube video link');
const youtubePlaylist = z
  .string()
  .refine((url) => getPlaylistId(url), 'Not a valid YouTube playlist link (needs "?list=...")');

// Görseller içeriğin yanında durmalı; internet bağlantısı (https://...) kabul edilmez
const localImage = (image: ImageFunction) =>
  image().refine(
    // Astro bu aşamada değerin başına kendi işaretini ekler; bu yüzden "://" aranır
    (value) => !(typeof value === 'string' && value.includes('://')),
    'Use an uploaded image file, not a web link. Upload the image in the admin panel instead.',
  );

// Blog yazıları: src/content/blog/<yazi>/index.md
const blog = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/blog',
    // Kimlik olarak klasör adını kullan ("yazi-adi/index" yerine "yazi-adi")
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      cover: localImage(image).optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

// Projeler: src/content/projects/<proje>/index.md
const projects = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      cover: localImage(image),
      // Bilgi kutusu
      year: z.number().int(),
      role: z.string(),
      engine: z.string(),
      duration: z.string().optional(),
      team: z.string().optional(),
      platform: z.string().optional(),
      order: z.number().default(100),
      links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
      videos: z.array(z.object({ title: z.string(), url: youtubeVideo })).default([]),
      playlist: youtubePlaylist.optional(),
      gallery: z.array(z.object({ image: localImage(image), caption: z.string().optional() })).default([]),
      draft: z.boolean().default(false),
    }),
});

// Tekil sayfalar (Hakkımda gibi): src/content/pages/<sayfa>.md
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { blog, projects, pages };

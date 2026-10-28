import type { MetadataRoute } from 'next';
import { locales, hreflang } from '@/lib/i18n';
import { posts } from '@/lib/posts';

export const dynamic = 'force-dynamic';

type SitemapEntry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = process.env.SITE_URL?.replace(/\/$/, '') || 'https://a2pdistribution.com';
  const articleList = await posts();
  const paths = ['', '/blog', '/privacidade', ...['supermercados','mercearias','cafes','snack-bares','restaurantes','hotelaria'].map(slug => `/setores/${slug}`), ...articleList.map((post) => `/blog/${post.slug}`)];

  return paths.flatMap((path) =>
    locales.map((lang): SitemapEntry => ({
      url: `${host}/${lang}${path}`,
      lastModified: new Date(
        articleList.find((post) => `/blog/${post.slug}` === path)?.date || '2026-10-28',
      ),
      // Tipagem contextual evita o TS1355 causado por `(...) as const`.
      changeFrequency: path.startsWith('/blog/') ? 'monthly' : 'weekly',
      priority: path === '' ? 1 : path === '/blog' ? 0.8 : 0.55,
      alternates: {
        languages: Object.fromEntries(
          locales.map((locale) => [hreflang[locale], `${host}/${locale}${path}`]),
        ),
      },
    })),
  );
}

import type { MetadataRoute } from 'next';

const SITE_URL = 'https://renoxium.com';
const ROUTES = ['', '/craft', '/process', '/edge', '/faq', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: path === '' ? 1.0 : 0.8,
  }));
}

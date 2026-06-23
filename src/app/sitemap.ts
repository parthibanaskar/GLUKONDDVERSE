import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/career`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/studio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/club`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];
}

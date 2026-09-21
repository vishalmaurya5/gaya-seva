import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.gayaseva.com';

  const publicRoutes = [
    { url: '', priority: 1.0, changeFrequency: 'daily' as const },
    { url: '/gaya', priority: 0.95, changeFrequency: 'daily' as const },
    { url: '/pind-daan', priority: 0.95, changeFrequency: 'daily' as const },
    { url: '/pitru-paksha', priority: 0.95, changeFrequency: 'daily' as const },
    { url: '/gaya-taxi', priority: 0.90, changeFrequency: 'daily' as const },
    { url: '/services', priority: 0.90, changeFrequency: 'daily' as const },
    { url: '/pandit', priority: 0.90, changeFrequency: 'daily' as const },
    { url: '/pick-drop', priority: 0.90, changeFrequency: 'daily' as const },
    { url: '/stay', priority: 0.90, changeFrequency: 'daily' as const },
    { url: '/places/vishnupad', priority: 0.85, changeFrequency: 'weekly' as const },
    { url: '/places/falgu-river', priority: 0.85, changeFrequency: 'weekly' as const },
    { url: '/places/akshayavat', priority: 0.85, changeFrequency: 'weekly' as const },
    { url: '/places/bodh-gaya', priority: 0.85, changeFrequency: 'weekly' as const },
    { url: '/about', priority: 0.70, changeFrequency: 'monthly' as const },
    { url: '/contact', priority: 0.70, changeFrequency: 'monthly' as const },
    { url: '/faq', priority: 0.70, changeFrequency: 'weekly' as const },
    { url: '/privacy', priority: 0.50, changeFrequency: 'yearly' as const },
    { url: '/terms', priority: 0.50, changeFrequency: 'yearly' as const },
    { url: '/provider-terms', priority: 0.50, changeFrequency: 'yearly' as const },
    { url: '/help', priority: 0.70, changeFrequency: 'weekly' as const },
    { url: '/help/lost-and-found', priority: 0.70, changeFrequency: 'daily' as const },
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

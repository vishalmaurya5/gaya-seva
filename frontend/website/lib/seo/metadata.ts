import { Metadata } from 'next';
import { SITE_SEO_CONFIG } from './config';

export interface ConstructMetadataParams {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
}

export function constructMetadata({
  title,
  description = SITE_SEO_CONFIG.defaultDescription,
  path = '',
  keywords = [],
  image = SITE_SEO_CONFIG.defaultOgImage,
  noIndex = false,
  type = 'website',
  publishedTime,
}: ConstructMetadataParams = {}): Metadata {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${SITE_SEO_CONFIG.baseUrl}${cleanPath === '/' ? '' : cleanPath}`;
  const resolvedTitle = title 
    ? `${title} | ${SITE_SEO_CONFIG.siteName}`
    : SITE_SEO_CONFIG.defaultTitle;

  const combinedKeywords = Array.from(
    new Set([...keywords, ...SITE_SEO_CONFIG.keywords])
  );

  return {
    metadataBase: new URL(SITE_SEO_CONFIG.baseUrl),
    title: resolvedTitle,
    description,
    keywords: combinedKeywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'hi-IN': canonicalUrl,
        'en-IN': canonicalUrl,
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_SEO_CONFIG.siteName,
      locale: SITE_SEO_CONFIG.defaultLocale,
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || SITE_SEO_CONFIG.defaultTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      images: [image],
      creator: '@gayaseva',
    },
    icons: {
      icon: '/icongaya.jpeg',
      shortcut: '/icongaya.jpeg',
      apple: '/gayaseva.png',
    },
    manifest: '/manifest.json',
  };
}

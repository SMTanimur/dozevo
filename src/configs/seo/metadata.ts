import { metaKeywords } from './keywords';
import type { Metadata } from 'next';
import { siteConfig } from './site';

export const defaultMetadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'TaskZen - Organize Your Work',
    template: 'TaskZen | %s',
  },
  description:
    'TaskZen helps you manage your tasks and projects efficiently.',
  keywords: metaKeywords.join(', '),
  creator: 'SM Tanimur Rahman',
  publisher: 'SM Tanimur Rahman',
  applicationName: 'TaskZen',
  viewport: 'width=device-width, initial-scale=1.0',
  colorScheme: 'light',
  category: 'Task Management, Project Management, Productivity App',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  authors: [
    {
      name: 'SM Tanimur Rahman',
      url: 'https://yourwebsite.com/', // Replace with your actual URL
    },
  ],
  themeColor: '#ffffff',
  appLinks: {
    web: {
      url: siteConfig.url,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: 'TaskZen',
    title: 'TaskZen - Organize Your Work',
    description:
      'TaskZen helps you manage your tasks and projects efficiently.',
    images: [
      {
        url: `${siteConfig.url}/images/seo_image.png`,
        width: 800,
        height: 600,
        alt: 'TaskZen - Organize Your Work',
      },
    ],
    emails: ['mushfiqtanim@gmail.com'], // Replace with your actual email
    countryName: 'Bangladesh',
  },
  twitter: {
    creator: '@SM Tanimur Rahman',
    site: '@TaskZen',
    card: 'summary_large_image',
    title: 'TaskZen - Organize Your Work',
    description:
      'TaskZen helps you manage your tasks and projects efficiently.',
    images: [
      {
        url: `${siteConfig.url}/images/seo_image.png`,
        width: 800,
        height: 600,
        alt: 'TaskZen - Organize Your Work',
      },
    ],
  },
} as Metadata;
import { metaKeywords } from "./keywords";
import { siteCorConfig } from "./site-config";


type MetadataProps = {
  title?: string;
  description?: string;
  canonical: string;
  ogImage?: string;
  keywords?: string[];
};

const defaultMetadata = {
  title: 'Dozevo - Organize Your Work',
  description:
    'Dozevo helps you manage your tasks and projects efficiently.',
};

export const normalizeDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export const constructMetadata = ({
  title,
  description = defaultMetadata.description,
  canonical = '/',
  ogImage =  `${siteCorConfig.url}/images/seo_image.png`,
  keywords = [],
}: MetadataProps) => {
  return {
    metadataBase: new URL('https://Dozevo-ai.vercel.app/'),
    title: title ? `${title} - Dozevo` : defaultMetadata.title,
    description,
    keywords: [
      ...metaKeywords,
      ...keywords
    ],
    alternates: {
      canonical,
    },

    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'OG Image',
        },
      ],
    },

    authors: [
      {
        name: 'SM Tanimur Rahman',
        url: siteCorConfig.url
      },
    ],
    themeColor: '#ffffff',
    appLinks: {
      web: {
        url: siteCorConfig.url,
      },
    },
   
    twitter: {
      creator: '@SMTanimur',
      site: '@Dozevo',
      card: 'summary_large_image',
      title: 'Dozevo - Organize Your Work',
      description:
        'Dozevo is a task management tool that helps you manage your tasks and projects efficiently.',
      images: [
        {
          url: `${siteCorConfig.url}/images/seo_image.png`,
          width: 1200,
          height: 630,
          alt: 'VisualFlow - Workflow Automation & Visual Development Platform',
        },
      ],
    },

    other: {
      'og:image': `${siteCorConfig.url}/images/seo_image.png`,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:type': 'image/png',
      'og:image:secure_url': `${siteCorConfig.url}/images/seo_image.png`,
      'og:image:alt':
        'Dozevo - Organize Your Work',
      'twitter:image': `${siteCorConfig.url}/images/seo_image.png`,
      'twitter:card': 'summary_large_image',
    },

    // --- will add this once we get the logo ---
    // icons: {
    //   icon: "/icon.png",
    //   shortcut: "/icon.png",
    //   apple: "/icon.png",
    // },

    // --- need a twitter handle for this ---
    // twitter: {
    //   title,
    //   description,
    //   creator: "@trypearai",
    //   site: "trypear.ai",
    //   card: "summary_large_image",
    // },
  };
};

import type { Metadata, Viewport } from 'next';
import { Fraunces, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz', 'SOFT'],
  display: 'swap',
  variable: '--font-fraunces',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

const SITE_URL = 'https://renoxium.com';
const SITE_TITLE = 'Renoxium · A senior engineering studio';
const SITE_DESCRIPTION =
  'A boutique senior engineering studio in Dubai. Briefs to prototypes in a week, v1 in a quarter.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: '%s · Renoxium' },
  description: SITE_DESCRIPTION,
  keywords: [
    'Renoxium',
    'senior engineering studio',
    'software studio',
    'Dubai',
    'web development',
    'mobile apps',
    'SaaS',
    'prototyping',
  ],
  authors: [{ name: 'Renoxium' }],
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '192x192', type: 'image/png' },
      { url: '/renoxium.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    siteName: 'Renoxium',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        secureUrl: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Renoxium · A senior engineering studio.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: '/og-image.png', alt: 'Renoxium · A senior engineering studio.' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#14151B',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://renoxium.com/#organization',
      name: 'Renoxium',
      alternateName: 'Renoxium Studio',
      url: 'https://renoxium.com/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://renoxium.com/og-image.png',
        width: 1200,
        height: 630,
      },
      image: 'https://renoxium.com/og-image.png',
      description:
        'A boutique senior engineering studio in Dubai. A seasoned team turning briefs into prototypes in a week and v1 in a quarter.',
      email: 'Raviouliti@renoxium.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dubai',
        addressRegion: 'Dubai',
        addressCountry: 'AE',
      },
      areaServed: { '@type': 'Place', name: 'Worldwide' },
      knowsAbout: [
        'SaaS platforms',
        'AI applications',
        'Web applications',
        'Mobile applications',
        'Rapid prototyping',
        'Senior software engineering',
        'Boutique technology studio',
      ],
      founder: { '@type': 'Person', name: 'Renoxium founding team' },
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://renoxium.com/#website',
      url: 'https://renoxium.com/',
      name: 'Renoxium',
      description: 'A senior engineering studio in Dubai.',
      publisher: { '@id': 'https://renoxium.com/#organization' },
      inLanguage: 'en',
    },
    {
      '@type': 'ProfessionalService',
      '@id': 'https://renoxium.com/#service',
      name: 'Renoxium engineering studio',
      url: 'https://renoxium.com/',
      image: 'https://renoxium.com/og-image.png',
      description:
        'Boutique senior engineering studio. SaaS platforms, AI applications, web and mobile apps, rapid prototyping, end to end delivery.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dubai',
        addressCountry: 'AE',
      },
      priceRange: '$$$',
      areaServed: 'Worldwide',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Engagements',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SaaS platforms', description: 'Subscription software your customers log into every day. Full stack: tenants, billing, admin, audit logs.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI applications', description: 'Software that puts AI to real work: chat over your documents, agents that take action, automation that holds up in production.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web applications', description: 'Websites that do something, not brochures. Bookings, dashboards, marketplaces, internal tools.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mobile apps', description: 'iOS and Android apps. Native when the experience demands it, React Native when one codebase fits.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Rapid prototyping', description: 'Idea to real working software in seven days.' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'A to Z delivery', description: 'One vendor for the full lifecycle: discovery, design, build, launch, monitoring.' } },
        ],
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {children}
        <div id="cursor-ring" aria-hidden="true" />
        <div id="cursor" aria-hidden="true" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}

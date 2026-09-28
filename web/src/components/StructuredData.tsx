import type { ModuleDoc } from '../content'

const BASE_URL = 'https://levi5.github.io/funcio/'
const REPO_URL = 'https://github.com/levi5/funcio'
const NPM_URL = 'https://www.npmjs.com/package/funcio'

const softwareApplication = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Funcio',
  description:
    'Functional programming toolkit for TypeScript: Maybe, Either, pipe, curry, pattern matching and immutable object helpers. Zero dependencies, runs in Node and browser.',
  url: BASE_URL,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Cross-platform',
  programmingLanguage: ['TypeScript', 'JavaScript'],
  license: 'https://opensource.org/licenses/MIT',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock'
  },
  author: {
    '@type': 'Organization',
    name: 'levi5',
    url: 'https://github.com/levi5'
  },
  publisher: {
    '@type': 'Organization',
    name: 'levi5',
    url: 'https://github.com/levi5'
  },
  codeRepository: REPO_URL,
  downloadUrl: NPM_URL,
  featureList: [
    'Maybe (Option type)',
    'Either (Result type)',
    'pipe (function composition)',
    'curry (automatic currying)',
    'match (pattern matching)',
    'Immutable object helpers',
    'Functional array methods'
  ],
  keywords: 'functional programming, TypeScript, JavaScript, Maybe, Either, pipe, curry, pattern matching, immutable',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '1',
    bestRating: '5',
    worstRating: '1'
  }
}

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Funcio zero-dependency?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Funcio has zero runtime dependencies. It is a lightweight functional programming toolkit (~1.5KB gzipped).'
      }
    },
    {
      '@type': 'Question',
      name: 'Does Funcio work in both Node.js and the browser?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, the same code runs in Node.js and browsers without platform-specific assumptions or polyfills.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is Funcio written in TypeScript?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Funcio is written in TypeScript and provides full type inference for all utilities including pipe, curry, match, Maybe, and Either.'
      }
    },
    {
      '@type': 'Question',
      name: 'What license does Funcio use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Funcio is MIT licensed — free for personal and commercial use.'
      }
    },
    {
      '@type': 'Question',
      name: 'Where can I find the source code?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The source code is available on GitHub at github.com/levi5/funcio.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do I install Funcio?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Install via npm: `npm install funcio` or `pnpm add funcio` or `yarn add funcio`.'
      }
    }
  ]
}

function breadcrumbList(activeModule?: string) {
  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL }]
  if (activeModule) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: activeModule,
      item: `${BASE_URL}#${activeModule}`
    })
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
  }
}

function codeSnippets(module: ModuleDoc) {
  return module.examples.map((ex: ModuleDoc['examples'][0]) => ({
    '@context': 'https://schema.org',
    '@type': 'Code',
    name: ex.title,
    description: ex.description,
    code: ex.code,
    programmingLanguage: 'TypeScript',
    codeSampleType: 'full'
  }))
}

export const StructuredData = ({ modules, activeModule }: { modules: ModuleDoc[]; activeModule?: string }) => {
  const allSchemas = [
    softwareApplication,
    faqPage,
    breadcrumbList(activeModule),
    ...modules.flatMap((m) => codeSnippets(m))
  ]

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(allSchemas) }} />
}

export const hero = {
  eyebrow: 'Frontend developer • React & TypeScript',
  title: 'Marek Dolníček',
  subtitle: 'Enterprise-ready React developer based in Prague.',
  body:
    'Over the past decade I have delivered internal portals for O2 Czech Republic, TESCO Stores CZ, MONETA Auto, České dráhy, JABLOTRON GROUP and other Czech brands. I own the front-end in React and TypeScript, tie it back to Java or PHP APIs, and keep Material UI and custom design systems lean and performant while constantly learning—from orchestrating AI agents to experimenting with DevOps practices.',
  primaryCta: {
    label: 'Email marekdolnicek@gmail.com',
    href: 'mailto:marekdolnicek@gmail.com'
  },
  secondaryCta: {
    label: 'View experience timeline',
    href: '#timeline'
  }
};

export const highlightStats = [
  { label: 'Years in frontend', value: '8+' },
  { label: 'Enterprise portals delivered', value: '7' },
  { label: 'Freelance since', value: '2017' }
];

export const skillClusters = [
  {
    name: 'React delivery',
    bullets: ['React, Next.js & Gatsby', 'Redux, Formik & React Hook Form', 'Material UI & custom design systems']
  },
  {
    name: 'Backend & data layer',
    bullets: ['Java & PHP APIs', 'REST + GraphQL integrations', 'PostgreSQL & MySQL administration']
  },
  {
    name: 'Tooling, AI & DevOps',
    bullets: [
      'Webpack, Gulp, Vite build systems',
      'Prompting + managing AI copilots',
      'CI/CD habits, monitoring, performance budgets'
    ]
  }
];

export const timelineEntries = [
  {
    id: 'neovia',
    year: '2024 – 2026',
    title: 'Frontend Developer @ NEOVIA',
    summary:
      'Extended O2 Czech Republic internal tooling with React/TypeScript modules powered by Redux, Zustand, and Material UI while pairing with DevOps peers on Dockerized GitHub Actions pipelines, MongoDB data, and Playwright quality gates.',
    stack: ['React', 'TypeScript', 'Redux', 'Zustand', 'Material UI', 'MongoDB', 'Docker']
  },
  {
    id: 'consware',
    year: '2022 – 2024',
    title: 'Frontend Developer @ CONSWARE',
    summary:
      'Owned the front-end for an internal operations platform used by TESCO Stores CZ teams, delivering React/TypeScript modules, Material UI components, and integrations with Java REST APIs and PostgreSQL.',
    stack: ['React', 'TypeScript', 'Redux', 'Formik', 'Java REST', 'PostgreSQL']
  },
  {
    id: 'bootiq',
    year: '2021 – 2022',
    title: 'Frontend Developer @ BOOTIQ',
    summary:
      'Delivered internal portals for MONETA Auto and České dráhy plus the OREA HOTELS web presence, combining Next.js, React Hook Form, and reusable CSS systems.',
    stack: ['Next.js', 'React Hook Form', 'Redux', 'Styled Components', 'Tailwind CSS']
  },
  {
    id: 'synetech',
    year: '2020 – 2021',
    title: 'Frontend Developer @ SYNETECH',
    summary:
      'Created React + Gatsby applications for JABLOTRON GROUP alongside bespoke sites, wiring GraphQL data sources and extending Material UI themes.',
    stack: ['Gatsby', 'GraphQL', 'TypeScript', 'Material UI', 'Jest']
  },
  {
    id: 'coolcredit',
    year: '2018 – 2020',
    title: 'Frontend Developer @ COOL CREDIT',
    summary:
      'Maintained lending web systems, migrating Vanilla JS and Symfony interfaces to modular React components with SASS/BEM design language.',
    stack: ['Vanilla JS', 'React', 'Symfony', 'SASS', 'Webpack']
  },
  {
    id: 'osvc',
    year: '2017 – present',
    title: 'Freelance web specialist',
    summary:
      'Operate a long-running web services practice delivering marketing sites, SEO support, e-commerce builds, and small game experiments.',
    stack: ['WordPress', 'SEO', 'E-commerce', 'HTML/CSS']
  }
];

export const aiIdeas = [
  {
    id: 'o2',
    title: 'O2 Czech Republic care cockpit',
    description:
      'React/Redux workspace with Zustand-backed helpers that lets support teams track fiber builds, automate reminders, and run MongoDB-backed reporting while Docker pipelines keep releases safe.',
    impact: 'Keeps telecom teams on a single view of service health and client escalations.'
  },
  {
    id: 'tesco',
    title: 'TESCO Stores CZ operations portal',
    description:
      'Internal React/TypeScript platform supporting store teams with Material UI dashboards backed by Java REST APIs and PostgreSQL data.',
    impact: 'Standardized workflows for Czech hypermarkets and reduced manual reporting.'
  },
  {
    id: 'moneta',
    title: 'MONETA Auto onboarding suite',
    description:
      'Next.js + React Hook Form tooling that handles loan advisor workflows, validations, and REST integrations for the automotive finance team.',
    impact: 'Cut onboarding time for new finance products and improved data consistency.'
  },
  {
    id: 'jablotron',
    title: 'JABLOTRON service dashboard',
    description:
      'Gatsby application that aggregates device and installer data via GraphQL plus automated accessibility and Jest checks.',
    impact: 'Gave hardware partners a single place to inspect deployments and share updates.'
  }
];

export const contactLinks = [
  { label: 'Email', value: 'marekdolnicek@gmail.com', href: 'mailto:marekdolnicek@gmail.com' },
  { label: 'Phone', value: '+420 603 225 154', href: 'tel:+420603225154' },
  { label: 'LinkedIn', value: 'in/marekdolnicek', href: 'https://www.linkedin.com/in/marekdolnicek' }
];

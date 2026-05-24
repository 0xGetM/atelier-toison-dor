# Atelier La Toison d'Or — Site Web Implementation Plan

> **For agentic workers:** Use `subagent-driven-development` (recommended) or `executing-plans` to implement this plan task-by-task.

**Goal:** Build a 6-page static website for Atelier La Toison d'Or, atelier couture/retouches Paris 14e, optimized for local SEO, mobile-first, with before/after slider and appointment form.

**Architecture:** Astro 4.x static site with Tailwind CSS v3. Each page is a standalone `.astro` file; shared UI lives in `src/components/`; a single `Layout.astro` provides `<head>` (SEO, Schema.org), Header and Footer. No framework JS — vanilla JS only for the slider and mobile nav.

**Tech Stack:** Astro 4, Tailwind CSS 3, DM Sans + Cormorant Garamond (Google Fonts via `<link>`), Formspree (contact form), OpenStreetMap embed (map), Vercel (deployment).

---

## File Map

```
atelier-toison-dor/
├── public/
│   ├── favicon.svg
│   └── images/
│       ├── hero-atelier.jpg          ← placeholder (dark linen texture)
│       ├── fondatrice.jpg
│       ├── atelier-1.jpg
│       ├── atelier-2.jpg
│       ├── before-1.jpg / after-1.jpg
│       ├── before-2.jpg / after-2.jpg
│       └── before-3.jpg / after-3.jpg
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── SEO.astro
│   │   ├── BeforeAfterSlider.astro
│   │   ├── ServiceCard.astro
│   │   ├── TestimonialCard.astro
│   │   └── FAQItem.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── services.astro
│   │   ├── realisations.astro
│   │   ├── a-propos.astro
│   │   ├── faq.astro
│   │   └── contact.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── vercel.json
```

---

### Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `src/styles/global.css`
- Create: `public/favicon.svg`
- Create: `vercel.json`

- [ ] **Step 1: Initialise project with npm**

```bash
cd atelier-toison-dor
npm create astro@latest . -- --template minimal --no-install --no-git
npm install
npm install -D @astrojs/tailwind tailwindcss
npm install -D @tailwindcss/typography
```

- [ ] **Step 2: Write `astro.config.mjs`**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  site: 'https://atelier-toison-dor.fr',
});
```

- [ ] **Step 3: Write `tailwind.config.mjs`**

```js
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        lin:       '#E8DFD0',
        terracotta:'#C27044',
        creme:     '#FAFAF7',
        anthracite:'#2D2D2D',
        'terracotta-dark': '#A85C30',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.anthracite'),
            fontFamily: theme('fontFamily.sans').join(', '),
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
```

- [ ] **Step 4: Write `src/styles/global.css`**

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    font-family: 'DM Sans', system-ui, sans-serif;
    color: #2D2D2D;
    background-color: #FAFAF7;
  }

  h1, h2, h3, h4 {
    font-family: 'Cormorant Garamond', Georgia, serif;
  }

  /* Fade-up animation */
  .fade-up {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .fade-up.visible {
    opacity: 1;
    transform: translateY(0);
  }
}

@layer components {
  .btn-primary {
    @apply inline-block bg-terracotta text-creme font-sans font-medium px-7 py-3 rounded-sm transition-colors duration-200 hover:bg-terracotta-dark;
  }
  .btn-outline {
    @apply inline-block border border-terracotta text-terracotta font-sans font-medium px-7 py-3 rounded-sm transition-colors duration-200 hover:bg-terracotta hover:text-creme;
  }
  .section-title {
    @apply font-serif text-3xl md:text-4xl text-anthracite leading-tight;
  }
  .section-subtitle {
    @apply font-sans text-sm uppercase tracking-widest text-terracotta mb-3;
  }
}
```

- [ ] **Step 5: Write `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="4" fill="#C27044"/>
  <text x="16" y="22" font-size="18" text-anchor="middle" fill="#FAFAF7" font-family="serif">T</text>
</svg>
```

- [ ] **Step 6: Write `vercel.json`**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Expected: `http://localhost:4321` responds with blank Astro page.

- [ ] **Step 8: Commit**

```bash
git init
git add .
git commit -m "chore: init Astro + Tailwind project"
```

---

### Task 2: Layout Component

**Files:**
- Create: `src/layouts/Layout.astro`

- [ ] **Step 1: Write `src/layouts/Layout.astro`**

```astro
---
// src/layouts/Layout.astro
export interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  schema?: object;
}

const {
  title,
  description,
  canonical,
  ogImage = '/images/og-default.jpg',
  schema,
} = Astro.props;

const siteUrl = 'https://atelier-toison-dor.fr';
const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl + Astro.url.pathname;

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Atelier La Toison d'Or",
  "image": `${siteUrl}/images/hero-atelier.jpg`,
  "url": siteUrl,
  "telephone": "+33-1-XX-XX-XX-XX",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "XX rue d'Alésia",
    "addressLocality": "Paris",
    "postalCode": "75014",
    "addressCountry": "FR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 48.8282,
    "longitude": 2.3264
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "09:30",
      "closes": "19:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday"],
      "opens": "10:00",
      "closes": "18:00"
    }
  ],
  "priceRange": "€€",
  "servesCuisine": null,
  "areaServed": [
    {"@type": "Place", "name": "Paris 14e"},
    {"@type": "Place", "name": "Montparnasse"},
    {"@type": "Place", "name": "Alésia"},
    {"@type": "Place", "name": "Denfert-Rochereau"}
  ],
  "description": "Atelier de couture, retouches et confection textile à Paris 14e. Retouches soignées, confection sur mesure, réparation de vêtements.",
  "sameAs": [
    "https://maps.google.com/?cid=VOTRE_CID"
  ],
  ...(schema || {})
};
---

<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalUrl} />
    <meta name="robots" content="index, follow" />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:image" content={`${siteUrl}${ogImage}`} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="fr_FR" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;600&display=swap"
      rel="stylesheet"
    />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- Schema.org -->
    <script type="application/ld+json" set:html={JSON.stringify(localBusinessSchema)} />
  </head>
  <body class="bg-creme text-anthracite font-sans antialiased">
    <slot name="header" />
    <main>
      <slot />
    </main>
    <slot name="footer" />

    <!-- Fade-up intersection observer -->
    <script>
      const observer = new IntersectionObserver(
        (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
        { threshold: 0.1 }
      );
      document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    </script>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add Layout component with SEO + Schema.org"
```

---

### Task 3: Header Component

**Files:**
- Create: `src/components/Header.astro`

- [ ] **Step 1: Write `src/components/Header.astro`**

```astro
---
// src/components/Header.astro
const navLinks = [
  { href: '/',             label: 'Accueil' },
  { href: '/services',     label: 'Services' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/a-propos',     label: 'À propos' },
  { href: '/faq',          label: 'FAQ' },
  { href: '/contact',      label: 'Contact' },
];

const currentPath = Astro.url.pathname;
---

<header class="bg-creme border-b border-lin sticky top-0 z-50">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16 md:h-20">

      <!-- Logo -->
      <a href="/" class="flex flex-col leading-none group">
        <span class="font-serif text-xl md:text-2xl text-anthracite tracking-wide group-hover:text-terracotta transition-colors">
          La Toison d'Or
        </span>
        <span class="font-sans text-[10px] uppercase tracking-widest text-terracotta">
          Atelier couture · Paris 14e
        </span>
      </a>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-8">
        {navLinks.map(link => (
          <a
            href={link.href}
            class:list={[
              'font-sans text-sm transition-colors duration-150',
              currentPath === link.href || (link.href !== '/' && currentPath.startsWith(link.href))
                ? 'text-terracotta font-medium'
                : 'text-anthracite hover:text-terracotta'
            ]}
          >
            {link.label}
          </a>
        ))}
        <a href="/contact" class="btn-primary text-sm py-2 px-5">
          Prendre rendez-vous
        </a>
      </nav>

      <!-- Mobile menu button -->
      <button
        id="menu-btn"
        aria-label="Ouvrir le menu"
        aria-expanded="false"
        class="md:hidden flex flex-col gap-1.5 p-2"
      >
        <span class="block w-6 h-0.5 bg-anthracite transition-all" id="bar1"></span>
        <span class="block w-6 h-0.5 bg-anthracite transition-all" id="bar2"></span>
        <span class="block w-6 h-0.5 bg-anthracite transition-all" id="bar3"></span>
      </button>
    </div>
  </div>

  <!-- Mobile menu -->
  <div id="mobile-menu" class="hidden md:hidden bg-creme border-t border-lin px-4 pb-6 pt-4">
    <nav class="flex flex-col gap-4">
      {navLinks.map(link => (
        <a
          href={link.href}
          class:list={[
            'font-sans text-base transition-colors',
            currentPath === link.href ? 'text-terracotta font-medium' : 'text-anthracite'
          ]}
        >
          {link.label}
        </a>
      ))}
      <a href="/contact" class="btn-primary text-center mt-2">
        Prendre rendez-vous
      </a>
    </nav>
  </div>
</header>

<script>
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  btn?.addEventListener('click', () => {
    const isOpen = menu?.classList.toggle('hidden') === false;
    btn.setAttribute('aria-expanded', String(!menu?.classList.contains('hidden')));
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: add sticky Header with mobile nav"
```

---

### Task 4: Footer Component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Write `src/components/Footer.astro`**

```astro
---
// src/components/Footer.astro
const year = new Date().getFullYear();
---

<footer class="bg-anthracite text-lin/80 font-sans">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-10">

      <!-- Identity -->
      <div>
        <p class="font-serif text-2xl text-lin mb-2">La Toison d'Or</p>
        <p class="text-sm leading-relaxed">
          Atelier de couture, retouches<br />et confection textile<br />
          Paris 14<sup>e</sup> arrondissement
        </p>
      </div>

      <!-- Navigation -->
      <div>
        <p class="text-xs uppercase tracking-widest text-terracotta mb-4">Navigation</p>
        <ul class="space-y-2 text-sm">
          {[
            ['/', 'Accueil'],
            ['/services', 'Services'],
            ['/realisations', 'Réalisations'],
            ['/a-propos', 'À propos'],
            ['/faq', 'FAQ'],
            ['/contact', 'Contact'],
          ].map(([href, label]) => (
            <li><a href={href} class="hover:text-lin transition-colors">{label}</a></li>
          ))}
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <p class="text-xs uppercase tracking-widest text-terracotta mb-4">Coordonnées</p>
        <address class="not-italic text-sm leading-7">
          XX rue d'Alésia<br />
          75014 Paris<br />
          <a href="tel:+33100000000" class="hover:text-lin transition-colors">01 XX XX XX XX</a><br />
          <a href="mailto:contact@toison-dor-paris.fr" class="hover:text-lin transition-colors">
            contact@toison-dor-paris.fr
          </a>
        </address>
        <p class="text-xs mt-4 leading-5">
          Lun–Ven 9h30–19h00<br />
          Sam 10h00–18h00
        </p>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-lin/20 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-lin/50">
      <p>&copy; {year} Atelier La Toison d'Or — Tous droits réservés</p>
      <p>
        Réalisé par{' '}
        <a
          href="https://comptoirweb.fr"
          target="_blank"
          rel="noopener noreferrer"
          class="text-terracotta hover:text-lin transition-colors"
        >
          ComptoirWeb
        </a>
      </p>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add Footer with comptoirweb.fr credit"
```

---

### Task 5: Page Accueil (index.astro)

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/components/TestimonialCard.astro`

- [ ] **Step 1: Write `src/components/TestimonialCard.astro`**

```astro
---
// src/components/TestimonialCard.astro
export interface Props {
  quote: string;
  author: string;
  detail?: string;
}
const { quote, author, detail } = Astro.props;
---

<figure class="bg-lin/40 border border-lin rounded-sm p-6 fade-up">
  <blockquote class="font-serif text-lg italic text-anthracite leading-relaxed mb-4">
    « {quote} »
  </blockquote>
  <figcaption class="font-sans text-sm text-terracotta font-medium">
    {author}
    {detail && <span class="text-anthracite/60 font-normal"> — {detail}</span>}
  </figcaption>
</figure>
```

- [ ] **Step 2: Write `src/pages/index.astro`**

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import TestimonialCard from '../components/TestimonialCard.astro';

const testimonials = [
  {
    quote: "Ma veste de tailleur retrouvée après dix ans, ajustée comme si elle avait toujours été faite pour moi. Un travail remarquable.",
    author: "Sophie M.",
    detail: "Montparnasse"
  },
  {
    quote: "Ourlet de pantalon rendu en 24h, propre et invisible. Je ne vais nulle part ailleurs.",
    author: "Jean-Pierre L.",
    detail: "Denfert"
  },
  {
    quote: "Robe de mariée transformée en robe de soirée. La fondatrice a compris exactement ce que je voulais dès le premier rendez-vous.",
    author: "Camille R.",
    detail: "Alésia"
  },
];
---

<Layout
  title="Retouche Couture Paris 14 — Atelier La Toison d'Or"
  description="Atelier de couture et retouches à Paris 14e. Retouches soignées, confection sur mesure, réparation textile. Quartiers Alésia, Denfert, Montparnasse."
  canonical="/"
>
  <Header slot="header" />

  <!-- Hero -->
  <section class="relative min-h-[90vh] flex items-center overflow-hidden bg-anthracite">
    <!-- Background image overlay -->
    <div class="absolute inset-0 bg-anthracite/60 z-10"></div>
    <div
      class="absolute inset-0 bg-cover bg-center z-0"
      style="background-image: url('/images/hero-atelier.jpg')"
      aria-hidden="true"
    ></div>

    <div class="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <p class="font-sans text-xs uppercase tracking-widest text-terracotta mb-4">
        Atelier couture · Paris 14<sup>e</sup>
      </p>
      <h1 class="font-serif text-4xl md:text-6xl lg:text-7xl text-creme leading-tight max-w-2xl mb-6">
        Chaque pièce mérite un geste juste.
      </h1>
      <p class="font-sans text-lin/80 text-lg max-w-lg mb-10 leading-relaxed">
        Retouches, confection sur mesure et réparation de vêtements qui comptent — avec le soin qu'ils méritent.
      </p>
      <a href="/contact" class="btn-primary text-base px-8 py-4">
        Prendre rendez-vous
      </a>
    </div>
  </section>

  <!-- Bandeau réassurance -->
  <section class="bg-lin py-10">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { value: '15+', label: 'années d\'expérience' },
          { value: '3 000+', label: 'pièces travaillées' },
          { value: '48h', label: 'délai express' },
          { value: '14e', label: 'arrondissement' },
        ].map(item => (
          <div class="fade-up">
            <p class="font-serif text-4xl text-terracotta mb-1">{item.value}</p>
            <p class="font-sans text-xs uppercase tracking-wide text-anthracite/70">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- Aperçu prestations -->
  <section class="py-20 bg-creme">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-12">
        <p class="section-subtitle">Ce que nous faisons</p>
        <h2 class="section-title max-w-xl">
          Un atelier pour les vêtements auxquels vous tenez.
        </h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            icon: '✂',
            title: 'Retouches & ajustements',
            desc: 'Cintrage, raccourcissement, reprise de coutures — pour que le vêtement soit vraiment à votre taille.',
          },
          {
            icon: '🧵',
            title: 'Confection sur mesure',
            desc: 'Création de pièces uniques à partir de vos tissus ou des nôtres, selon vos envies.',
          },
          {
            icon: '🪡',
            title: 'Réparation textile',
            desc: 'Raccommodage, remplacement de fermetures, stoppage — on répare ce que vous aimez.',
          },
          {
            icon: '🔄',
            title: 'Transformation',
            desc: 'Robe en jupe, veste en gilet, manteau relooké — donnez une seconde vie à vos pièces.',
          },
          {
            icon: '📏',
            title: 'Ourlets express',
            desc: 'Pantalons, robes, manteaux. Résultat propre en 24 à 48h selon les délais.',
          },
          {
            icon: '📅',
            title: 'Sur rendez-vous',
            desc: 'Prenez rendez-vous en ligne pour un essayage et un devis sans engagement.',
          },
        ].map(item => (
          <div class="bg-lin/30 border border-lin p-6 rounded-sm fade-up group hover:border-terracotta/40 transition-colors">
            <span class="text-2xl mb-4 block" aria-hidden="true">{item.icon}</span>
            <h3 class="font-serif text-xl text-anthracite mb-2">{item.title}</h3>
            <p class="font-sans text-sm text-anthracite/70 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
      <div class="mt-10 text-center">
        <a href="/services" class="btn-outline">Voir tous les tarifs</a>
      </div>
    </div>
  </section>

  <!-- Témoignages -->
  <section class="py-20 bg-lin/30">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-12">
        <p class="section-subtitle">Ce qu'ils en disent</p>
        <h2 class="section-title">Des clients du quartier satisfaits.</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map(t => (
          <TestimonialCard quote={t.quote} author={t.author} detail={t.detail} />
        ))}
      </div>
    </div>
  </section>

  <!-- CTA final -->
  <section class="bg-terracotta py-16">
    <div class="max-w-2xl mx-auto px-4 text-center">
      <h2 class="font-serif text-3xl md:text-4xl text-creme mb-4">
        Prêt·e à confier votre pièce ?
      </h2>
      <p class="font-sans text-lin/80 mb-8 leading-relaxed">
        Prenez rendez-vous en ligne — consultation et devis offerts.
      </p>
      <a href="/contact" class="inline-block bg-creme text-terracotta font-medium px-8 py-4 rounded-sm hover:bg-lin transition-colors">
        Réserver un créneau
      </a>
    </div>
  </section>

  <Footer slot="footer" />
</Layout>
```

- [ ] **Step 3: Verify in browser** — `npm run dev`, check `/` renders hero, bandeau, prestations, témoignages.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/components/TestimonialCard.astro
git commit -m "feat: add Accueil page"
```

---

### Task 6: Page Services

**Files:**
- Create: `src/pages/services.astro`
- Create: `src/components/ServiceCard.astro`

- [ ] **Step 1: Write `src/components/ServiceCard.astro`**

```astro
---
// src/components/ServiceCard.astro
export interface Props {
  title: string;
  description: string;
  priceRange: string;
  examples?: string[];
}
const { title, description, priceRange, examples } = Astro.props;
---

<article class="bg-creme border border-lin rounded-sm p-6 md:p-8 fade-up">
  <div class="flex items-start justify-between gap-4 mb-3">
    <h3 class="font-serif text-xl md:text-2xl text-anthracite">{title}</h3>
    <span class="font-sans text-sm font-medium text-terracotta whitespace-nowrap bg-lin/60 px-3 py-1 rounded-sm">
      {priceRange}
    </span>
  </div>
  <p class="font-sans text-sm text-anthracite/70 leading-relaxed mb-4">{description}</p>
  {examples && examples.length > 0 && (
    <ul class="space-y-1">
      {examples.map(ex => (
        <li class="font-sans text-sm text-anthracite/60 flex items-center gap-2">
          <span class="w-1 h-1 rounded-full bg-terracotta inline-block flex-shrink-0" aria-hidden="true"></span>
          {ex}
        </li>
      ))}
    </ul>
  )}
</article>
```

- [ ] **Step 2: Write `src/pages/services.astro`**

```astro
---
// src/pages/services.astro
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import ServiceCard from '../components/ServiceCard.astro';

const services = [
  {
    category: 'Retouches & ajustements',
    items: [
      {
        title: 'Ourlet simple',
        description: 'Raccourcissement propre d\'un pantalon, d\'une robe ou d\'un manteau. Couture invisible ou rabattue selon le tissu.',
        priceRange: 'à partir de 12 €',
        examples: ['Pantalon droit', 'Jean (bord roulotté ou original)', 'Robe ou jupe'],
      },
      {
        title: 'Cintrage & ajustement',
        description: 'Reprise en taille d\'une veste, d\'une robe ou d\'un pantalon pour un tombé impeccable. Essayage inclus.',
        priceRange: '20 – 60 €',
        examples: ['Cintrage veste ou blazer', 'Reprise taille pantalon', 'Ajustement robe de soirée'],
      },
      {
        title: 'Reprise de coutures',
        description: 'Coutures décousues, surpiqûre abîmée, assemblage défaillant — on remet tout en ordre.',
        priceRange: '8 – 25 €',
        examples: ['Couture d\'épaule', 'Surpiqûre jean', 'Assemblage doublure'],
      },
    ],
  },
  {
    category: 'Confection sur mesure',
    items: [
      {
        title: 'Pièce sur mesure',
        description: 'Création d\'un vêtement de A à Z — patron, coupe et assemblage — à partir de votre tissu ou du nôtre.',
        priceRange: 'sur devis',
        examples: ['Blouse, chemise', 'Jupe droite ou évasée', 'Pantalon sur mesure'],
      },
      {
        title: 'Doublure & finitions',
        description: 'Ajout ou remplacement d\'une doublure, pose de baleines, renforcement de col ou de revers.',
        priceRange: '25 – 80 €',
        examples: ['Doublure veste ou manteau', 'Baleines corsage', 'Col et revers'],
      },
    ],
  },
  {
    category: 'Réparation textile',
    items: [
      {
        title: 'Remplacement de fermeture',
        description: 'Fermeture Éclair défaillante ou brisée remplacée à l\'identique. Invisible, solide, propre.',
        priceRange: '15 – 40 €',
        examples: ['Zip pantalon ou jupe', 'Fermeture robe dos', 'Zip veste ou blouson'],
      },
      {
        title: 'Stoppage & raccommodage',
        description: 'Trou, accroc, maille filée — restauration discrète adaptée à chaque tissu.',
        priceRange: '20 – 80 €',
        examples: ['Stoppage laine fine', 'Raccommodage denim', 'Reprise maille'],
      },
      {
        title: 'Remplacement de boutons & passants',
        description: 'Boutons manquants, passants de ceinture abîmés, ganses et agrafes — petites réparations, grand effet.',
        priceRange: '5 – 20 €',
        examples: ['Boutons veste ou manteau', 'Passants pantalon', 'Agrafes et crochets'],
      },
    ],
  },
  {
    category: 'Transformation de vêtements',
    items: [
      {
        title: 'Transformation & relooking',
        description: 'Donner une seconde vie à une pièce que vous aimez : changer le style, la longueur, la coupe.',
        priceRange: 'sur devis',
        examples: ['Robe → jupe', 'Veste → gilet sans manches', 'Manteau raccourci en veste'],
      },
    ],
  },
];
---

<Layout
  title="Services & Tarifs — Retouche Couture Paris 14 · Atelier La Toison d'Or"
  description="Retouches, ajustements, confection sur mesure, réparation textile à Paris 14e. Ourlets, cintrage, fermetures, stoppage. Tarifs indicatifs et devis gratuit."
  canonical="/services"
>
  <Header slot="header" />

  <!-- Page header -->
  <section class="bg-lin py-16 md:py-20">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <p class="section-subtitle">Nos prestations</p>
      <h1 class="section-title max-w-2xl mb-4">
        Retouches, confection sur mesure et réparation textile à Paris 14<sup class="text-lg">e</sup>.
      </h1>
      <p class="font-sans text-anthracite/70 max-w-xl leading-relaxed">
        Les tarifs indiqués sont des fourchettes indicatives. Chaque pièce est unique — le devis définitif est établi lors de votre venue à l'atelier.
      </p>
    </div>
  </section>

  <!-- Services par catégorie -->
  <section class="py-16 bg-creme">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {services.map(cat => (
        <div>
          <h2 class="font-serif text-2xl md:text-3xl text-anthracite mb-8 pb-4 border-b border-lin">
            {cat.category}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cat.items.map(item => (
              <ServiceCard
                title={item.title}
                description={item.description}
                priceRange={item.priceRange}
                examples={item.examples}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>

  <!-- Note tarifaire + CTA -->
  <section class="bg-lin py-14">
    <div class="max-w-3xl mx-auto px-4 text-center">
      <p class="font-serif text-xl text-anthracite italic mb-6">
        « Un devis précis nécessite de voir la pièce. Venez avec votre vêtement — la consultation est offerte. »
      </p>
      <a href="/contact" class="btn-primary">Prendre rendez-vous</a>
    </div>
  </section>

  <Footer slot="footer" />
</Layout>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/services.astro src/components/ServiceCard.astro
git commit -m "feat: add Services page with tarifs"
```

---

### Task 7: Page Réalisations + BeforeAfterSlider

**Files:**
- Create: `src/components/BeforeAfterSlider.astro`
- Create: `src/pages/realisations.astro`

- [ ] **Step 1: Write `src/components/BeforeAfterSlider.astro`**

```astro
---
// src/components/BeforeAfterSlider.astro
export interface Props {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  caption: string;
  category: string;
}
const { before, after, beforeAlt, afterAlt, caption, category } = Astro.props;
const id = Math.random().toString(36).slice(2, 8);
---

<figure class="before-after-slider group relative overflow-hidden rounded-sm bg-lin fade-up" data-id={id}>
  <div class="relative w-full aspect-[4/3] select-none overflow-hidden cursor-col-resize" id={`container-${id}`}>
    <!-- After image (background) -->
    <img
      src={after}
      alt={afterAlt}
      class="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
      draggable="false"
    />
    <!-- Before image (clip) -->
    <div class="absolute inset-0 overflow-hidden" id={`clip-${id}`} style="width: 50%">
      <img
        src={before}
        alt={beforeAlt}
        class="absolute inset-0 w-full h-full object-cover"
        style="min-width: 100%"
        draggable="false"
      />
    </div>
    <!-- Divider -->
    <div
      class="absolute top-0 bottom-0 w-0.5 bg-creme shadow-lg"
      id={`divider-${id}`}
      style="left: 50%"
    >
      <div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-creme shadow-md flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M6 9H2m0 0 2-2M2 9l2 2M12 9h4m0 0-2-2m2 2-2 2" stroke="#C27044" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
    <!-- Labels -->
    <span class="absolute top-3 left-3 font-sans text-xs uppercase tracking-wider bg-anthracite/70 text-lin px-2 py-1 rounded-sm">Avant</span>
    <span class="absolute top-3 right-3 font-sans text-xs uppercase tracking-wider bg-terracotta/90 text-creme px-2 py-1 rounded-sm">Après</span>
  </div>
  <figcaption class="p-4">
    <span class="font-sans text-xs uppercase tracking-widest text-terracotta">{category}</span>
    <p class="font-sans text-sm text-anthracite mt-1">{caption}</p>
  </figcaption>
</figure>

<script>
  // Initialise all sliders on the page
  document.querySelectorAll<HTMLElement>('.before-after-slider').forEach(slider => {
    const id = slider.dataset.id!;
    const container = document.getElementById(`container-${id}`)!;
    const clip = document.getElementById(`clip-${id}`)!;
    const divider = document.getElementById(`divider-${id}`)!;

    let dragging = false;

    function setPosition(x: number) {
      const rect = container.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      clip.style.width = pct + '%';
      divider.style.left = pct + '%';
    }

    container.addEventListener('mousedown', e => { dragging = true; setPosition(e.clientX); });
    window.addEventListener('mousemove', e => { if (dragging) setPosition(e.clientX); });
    window.addEventListener('mouseup', () => { dragging = false; });

    container.addEventListener('touchstart', e => { dragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchmove', e => { if (dragging) setPosition(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend', () => { dragging = false; });
  });
</script>
```

- [ ] **Step 2: Write `src/pages/realisations.astro`**

```astro
---
// src/pages/realisations.astro
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import BeforeAfterSlider from '../components/BeforeAfterSlider.astro';

const realisations = [
  {
    category: 'Retouche',
    before: '/images/before-1.jpg',
    after: '/images/after-1.jpg',
    beforeAlt: 'Veste avant cintrage — trop large aux épaules',
    afterAlt: 'Veste après cintrage — ajustée et structurée',
    caption: 'Cintrage d\'un blazer vintage — reprise dos et côtés, épaules repositionnées.',
  },
  {
    category: 'Confection',
    before: '/images/before-2.jpg',
    after: '/images/after-2.jpg',
    beforeAlt: 'Tissu lin avant confection',
    afterAlt: 'Blouse lin confectionnée sur mesure',
    caption: 'Blouse lin sur mesure — patron tracé sur mesure, cols et poignets brodés à la main.',
  },
  {
    category: 'Transformation',
    before: '/images/before-3.jpg',
    after: '/images/after-3.jpg',
    beforeAlt: 'Robe longue avant transformation',
    afterAlt: 'Jupe midi après transformation',
    caption: 'Robe longue transformée en jupe midi — ceinture restructurée, surplus devenu doublure.',
  },
  {
    category: 'Réparation',
    before: '/images/before-4.jpg',
    after: '/images/after-4.jpg',
    beforeAlt: 'Manteau avec fermeture cassée',
    afterAlt: 'Manteau avec fermeture remplacée',
    caption: 'Remplacement d\'une fermeture Éclair sur manteau en laine bouillie — invisible.',
  },
  {
    category: 'Retouche',
    before: '/images/before-5.jpg',
    after: '/images/after-5.jpg',
    beforeAlt: 'Jean avant ourlet',
    afterAlt: 'Jean après ourlet original préservé',
    caption: 'Ourlet jean avec conservation de l\'ourlet d\'origine — technique selvedge.',
  },
  {
    category: 'Confection',
    before: '/images/before-6.jpg',
    after: '/images/after-6.jpg',
    beforeAlt: 'Patron robe de soirée',
    afterAlt: 'Robe de soirée confectionnée',
    caption: 'Robe de soirée en soie sauvage — confection intégrale sur 3 séances d\'essayage.',
  },
];

const categories = ['Tous', 'Retouche', 'Confection', 'Transformation', 'Réparation'];
---

<Layout
  title="Réalisations — Avant/Après · Atelier La Toison d'Or Paris 14"
  description="Galerie avant/après de l'atelier : retouches, confection sur mesure, transformations et réparations de vêtements à Paris 14e (Alésia, Denfert, Montparnasse)."
  canonical="/realisations"
>
  <Header slot="header" />

  <!-- Page header -->
  <section class="bg-lin py-16 md:py-20">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <p class="section-subtitle">Galerie</p>
      <h1 class="section-title max-w-xl mb-4">
        Ce que nos mains ont fait.
      </h1>
      <p class="font-sans text-anthracite/70 max-w-lg leading-relaxed">
        Glissez le curseur pour voir la transformation. Chaque pièce raconte une histoire — et un geste attentionné.
      </p>
    </div>
  </section>

  <!-- Filter tabs -->
  <section class="bg-creme border-b border-lin sticky top-16 md:top-20 z-40">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex gap-1 overflow-x-auto py-3 scrollbar-none" id="filter-tabs">
        {categories.map((cat, i) => (
          <button
            data-filter={cat}
            class:list={[
              'filter-btn flex-shrink-0 font-sans text-sm px-4 py-2 rounded-sm transition-colors',
              i === 0
                ? 'bg-terracotta text-creme'
                : 'text-anthracite/60 hover:text-anthracite'
            ]}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  </section>

  <!-- Gallery grid -->
  <section class="py-16 bg-creme">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="gallery-grid">
        {realisations.map(r => (
          <div data-category={r.category} class="gallery-item">
            <BeforeAfterSlider
              before={r.before}
              after={r.after}
              beforeAlt={r.beforeAlt}
              afterAlt={r.afterAlt}
              caption={r.caption}
              category={r.category}
            />
          </div>
        ))}
      </div>
    </div>
  </section>

  <Footer slot="footer" />
</Layout>

<script>
  // Filter logic
  const tabs = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
  const items = document.querySelectorAll<HTMLElement>('.gallery-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter!;
      tabs.forEach(t => t.classList.remove('bg-terracotta', 'text-creme'));
      tab.classList.add('bg-terracotta', 'text-creme');

      items.forEach(item => {
        const show = filter === 'Tous' || item.dataset.category === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });
</script>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/BeforeAfterSlider.astro src/pages/realisations.astro
git commit -m "feat: add Réalisations page with before/after slider"
```

---

### Task 8: Page À propos

**Files:**
- Create: `src/pages/a-propos.astro`

- [ ] **Step 1: Write `src/pages/a-propos.astro`**

```astro
---
// src/pages/a-propos.astro
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---

<Layout
  title="À propos — Couturière Paris 14e · Atelier La Toison d'Or"
  description="Histoire de l'atelier, parcours de la fondatrice et philosophie du travail bien fait. Atelier de couture artisanal à Paris 14e, quartier Alésia."
  canonical="/a-propos"
>
  <Header slot="header" />

  <!-- Page header -->
  <section class="bg-lin py-16 md:py-24">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <p class="section-subtitle">L'atelier</p>
        <h1 class="section-title mb-6">
          Un métier appris à la main,<br />pratiqué avec le cœur.
        </h1>
        <p class="font-sans text-anthracite/70 leading-relaxed">
          La Toison d'Or, c'est un atelier de quartier comme il en existait autrefois dans chaque rue parisienne. Un espace où l'on prend le temps de regarder un vêtement, de comprendre ce qui ne va pas, et de trouver le geste qui remet les choses en place.
        </p>
      </div>
      <div class="relative">
        <div class="aspect-[4/5] bg-lin rounded-sm overflow-hidden">
          <img
            src="/images/fondatrice.jpg"
            alt="La fondatrice de l'Atelier La Toison d'Or dans son atelier"
            class="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        <div class="absolute -bottom-4 -left-4 bg-terracotta text-creme font-serif text-lg p-5 rounded-sm hidden md:block">
          15 ans de métier
        </div>
      </div>
    </div>
  </section>

  <!-- Histoire -->
  <section class="py-16 bg-creme">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <p class="section-subtitle">Histoire</p>
      <h2 class="section-title mb-8">Comment tout a commencé.</h2>

      <div class="prose prose-slate max-w-none font-sans text-anthracite/80 leading-relaxed space-y-5">
        <p>
          Tout commence par une machine à coudre héritée, une grand-mère qui avait les mains habiles, et une enfance passée à regarder comment les tissus prennent forme. Après une formation aux métiers de la mode à Paris, puis plusieurs années en atelier de haute couture, Marie — fondatrice de La Toison d'Or — décide d'ouvrir son propre espace en 2009, rue d'Alésia.
        </p>
        <p>
          L'idée était simple : proposer aux habitants du 14<sup>e</sup> un service artisanal sérieux, à taille humaine, sans les délais et les tarifs des maisons de couture. Un endroit où l'on peut déposer un manteau qui tient à soi, et le récupérer mieux que neuf.
        </p>
        <p>
          Depuis, l'atelier a grandi — une seconde ouvrière nous a rejoints en 2019 — mais la philosophie reste la même : chaque pièce mérite qu'on la regarde, qu'on la touche, qu'on comprenne comment elle a été construite avant d'y porter les ciseaux.
        </p>
      </div>
    </div>
  </section>

  <!-- Philosophie -->
  <section class="py-16 bg-lin/40">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div class="grid grid-cols-2 gap-4">
          <div class="aspect-square bg-lin rounded-sm overflow-hidden">
            <img src="/images/atelier-1.jpg" alt="Vue de l'atelier, machines et tissus" class="w-full h-full object-cover" loading="lazy" />
          </div>
          <div class="aspect-square bg-lin rounded-sm overflow-hidden mt-8">
            <img src="/images/atelier-2.jpg" alt="Détail d'une retouche en cours" class="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
        <div class="fade-up">
          <p class="section-subtitle">Philosophie</p>
          <h2 class="section-title mb-6">Le travail bien fait.<br />Pas plus, pas moins.</h2>
          <div class="space-y-4 font-sans text-sm text-anthracite/70 leading-relaxed">
            <p>
              On n'accepte pas une pièce si on ne peut pas la traiter correctement. On ne promet pas des délais qu'on ne peut pas tenir. Et on ne facture pas un geste simple au prix d'un travail complexe.
            </p>
            <p>
              Ce que vous voyez chez nous, c'est le prix juste pour un travail honnête — réalisé avec des finitions propres, des fils assortis, des machines entretenues, et deux paires d'yeux qui vérifient avant de vous rendre la pièce.
            </p>
            <p>
              On répare aussi ce qui n'est pas notre faute. Parce que les vêtements que vous aimez le méritent.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Valeurs -->
  <section class="py-16 bg-creme">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <p class="section-subtitle text-center">Nos engagements</p>
      <h2 class="section-title text-center mb-12">Ce en quoi nous croyons.</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          { title: 'Transparence', text: 'Le devis est établi avant tout travail. Pas de surprise à la récupération.' },
          { title: 'Artisanat', text: 'Pas de sous-traitance. Chaque pièce est travaillée ici, dans cet atelier.' },
          { title: 'Durabilité', text: 'Réparer plutôt que jeter — c\'est un choix de bon sens, et c\'est notre métier.' },
        ].map(v => (
          <div class="text-center fade-up">
            <h3 class="font-serif text-2xl text-anthracite mb-3">{v.title}</h3>
            <p class="font-sans text-sm text-anthracite/70 leading-relaxed">{v.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <Footer slot="footer" />
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/a-propos.astro
git commit -m "feat: add À propos page"
```

---

### Task 9: Page FAQ

**Files:**
- Create: `src/components/FAQItem.astro`
- Create: `src/pages/faq.astro`

- [ ] **Step 1: Write `src/components/FAQItem.astro`**

```astro
---
// src/components/FAQItem.astro
export interface Props {
  question: string;
  answer: string;
  open?: boolean;
}
const { question, answer, open = false } = Astro.props;
---

<details class="border-b border-lin py-5 group" open={open}>
  <summary class="flex items-center justify-between cursor-pointer list-none gap-4">
    <span class="font-serif text-lg text-anthracite group-open:text-terracotta transition-colors">
      {question}
    </span>
    <span class="flex-shrink-0 w-6 h-6 rounded-full border border-lin flex items-center justify-center text-terracotta transition-transform group-open:rotate-45" aria-hidden="true">
      +
    </span>
  </summary>
  <p class="font-sans text-sm text-anthracite/70 leading-relaxed mt-4 pr-10">
    {answer}
  </p>
</details>
```

- [ ] **Step 2: Write `src/pages/faq.astro`**

```astro
---
// src/pages/faq.astro
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import FAQItem from '../components/FAQItem.astro';

const faq = [
  {
    question: 'Quels sont vos délais habituels ?',
    answer: 'Pour les retouches simples (ourlets, cintrage, fermetures), comptez 3 à 5 jours ouvrés. Pour les travaux plus complexes — stoppage, confection, transformation — nous établissons un délai précis lors de votre dépôt. Des créneaux express en 24–48h sont disponibles pour les ourlets et petites réparations, selon notre charge de travail.',
    open: true,
  },
  {
    question: 'Puis-je déposer un vêtement sans rendez-vous ?',
    answer: 'Oui, vous pouvez déposer une pièce directement à l\'atelier pendant nos heures d\'ouverture, sans rendez-vous préalable. Pour les essayages ou la confection sur mesure, un rendez-vous est nécessaire afin de vous consacrer le temps qu\'il faut.',
  },
  {
    question: 'Quels types de tissus acceptez-vous ?',
    answer: 'Nous travaillons la quasi-totalité des matières : coton, lin, laine, soie, velours, denim, cuir souple, synthétiques, doubles tissus. Certains matériaux très fragiles (dentelle ancienne, organza de soie) nécessitent un devis spécifique. En cas de doute, apportez-nous la pièce — on regarde ensemble.',
  },
  {
    question: 'Comment sont établis vos tarifs ?',
    answer: 'Les tarifs affichés sur la page Services sont des fourchettes indicatives. Le devis définitif est établi lors de votre dépôt, après examen de la pièce. Il dépend du tissu, de la complexité de l\'intervention et du délai demandé. Aucun travail ne commence sans votre accord explicite sur le devis.',
  },
  {
    question: 'Acceptez-vous les retouches urgentes ?',
    answer: 'Oui, selon notre planning. Pour une urgence (mariage, événement), contactez-nous par téléphone avant de vous déplacer — nous ferons notre possible pour vous dépanner. Un supplément urgence peut s\'appliquer pour les délais inférieurs à 24h.',
  },
  {
    question: 'Proposez-vous la confection de A à Z ?',
    answer: 'Oui. Vous pouvez venir avec votre propre tissu, ou choisir parmi nos disponibilités en atelier. Nous établissons le patron sur vos mesures, réalisons une toile d\'essai si nécessaire, et procédons à plusieurs essayages selon la complexité de la pièce. Comptez 2 à 4 séances pour une pièce complète.',
  },
  {
    question: 'Peut-on modifier un vêtement pour le rendre plus grand ?',
    answer: 'Cela dépend de la pièce et des marges de couture disponibles. Certains vêtements ont suffisamment de tissu en réserve pour être agrandis d\'une taille. Pour d\'autres, des empiècements ou insertions sont possibles. Apportez la pièce — on vous dit honnêtement ce qui est faisable.',
  },
  {
    question: 'Quelle est la différence entre stoppage et raccommodage ?',
    answer: 'Le raccommodage est une réparation visible ou discrète, adaptée aux tissus robustes (denim, laine épaisse). Le stoppage est une technique de restauration invisible, qui reconstitue le tissage fil par fil sur des matières fines (laine peignée, cachemire, flanelle). Le stoppage est plus long et donc plus onéreux, mais le résultat est indiscernable.',
  },
];

// FAQ Schema.org
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faq.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer,
    },
  })),
};
---

<Layout
  title="FAQ — Questions fréquentes · Atelier La Toison d'Or Paris 14"
  description="Délais, types de tissus, tarifs, dépôt sans rendez-vous, retouches urgentes... Réponses aux questions fréquentes de l'atelier de couture La Toison d'Or, Paris 14e."
  canonical="/faq"
  schema={faqSchema}
>
  <Header slot="header" />

  <!-- Page header -->
  <section class="bg-lin py-16 md:py-20">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <p class="section-subtitle">FAQ</p>
      <h1 class="section-title max-w-xl mb-4">
        Questions fréquentes.
      </h1>
      <p class="font-sans text-anthracite/70 max-w-lg leading-relaxed">
        Vous avez une question avant de passer à l'atelier ? Les réponses les plus courantes sont là. Sinon, appelez-nous — on est de bons vivants.
      </p>
    </div>
  </section>

  <!-- FAQ -->
  <section class="py-16 bg-creme">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {faq.map((item, i) => (
        <FAQItem question={item.question} answer={item.answer} open={i === 0} />
      ))}
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-lin py-12">
    <div class="max-w-2xl mx-auto px-4 text-center">
      <p class="font-serif text-xl text-anthracite mb-4">
        Une question qui n'est pas dans la liste ?
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="tel:+33100000000" class="btn-outline">Nous appeler</a>
        <a href="/contact" class="btn-primary">Écrire un message</a>
      </div>
    </div>
  </section>

  <Footer slot="footer" />
</Layout>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FAQItem.astro src/pages/faq.astro
git commit -m "feat: add FAQ page with Schema.org FAQPage"
```

---

### Task 10: Page Contact

**Files:**
- Create: `src/pages/contact.astro`

- [ ] **Step 1: Write `src/pages/contact.astro`**

Note: The form uses Formspree. Replace `YOUR_FORM_ID` with the actual ID from https://formspree.io after creating a free account.

```astro
---
// src/pages/contact.astro
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

const timeSlots = [
  'Lundi 9h30 – 13h00',
  'Lundi 14h00 – 19h00',
  'Mardi 9h30 – 13h00',
  'Mardi 14h00 – 19h00',
  'Mercredi 9h30 – 13h00',
  'Mercredi 14h00 – 19h00',
  'Jeudi 9h30 – 13h00',
  'Jeudi 14h00 – 19h00',
  'Vendredi 9h30 – 13h00',
  'Vendredi 14h00 – 19h00',
  'Samedi 10h00 – 13h00',
  'Samedi 13h00 – 18h00',
];

const serviceOptions = [
  'Retouche / ajustement',
  'Ourlet express',
  'Confection sur mesure',
  'Réparation textile',
  'Transformation de vêtement',
  'Autre',
];
---

<Layout
  title="Contact & Rendez-vous — Atelier La Toison d'Or Paris 14"
  description="Prenez rendez-vous à l'atelier couture La Toison d'Or, Paris 14e. Adresse, horaires, formulaire de contact et carte. Quartiers Alésia, Denfert, Montparnasse."
  canonical="/contact"
>
  <Header slot="header" />

  <!-- Page header -->
  <section class="bg-lin py-16 md:py-20">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <p class="section-subtitle">Nous trouver</p>
      <h1 class="section-title max-w-xl mb-4">
        Prenez rendez-vous à l'atelier.
      </h1>
      <p class="font-sans text-anthracite/70 max-w-lg leading-relaxed">
        Venez avec votre pièce — la consultation et le devis sont offerts. On regarde ensemble, on vous dit ce qu'on peut faire, et on s'accorde sur le reste.
      </p>
    </div>
  </section>

  <!-- Contact grid -->
  <section class="py-16 bg-creme">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">

      <!-- Form -->
      <div>
        <h2 class="font-serif text-2xl text-anthracite mb-6">Demande de rendez-vous</h2>

        <form
          action="https://formspree.io/f/YOUR_FORM_ID"
          method="POST"
          class="space-y-5"
          id="contact-form"
        >
          <!-- Name -->
          <div>
            <label for="name" class="block font-sans text-sm font-medium text-anthracite mb-1">
              Nom complet <span class="text-terracotta">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              autocomplete="name"
              class="w-full border border-lin bg-creme px-4 py-3 font-sans text-sm rounded-sm focus:outline-none focus:border-terracotta transition-colors"
              placeholder="Marie Dupont"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block font-sans text-sm font-medium text-anthracite mb-1">
              Email <span class="text-terracotta">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autocomplete="email"
              class="w-full border border-lin bg-creme px-4 py-3 font-sans text-sm rounded-sm focus:outline-none focus:border-terracotta transition-colors"
              placeholder="marie@exemple.fr"
            />
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="block font-sans text-sm font-medium text-anthracite mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              autocomplete="tel"
              class="w-full border border-lin bg-creme px-4 py-3 font-sans text-sm rounded-sm focus:outline-none focus:border-terracotta transition-colors"
              placeholder="06 XX XX XX XX"
            />
          </div>

          <!-- Service -->
          <div>
            <label for="service" class="block font-sans text-sm font-medium text-anthracite mb-1">
              Type de prestation <span class="text-terracotta">*</span>
            </label>
            <select
              id="service"
              name="service"
              required
              class="w-full border border-lin bg-creme px-4 py-3 font-sans text-sm rounded-sm focus:outline-none focus:border-terracotta transition-colors appearance-none"
            >
              <option value="" disabled selected>Choisir une prestation…</option>
              {serviceOptions.map(opt => (
                <option value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <!-- Time slot -->
          <div>
            <label for="slot" class="block font-sans text-sm font-medium text-anthracite mb-1">
              Créneau souhaité <span class="text-terracotta">*</span>
            </label>
            <select
              id="slot"
              name="slot"
              required
              class="w-full border border-lin bg-creme px-4 py-3 font-sans text-sm rounded-sm focus:outline-none focus:border-terracotta transition-colors appearance-none"
            >
              <option value="" disabled selected>Choisir un créneau…</option>
              {timeSlots.map(slot => (
                <option value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <!-- Message -->
          <div>
            <label for="message" class="block font-sans text-sm font-medium text-anthracite mb-1">
              Description de votre pièce
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              class="w-full border border-lin bg-creme px-4 py-3 font-sans text-sm rounded-sm focus:outline-none focus:border-terracotta transition-colors resize-none"
              placeholder="Décrivez brièvement votre vêtement et la retouche souhaitée…"
            ></textarea>
          </div>

          <button
            type="submit"
            class="btn-primary w-full text-center py-4"
          >
            Envoyer la demande
          </button>

          <p class="font-sans text-xs text-anthracite/50 text-center">
            Nous vous répondons sous 24h ouvrées.
          </p>
        </form>
      </div>

      <!-- Info sidebar -->
      <div class="space-y-8">

        <!-- Address & hours -->
        <div class="bg-lin/40 border border-lin rounded-sm p-6">
          <h2 class="font-serif text-xl text-anthracite mb-4">L'atelier</h2>
          <address class="not-italic font-sans text-sm text-anthracite/80 space-y-3">
            <p class="flex gap-3">
              <span aria-hidden="true">📍</span>
              <span>XX rue d'Alésia<br />75014 Paris</span>
            </p>
            <p class="flex gap-3">
              <span aria-hidden="true">📞</span>
              <a href="tel:+33100000000" class="hover:text-terracotta transition-colors">01 XX XX XX XX</a>
            </p>
            <p class="flex gap-3">
              <span aria-hidden="true">✉️</span>
              <a href="mailto:contact@toison-dor-paris.fr" class="hover:text-terracotta transition-colors">
                contact@toison-dor-paris.fr
              </a>
            </p>
          </address>
        </div>

        <!-- Hours -->
        <div class="bg-lin/40 border border-lin rounded-sm p-6">
          <h3 class="font-serif text-xl text-anthracite mb-4">Horaires</h3>
          <dl class="font-sans text-sm space-y-2">
            {[
              ['Lundi – Vendredi', '9h30 – 19h00'],
              ['Samedi', '10h00 – 18h00'],
              ['Dimanche', 'Fermé'],
            ].map(([day, hours]) => (
              <div class="flex justify-between gap-4">
                <dt class="text-anthracite/60">{day}</dt>
                <dd class="text-anthracite font-medium">{hours}</dd>
              </div>
            ))}
          </dl>
        </div>

        <!-- Google link -->
        <div class="bg-terracotta/10 border border-terracotta/30 rounded-sm p-5">
          <p class="font-sans text-sm text-anthracite/80 mb-3">
            Retrouvez-nous sur Google Maps et laissez-nous un avis.
          </p>
          <a
            href="https://maps.google.com/?cid=VOTRE_CID"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-outline text-sm py-2"
          >
            Voir la fiche Google
          </a>
        </div>

      </div>
    </div>
  </section>

  <!-- Map -->
  <section class="h-80 md:h-96 bg-lin">
    <iframe
      title="Localisation Atelier La Toison d'Or — Paris 14e"
      src="https://www.openstreetmap.org/export/embed.html?bbox=2.3100%2C48.8200%2C2.3400%2C48.8360&layer=mapnik&marker=48.8282%2C2.3264"
      width="100%"
      height="100%"
      style="border:0;"
      loading="lazy"
      allowfullscreen
    ></iframe>
  </section>

  <Footer slot="footer" />
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/contact.astro
git commit -m "feat: add Contact page with form, map, hours"
```

---

### Task 11: Placeholder Images & Final Build

**Files:**
- Modify: `public/images/` (add placeholder SVG images)
- Create: `.gitignore`

- [ ] **Step 1: Add `.gitignore`**

```
node_modules/
dist/
.astro/
.env
.DS_Store
```

- [ ] **Step 2: Create placeholder images** (replace with real photos before launch)

For each image listed in the file map, create a placeholder SVG to avoid broken `<img>` tags during development. Run:

```bash
for name in hero-atelier fondatrice atelier-1 atelier-2 before-1 after-1 before-2 after-2 before-3 after-3 before-4 after-4 before-5 after-5 before-6 after-6; do
  cat > "public/images/${name}.jpg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#E8DFD0"/>
  <text x="400" y="310" text-anchor="middle" font-family="serif" font-size="24" fill="#C27044">Image placeholder</text>
</svg>
EOF
done
```

Note: These are SVG files saved as `.jpg` — browsers will display them. Replace with real JPEG photos before launch.

- [ ] **Step 3: Build and check for errors**

```bash
npm run build
```

Expected: `dist/` directory created, no build errors. Check each page at:
- `npm run preview` → localhost:4321

Verify pages: `/`, `/services`, `/realisations`, `/a-propos`, `/faq`, `/contact`

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore: add placeholders, gitignore, verify build"
```

---

### Task 12: Deploy to Vercel

- [ ] **Step 1: Push to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/atelier-toison-dor.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Deploy via Vercel CLI or Dashboard**

Option A — CLI:
```bash
npx vercel --prod
```

Option B — Dashboard: Connect the GitHub repo at vercel.com, select the Astro framework preset, deploy.

- [ ] **Step 3: Post-deployment checklist**

- [ ] Replace all placeholder images with real photos
- [ ] Replace `YOUR_FORM_ID` in `contact.astro` with real Formspree ID
- [ ] Replace `VOTRE_CID` in contact + Layout with real Google Maps CID
- [ ] Replace phone number and address with real ones
- [ ] Update `astro.config.mjs` `site:` with real domain
- [ ] Submit sitemap to Google Search Console: `https://your-domain.fr/sitemap-index.xml`
  (Add `@astrojs/sitemap` integration: `npm install @astrojs/sitemap` + add to astro.config.mjs)
- [ ] Test Schema.org at https://search.google.com/test/rich-results

---

## Sitemap Integration (Optional but recommended)

Add to Task 11 or as a separate task:

```bash
npm install @astrojs/sitemap
```

Update `astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [tailwind(), sitemap()],
  output: 'static',
  site: 'https://atelier-toison-dor.fr',
});
```

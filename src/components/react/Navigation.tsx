import { useState } from 'react';
import { defaultLang, languages, useTranslations } from '../../i18n/ui';

interface NavigationProps {
  currentPath?: string;
  lang?: keyof typeof languages;
}

export default function Navigation({ currentPath = '/', lang }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Get the language prefix from the current path
  const langMatch = currentPath.match(/^\/(cs|de|es|it|fr)(?:\/|$)/);
  const resolvedLang = lang || (langMatch ? (langMatch[1] as keyof typeof languages) : defaultLang);
  const langPrefix = resolvedLang === defaultLang ? '' : `/${resolvedLang}`;
  const t = useTranslations(resolvedLang);

  const navItems = [
    { label: t('nav.services'), href: `${langPrefix}/#services` },
    { label: t('nav.projects'), href: `${langPrefix}/projects` },
    { label: t('nav.timeline'), href: `${langPrefix}/#timeline` },
    { label: t('nav.vocabulary'), href: `${langPrefix}/vocabulary` }
  ];

  const cvPdfPath = resolvedLang === 'cs' ? '/CV_dolnicek_2026_cz.pdf' : '/CV_dolnicek_2026_en.pdf';

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-6 sm:flex">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-sm font-semibold text-slate-300 transition hover:text-accent"
          >
            {item.label}
          </a>
        ))}
        <a
          href={cvPdfPath}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink transition hover:bg-accentMuted"
        >
          {t('nav.downloadCv')}
        </a>
      </nav>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col gap-1.5 sm:hidden"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span
          className={`h-0.5 w-6 bg-slate-300 transition-all ${
            isOpen ? 'translate-y-2 rotate-45' : ''
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-slate-300 transition-all ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-slate-300 transition-all ${
            isOpen ? '-translate-y-2 -rotate-45' : ''
          }`}
        />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-ink/95 sm:hidden">
          <div className="flex min-h-screen flex-col items-center justify-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-2xl font-semibold text-slate-200 transition hover:text-accent"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href={cvPdfPath}
              className="rounded-full bg-accent px-6 py-3 text-xl font-semibold text-ink transition hover:bg-accentMuted"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.downloadCv')}
            </a>
          </div>
        </div>
      )}
    </>
  );
}

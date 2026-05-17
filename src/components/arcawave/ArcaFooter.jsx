import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext'

const ArcaFooter = () => {
  const { t } = useLanguage()
  const f = t.arca.footer

  return (
    <footer className="py-14 px-6 border-t border-foreground/10">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 mb-12">
          <div>
            <img
              src="/assets/logos/Arcawave_Logo_Color.svg"
              alt="Arcawave"
              className="h-7 w-auto mb-5"
            />
            <p className="text-sm text-body-text leading-relaxed max-w-[280px]">
              {f.tagline}
            </p>
          </div>
          {f.sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-bold tracking-wider uppercase text-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-body-text hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-foreground/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-caption">{f.copyright}</p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/company/arcawave/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-caption hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/fluxrs_ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-caption hover:text-foreground transition-colors"
            >
              Instagram
            </a>
            <a
              href="mailto:hello@arcawave.xyz"
              className="text-xs text-caption hover:text-foreground transition-colors"
            >
              hello@arcawave.xyz
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default ArcaFooter

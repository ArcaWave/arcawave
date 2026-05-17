import React from 'react'
import { useLanguage } from '../i18n/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className="py-12 px-4 bg-foreground">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-[12px] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-palette w-6 h-6 text-white">
                  <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
                  <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
                  <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
                  <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
                </svg>
              </div>
              <div className="font-bold text-lg text-white" style={{fontFamily: 'var(--font-display)'}}>Jellying</div>
            </div>
            <p className="text-white/60 text-sm">{t.footer.desc}<br />{t.footer.descSub}</p>
          </div>
          <div>
            <h4 className="text-white mb-4 text-sm font-semibold">{t.footer.product}</h4>
            <ul className="space-y-2 text-sm">
              {t.footer.productLinks.map((link, index) => (
                <li key={index}><a href="#" className="text-white/60 hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white mb-4 text-sm font-semibold">{t.footer.company}</h4>
            <ul className="space-y-2 text-sm">
              {t.footer.companyLinks.map((link, index) => (
                <li key={index}><a href="#" className="text-white/60 hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white mb-4 text-sm font-semibold">{t.footer.legal}</h4>
            <ul className="space-y-2 text-sm">
              {t.footer.legalLinks.map((link, index) => (
                <li key={index}><a href="#" className="text-white/60 hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-white/60 text-sm">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

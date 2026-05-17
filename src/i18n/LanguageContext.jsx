import React, { createContext, useContext, useState } from 'react'
import translations from './translations'

const LanguageContext = createContext()

const getInitialLang = () => {
  const params = new URLSearchParams(window.location.search)
  const urlLang = params.get('lang')
  if (urlLang && translations[urlLang]) return urlLang
  return 'ko'
}

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(getInitialLang)

  const t = translations[lang]

  const toggleLang = () => {
    setLang(prev => (prev === 'ko' ? 'en' : 'ko'))
  }

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}

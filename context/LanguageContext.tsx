"use client"

import { createContext, useContext, useState } from "react"

const LanguageContext = createContext<any>(null)

export function LanguageProvider({ children }: any) {
  const [language, setLanguage] = useState("English")

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
import { createI18n } from 'vue-i18n'
import en from './en'
import zh from './zh'

// 获取浏览器语言或从localStorage获取保存的语言
function getDefaultLocale() {
  // 首先检查URL路径
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    if (path.startsWith('/cn')) {
      return 'zh'
    }
    
    // 然后检查localStorage
    const savedLocale = localStorage.getItem('locale')
    if (savedLocale && ['en', 'zh'].includes(savedLocale)) {
      return savedLocale
    }
    
    // 最后检查浏览器语言
    const browserLocale = navigator.language.toLowerCase()
    if (browserLocale.startsWith('zh')) {
      return 'zh'
    }
  }
  
  return 'en'
}

const messages = {
  en,
  zh
}

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages,
  globalInjection: true
})

export default i18n

// 切换语言的辅助函数
export function setLocale(locale: string) {
  i18n.global.locale.value = locale as any
  if (typeof window !== 'undefined') {
    localStorage.setItem('locale', locale)
    document.documentElement.lang = locale
  }
}

// 获取当前语言
export function getCurrentLocale() {
  return i18n.global.locale.value
}

// 检查是否为中文
export function isChineseLocale() {
  return getCurrentLocale() === 'zh'
}


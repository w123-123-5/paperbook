import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'paperbook:theme'
const stored = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
})()

const theme = ref(stored === 'night' ? 'night' : 'day')

watchEffect(() => {
  const value = theme.value
  document.documentElement.dataset.theme = value
  document.documentElement.style.colorScheme = value === 'night' ? 'dark' : 'light'
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // 忽略存储失败，主题仍在本次会话中生效。
  }
})

function toggle() {
  theme.value = theme.value === 'day' ? 'night' : 'day'
}

export function useTheme() {
  return {
    theme,
    isNight: () => theme.value === 'night',
    toggle,
  }
}

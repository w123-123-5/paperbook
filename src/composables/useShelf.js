import { computed, reactive, watch } from 'vue'
import { booksById } from '../data/books'

const STORAGE_KEY = 'paperbook:shelf:v1'

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ids: [], progress: {} }
    const parsed = JSON.parse(raw)
    return {
      ids: Array.isArray(parsed.ids) ? parsed.ids.filter((id) => booksById[id]) : [],
      progress: parsed.progress && typeof parsed.progress === 'object' ? parsed.progress : {},
    }
  } catch {
    return { ids: [], progress: {} }
  }
}

const saved = readStorage()

const state = reactive({
  ids: saved.ids,
  progress: saved.progress,
  drawerOpen: false,
})

const books = computed(() => state.ids.map((id) => booksById[id]).filter(Boolean))
const count = computed(() => books.value.length)
const readingCount = computed(
  () => books.value.filter((book) => (state.progress[book.id] ?? 0) > 0 && state.progress[book.id] < 100).length,
)
const finishedCount = computed(
  () => books.value.filter((book) => (state.progress[book.id] ?? 0) >= 100).length,
)
const averageProgress = computed(() => {
  if (!books.value.length) return 0
  const total = books.value.reduce((sum, book) => sum + (state.progress[book.id] ?? 0), 0)
  return Math.round(total / books.value.length)
})

watch(
  () => ({ ids: [...state.ids], progress: { ...state.progress } }),
  (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {
      // 私密模式下 localStorage 可能不可用，书架仍可在本次会话中使用。
    }
  },
  { deep: true },
)

function has(id) {
  return state.ids.includes(id)
}

function add(id) {
  if (!booksById[id] || has(id)) return false
  state.ids.push(id)
  return true
}

function remove(id) {
  const index = state.ids.indexOf(id)
  if (index === -1) return false
  state.ids.splice(index, 1)
  delete state.progress[id]
  return true
}

function toggle(id) {
  return has(id) ? (remove(id), false) : (add(id), true)
}

function clear() {
  state.ids.splice(0, state.ids.length)
  Object.keys(state.progress).forEach((key) => delete state.progress[key])
}

function setProgress(id, value) {
  if (!booksById[id]) return
  state.progress[id] = Math.max(0, Math.min(100, Number(value) || 0))
}

function progressFor(id) {
  return state.progress[id] ?? 0
}

function openDrawer() {
  state.drawerOpen = true
}

function closeDrawer() {
  state.drawerOpen = false
}

function toggleDrawer() {
  state.drawerOpen = !state.drawerOpen
}

export function useShelf() {
  return {
    state,
    books,
    count,
    readingCount,
    finishedCount,
    averageProgress,
    has,
    add,
    remove,
    toggle,
    clear,
    setProgress,
    progressFor,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  }
}

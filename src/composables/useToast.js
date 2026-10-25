import { reactive } from 'vue'

let seed = 0
const toasts = reactive([])
const timers = new Map()

function dismiss(id) {
  const index = toasts.findIndex((toast) => toast.id === id)
  if (index !== -1) toasts.splice(index, 1)
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }
}

function push(message, options = {}) {
  const id = ++seed
  const toast = {
    id,
    message,
    kind: options.kind ?? 'success',
    title: options.title ?? '',
  }
  toasts.push(toast)
  const duration = options.duration ?? 3200
  if (duration > 0) {
    timers.set(
      id,
      setTimeout(() => dismiss(id), duration),
    )
  }
  return id
}

function clearAll() {
  timers.forEach((timer) => clearTimeout(timer))
  timers.clear()
  toasts.splice(0, toasts.length)
}

export function useToast() {
  return { toasts, push, dismiss, clearAll }
}

const listeners = new WeakMap()

let observer = null

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  )
  return observer
}

export const reveal = {
  mounted(el, binding) {
    const delay = Number(binding.value?.delay ?? binding.value ?? 0)
    const distance = Number(binding.value?.distance ?? 22)
    el.classList.add('reveal')
    el.style.setProperty('--reveal-delay', `${delay}ms`)
    el.style.setProperty('--reveal-distance', `${distance}px`)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible')
      return
    }

    const io = getObserver()
    listeners.set(el, io)
    io.observe(el)
  },
  unmounted(el) {
    const io = listeners.get(el)
    if (io) io.unobserve(el)
    listeners.delete(el)
  },
}

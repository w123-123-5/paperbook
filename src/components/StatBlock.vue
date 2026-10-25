<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  value: { type: Number, required: true },
  suffix: { type: String, default: '' },
  label: { type: String, required: true },
})

const root = ref(null)
const current = ref(0)
let frame = null
let observer = null

const display = computed(() => current.value.toLocaleString('zh-CN'))

function run() {
  const duration = 1300
  const start = performance.now()
  const tick = (now) => {
    const progress = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - progress, 3)
    current.value = Math.round(props.value * eased)
    if (progress < 1) frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    current.value = props.value
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      run()
      observer.disconnect()
    },
    { threshold: 0.45 },
  )
  if (root.value) observer.observe(root.value)
})

onUnmounted(() => {
  if (frame) cancelAnimationFrame(frame)
  observer?.disconnect()
})
</script>

<template>
  <div ref="root" class="stat">
    <div class="stat__value" :aria-label="`${value}${suffix} ${label}`">
      <span aria-hidden="true">{{ display }}</span>
      <small aria-hidden="true">{{ suffix }}</small>
    </div>
    <span class="stat__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.stat {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.stat__value {
  display: flex;
  align-items: baseline;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 2.8vw, 2.55rem);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.04em;
}

.stat__value small {
  margin-left: 3px;
  color: var(--clay);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0;
}

.stat__label {
  color: var(--ink-faint);
  font-size: 10px;
  letter-spacing: 0.05em;
}
</style>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  quotes: { type: Array, required: true },
  interval: { type: Number, default: 6500 },
})

const active = ref(0)
let timer = null

function next() {
  active.value = (active.value + 1) % props.quotes.length
}

function previous() {
  active.value = (active.value - 1 + props.quotes.length) % props.quotes.length
}

function start() {
  stop()
  timer = setInterval(next, props.interval)
}

function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(start)
onUnmounted(stop)
</script>

<template>
  <section
    class="quote"
    aria-roledescription="carousel"
    aria-label="纸间店主语录"
    @mouseenter="stop"
    @mouseleave="start"
    @focusin="stop"
    @focusout="start"
  >
    <div class="quote__mark" aria-hidden="true">“</div>
    <div class="quote__body" aria-live="polite">
      <Transition name="quote" mode="out-in">
        <figure :key="active" class="quote__figure">
          <blockquote>{{ quotes[active].text }}</blockquote>
          <figcaption>— {{ quotes[active].source }}</figcaption>
        </figure>
      </Transition>
    </div>
    <div class="quote__controls">
      <button type="button" class="quote__arrow" aria-label="上一句" @click="previous">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
          <path d="M19 12H5M11 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <div class="quote__dots">
        <button
          v-for="(item, index) in quotes"
          :key="item.source"
          type="button"
          class="quote__dot"
          :class="{ 'is-active': index === active }"
          :aria-label="`第 ${index + 1} 句`"
          :aria-current="index === active"
          @click="active = index"
        />
      </div>
      <button type="button" class="quote__arrow" aria-label="下一句" @click="next">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
          <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </section>
</template>

<style scoped>
.quote {
  position: relative;
  display: grid;
  grid-template-columns: 100px 1fr auto;
  align-items: center;
  gap: 30px;
  padding: 54px 60px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.quote__mark {
  align-self: start;
  color: var(--gold);
  font-family: var(--font-display);
  font-size: 110px;
  line-height: 0.72;
  opacity: 0.8;
  user-select: none;
}

.quote__body {
  min-height: 126px;
  display: flex;
  align-items: center;
}

.quote__figure {
  margin: 0;
}

.quote blockquote {
  max-width: 810px;
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 2.5vw, 1.95rem);
  font-weight: 500;
  line-height: 1.65;
  letter-spacing: -0.02em;
}

.quote figcaption {
  margin-top: 15px;
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.1em;
}

.quote__controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.quote__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--line);
  border-radius: 50%;
  color: var(--ink-soft);
  transition:
    background 0.2s var(--ease-soft),
    color 0.2s var(--ease-soft);
}

.quote__arrow:hover {
  background: var(--ink);
  color: var(--paper);
}

.quote__arrow svg {
  width: 15px;
}

.quote__dots {
  display: flex;
  gap: 6px;
}

.quote__dot {
  width: 5px;
  height: 5px;
  padding: 0;
  border-radius: 999px;
  background: var(--line-strong);
  transition:
    width 0.3s var(--ease-out),
    background 0.3s var(--ease-soft);
}

.quote__dot.is-active {
  width: 18px;
  background: var(--clay);
}

.quote-enter-active,
.quote-leave-active {
  transition:
    opacity 0.3s var(--ease-soft),
    transform 0.3s var(--ease-out);
}

.quote-enter-from {
  opacity: 0;
  transform: translateY(9px);
}

.quote-leave-to {
  opacity: 0;
  transform: translateY(-9px);
}

@media (max-width: 860px) {
  .quote {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 40px 0;
  }

  .quote__mark {
    font-size: 76px;
  }

  .quote__body {
    min-height: 150px;
  }

  .quote__controls {
    justify-content: flex-end;
  }
}
</style>

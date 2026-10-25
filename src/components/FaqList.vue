<script setup>
import { ref } from 'vue'

defineProps({
  items: { type: Array, required: true },
})

const openIndex = ref(0)

function toggle(index) {
  openIndex.value = openIndex.value === index ? -1 : index
}
</script>

<template>
  <div class="faq">
    <article v-for="(item, index) in items" :key="item.question" class="faq__item" :class="{ 'is-open': openIndex === index }">
      <h3>
        <button
          type="button"
          class="faq__question"
          :aria-expanded="openIndex === index"
          :aria-controls="`faq-answer-${index}`"
          @click="toggle(index)"
        >
          <span class="faq__index">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="faq__text">{{ item.question }}</span>
          <span class="faq__icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </h3>
      <Transition name="faq">
        <div v-show="openIndex === index" :id="`faq-answer-${index}`" class="faq__answer">
          <p>{{ item.answer }}</p>
        </div>
      </Transition>
    </article>
  </div>
</template>

<style scoped>
.faq {
  border-top: 1px solid var(--line-strong);
}

.faq__item {
  border-bottom: 1px solid var(--line);
}

.faq__question {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 20px;
  padding: 22px 0;
  text-align: left;
}

.faq__index {
  flex: none;
  width: 27px;
  color: var(--clay);
  font-family: var(--font-mono);
  font-size: 8px;
}

.faq__text {
  flex: 1;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 500;
}

.faq__icon {
  position: relative;
  flex: none;
  width: 22px;
  height: 22px;
  border: 1px solid var(--line);
  border-radius: 50%;
  transition:
    background 0.25s var(--ease-soft),
    border-color 0.25s var(--ease-soft);
}

.faq__icon span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 1px;
  background: var(--ink-soft);
  transform: translate(-50%, -50%);
  transition:
    transform 0.3s var(--ease-out),
    background 0.25s var(--ease-soft);
}

.faq__icon span:last-child {
  transform: translate(-50%, -50%) rotate(90deg);
}

.faq__item.is-open .faq__icon {
  border-color: var(--forest);
  background: var(--forest);
}

.faq__item.is-open .faq__icon span {
  background: var(--cream);
}

.faq__item.is-open .faq__icon span:last-child {
  transform: translate(-50%, -50%) rotate(0deg);
}

.faq__answer {
  overflow: hidden;
}

.faq__answer p {
  max-width: 680px;
  margin: 0;
  padding: 0 0 24px 47px;
  color: var(--ink-soft);
  font-size: 12.5px;
  line-height: 1.9;
}

.faq-enter-active,
.faq-leave-active {
  transition:
    opacity 0.25s var(--ease-soft),
    transform 0.25s var(--ease-out);
}

.faq-enter-from,
.faq-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

@media (max-width: 560px) {
  .faq__question {
    gap: 11px;
    padding: 18px 0;
  }

  .faq__text {
    font-size: 17px;
  }

  .faq__answer p {
    padding-left: 0;
    font-size: 12px;
  }
}
</style>

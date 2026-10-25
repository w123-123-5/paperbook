<script setup>
import { computed, watch } from 'vue'

const model = defineModel({ type: Number, default: 0 })

const props = defineProps({
  title: { type: String, default: '阅读进度' },
  compact: { type: Boolean, default: false },
})

const emit = defineEmits(['finished'])

const clamped = computed(() => Math.max(0, Math.min(100, Number(model.value) || 0)))
const status = computed(() => {
  if (clamped.value >= 100) return '读完了'
  if (clamped.value >= 70) return '就快读完了'
  if (clamped.value >= 30) return '渐入佳境'
  if (clamped.value > 0) return '刚刚翻开'
  return '还没开始'
})

watch(
  () => clamped.value,
  (value, oldValue) => {
    if (value >= 100 && oldValue < 100) emit('finished')
  },
)

function nudge(step) {
  model.value = Math.max(0, Math.min(100, clamped.value + step))
}
</script>

<template>
  <div class="progress" :class="{ 'progress--compact': compact }">
    <div class="progress__head">
      <div>
        <span class="progress__label">{{ title }}</span>
        <span class="progress__status">{{ status }}</span>
      </div>
      <span class="progress__value">{{ clamped }}<small>%</small></span>
    </div>
    <div class="progress__track">
      <span class="progress__fill" :style="{ width: `${clamped}%` }" />
      <span class="progress__sun" :style="{ left: `${clamped}%` }" aria-hidden="true" />
    </div>
    <input
      v-model.number="model"
      class="progress__range"
      type="range"
      min="0"
      max="100"
      step="1"
      :aria-label="`${title}，当前 ${clamped}%`"
    />
    <div v-if="!compact" class="progress__actions">
      <button type="button" class="progress__step" @click="nudge(-10)">−10</button>
      <button type="button" class="progress__step" @click="nudge(10)">+10</button>
      <button type="button" class="progress__step progress__step--finish" @click="model = 100">
        标记读完
      </button>
    </div>
  </div>
</template>

<style scoped>
.progress {
  display: grid;
  gap: 10px;
}

.progress__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.progress__label {
  display: block;
  color: var(--ink);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.progress__status {
  display: block;
  margin-top: 2px;
  color: var(--ink-faint);
  font-size: 10.5px;
}

.progress__value {
  color: var(--clay);
  font-family: var(--font-display);
  font-size: 25px;
  line-height: 1;
}

.progress__value small {
  font-family: var(--font-mono);
  font-size: 10px;
}

.progress__track {
  position: relative;
  height: 5px;
  border-radius: 999px;
  background: var(--paper-deep);
}

.progress__fill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: inherit;
  background: var(--clay);
  transition: width 0.25s var(--ease-soft);
}

.progress__sun {
  position: absolute;
  top: 50%;
  width: 11px;
  height: 11px;
  border: 2px solid var(--paper);
  border-radius: 50%;
  background: var(--clay);
  transform: translate(-50%, -50%);
  transition: left 0.25s var(--ease-soft);
}

.progress__range {
  width: 100%;
  height: 20px;
  margin-top: -8px;
  opacity: 0;
  cursor: pointer;
}

.progress__actions {
  display: flex;
  gap: 7px;
  margin-top: 2px;
}

.progress__step {
  padding: 4px 9px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 9.5px;
  transition:
    border-color 0.2s var(--ease-soft),
    color 0.2s var(--ease-soft),
    background 0.2s var(--ease-soft);
}

.progress__step:hover {
  border-color: var(--ink);
  color: var(--ink);
}

.progress__step--finish {
  margin-left: auto;
  border-color: transparent;
  background: var(--paper-deep);
  color: var(--ink);
}

.progress--compact .progress__value {
  font-size: 20px;
}
</style>

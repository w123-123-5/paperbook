<script setup>
import { computed } from 'vue'

const props = defineProps({
  rating: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
  showValue: { type: Boolean, default: true },
})

const starFills = computed(() => {
  const score = Math.max(0, Math.min(5, props.rating / 2))
  return Array.from({ length: 5 }, (_, index) => {
    const fill = Math.max(0, Math.min(1, score - index))
    return Math.round(fill * 100)
  })
})
</script>

<template>
  <div class="rating" :aria-label="`评分 ${rating} 分，满分 10 分`">
    <span class="rating__stars" aria-hidden="true">
      <span
        v-for="(fill, index) in starFills"
        :key="index"
        class="rating__star"
        :style="{ '--fill': `${fill}%` }"
        >★</span
      >
    </span>
    <span v-if="showValue" class="rating__value">{{ rating.toFixed(1) }}</span>
    <span v-if="count" class="rating__count">({{ count.toLocaleString('zh-CN') }})</span>
  </div>
</template>

<style scoped>
.rating {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1;
}

.rating__stars {
  display: inline-flex;
  gap: 1px;
  font-size: 13px;
  letter-spacing: 0.02em;
}

.rating__star {
  background: linear-gradient(
    90deg,
    var(--gold) 0,
    var(--gold) var(--fill),
    var(--line-strong) var(--fill),
    var(--line-strong) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.rating__value {
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
}

.rating__count {
  color: var(--ink-faint);
  font-size: 10px;
}
</style>

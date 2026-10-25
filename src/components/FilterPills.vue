<script setup>
const model = defineModel({ type: String, default: '全部' })

defineProps({
  options: { type: Array, required: true },
  label: { type: String, default: '筛选' },
})
</script>

<template>
  <div class="pills" role="group" :aria-label="label">
    <button
      v-for="option in options"
      :key="option"
      type="button"
      class="pills__item"
      :class="{ 'is-active': model === option }"
      :aria-pressed="model === option"
      @click="model = option"
    >
      {{ option }}
    </button>
  </div>
</template>

<style scoped>
.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pills__item {
  min-height: 34px;
  padding: 4px 13px;
  border: 1px solid transparent;
  border-radius: 999px;
  color: var(--ink-soft);
  font-size: 12px;
  white-space: nowrap;
  transition:
    background 0.25s var(--ease-soft),
    border-color 0.25s var(--ease-soft),
    color 0.25s var(--ease-soft);
}

.pills__item:hover {
  border-color: var(--line);
  color: var(--ink);
}

.pills__item.is-active {
  background: var(--forest);
  border-color: var(--forest);
  color: var(--cream);
}
</style>

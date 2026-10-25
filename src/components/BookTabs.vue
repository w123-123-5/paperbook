<script setup>
const model = defineModel({ type: String, required: true })

defineProps({
  tabs: { type: Array, required: true },
})
</script>

<template>
  <div class="tabs" role="tablist" aria-label="书籍内容切换">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      class="tabs__item"
      :class="{ 'is-active': model === tab.id }"
      :aria-selected="model === tab.id"
      :aria-controls="`panel-${tab.id}`"
      :id="`tab-${tab.id}`"
      @click="model = tab.id"
    >
      <span class="tabs__index">{{ tab.index }}</span>
      {{ tab.label }}
      <span v-if="tab.count !== undefined" class="tabs__count">{{ tab.count }}</span>
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  border-bottom: 1px solid var(--line-strong);
  scrollbar-width: none;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tabs__item {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 15px 17px;
  color: var(--ink-faint);
  font-size: 12px;
  white-space: nowrap;
  transition: color 0.2s var(--ease-soft);
}

.tabs__item::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 2px;
  background: var(--clay);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s var(--ease-out);
}

.tabs__item:hover {
  color: var(--ink);
}

.tabs__item.is-active {
  color: var(--ink);
}

.tabs__item.is-active::after {
  transform: scaleX(1);
}

.tabs__index {
  color: var(--clay);
  font-family: var(--font-mono);
  font-size: 8px;
}

.tabs__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--paper-deep);
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 7.5px;
}

@media (max-width: 560px) {
  .tabs__item {
    padding: 13px 11px;
    font-size: 11px;
  }
}
</style>

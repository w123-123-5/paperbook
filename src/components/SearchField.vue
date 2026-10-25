<script setup>
import { ref } from 'vue'

const model = defineModel({ type: String, default: '' })

defineProps({
  placeholder: { type: String, default: '搜索书名、作者或关键词…' },
  label: { type: String, default: '搜索书目' },
})

const emit = defineEmits(['submit', 'clear'])
const inputRef = ref(null)

function clear() {
  model.value = ''
  emit('clear')
  inputRef.value?.focus()
}

function focus() {
  inputRef.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <form class="search" role="search" @submit.prevent="emit('submit', model)">
    <span class="search__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
        <circle cx="10.8" cy="10.8" r="6.4" />
        <path d="m16 16 4.2 4.2" stroke-linecap="round" />
      </svg>
    </span>
    <label class="sr-only" for="book-search">{{ label }}</label>
    <input
      id="book-search"
      ref="inputRef"
      v-model="model"
      class="search__input"
      type="search"
      :placeholder="placeholder"
      autocomplete="off"
      @keydown.esc="clear"
    />
    <button v-if="model" type="button" class="search__clear" aria-label="清空搜索" @click="clear">
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6">
        <path d="m5 5 10 10M15 5 5 15" stroke-linecap="round" />
      </svg>
    </button>
    <kbd v-else class="search__hint" aria-hidden="true">/</kbd>
  </form>
</template>

<style scoped>
.search {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 48px;
  padding: 0 14px 0 17px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--paper-soft);
  transition:
    border-color 0.2s var(--ease-soft),
    box-shadow 0.2s var(--ease-soft),
    background 0.2s var(--ease-soft);
}

.search:focus-within {
  border-color: var(--forest-soft);
  background: var(--cream);
  box-shadow: 0 0 0 4px rgba(109, 132, 118, 0.11);
}

.search__icon {
  display: inline-flex;
  flex: none;
  width: 18px;
  color: var(--ink-faint);
}

.search__input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 13.5px;
}

.search__input::placeholder {
  color: var(--ink-faint);
}

.search__input::-webkit-search-cancel-button {
  display: none;
}

.search__clear {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  color: var(--ink-faint);
  transition:
    background 0.2s var(--ease-soft),
    color 0.2s var(--ease-soft);
}

.search__clear:hover {
  background: var(--paper-deep);
  color: var(--ink);
}

.search__clear svg {
  width: 13px;
}

.search__hint {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 21px;
  height: 21px;
  border: 1px solid var(--line);
  border-radius: 5px;
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 10px;
}
</style>

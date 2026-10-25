<script setup>
import { inject } from 'vue'

const toast = inject('toast')
</script>

<template>
  <Teleport to="body">
    <div class="toast-stack" role="status" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="toast">
        <div
          v-for="item in toast.toasts"
          :key="item.id"
          class="toast"
          :class="`toast--${item.kind}`"
        >
          <span class="toast__icon" aria-hidden="true">
            <svg v-if="item.kind === 'success'" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="m4.5 10.5 3.5 3.4 7.4-7.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6">
              <circle cx="10" cy="10" r="7.2" />
              <path d="M10 6.2v4.6M10 13.7v.1" stroke-linecap="round" />
            </svg>
          </span>
          <div class="toast__content">
            <strong v-if="item.title">{{ item.title }}</strong>
            <p>{{ item.message }}</p>
          </div>
          <button type="button" class="toast__close" aria-label="关闭提示" @click="toast.dismiss(item.id)">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="m5.5 5.5 9 9M14.5 5.5l-9 9" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(92vw, 360px);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 14px 14px 14px 16px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--cream);
  box-shadow: var(--shadow-md);
  pointer-events: auto;
}

.toast--success {
  border-left: 3px solid var(--forest-soft);
}

.toast--warning {
  border-left: 3px solid var(--gold);
}

.toast--info {
  border-left: 3px solid var(--clay);
}

.toast__icon {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 23px;
  height: 23px;
  margin-top: 2px;
  border-radius: 50%;
  background: rgba(109, 132, 118, 0.12);
  color: var(--forest-soft);
}

.toast--warning .toast__icon {
  background: rgba(211, 163, 75, 0.16);
  color: var(--clay-deep);
}

.toast--info .toast__icon {
  background: rgba(189, 103, 72, 0.12);
  color: var(--clay);
}

.toast__icon svg {
  width: 12px;
  height: 12px;
}

.toast__content {
  flex: 1;
  min-width: 0;
}

.toast__content strong {
  display: block;
  margin-bottom: 1px;
  font-size: 11px;
  letter-spacing: 0.02em;
}

.toast__content p {
  margin: 0;
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1.6;
}

.toast__close {
  flex: none;
  color: var(--ink-faint);
  width: 22px;
  height: 22px;
}

.toast__close svg {
  width: 12px;
  height: 12px;
  margin: auto;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.28s var(--ease-soft),
    transform 0.28s var(--ease-out);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}

.toast-move {
  transition: transform 0.28s var(--ease-out);
}

@media (max-width: 560px) {
  .toast-stack {
    right: 14px;
    bottom: 14px;
    width: calc(100vw - 28px);
  }
}
</style>

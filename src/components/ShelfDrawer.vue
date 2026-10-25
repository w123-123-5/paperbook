<script setup>
import { computed, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import BookCover from './BookCover.vue'
import ReadingProgress from './ReadingProgress.vue'
import BaseButton from './BaseButton.vue'

const shelf = inject('shelf')
const toast = inject('toast')

const items = shelf.books
const count = shelf.count
const average = shelf.averageProgress
const isOpen = computed(() => shelf.state.drawerOpen)
const closeButton = ref(null)
const confirmClear = ref(false)

function close() {
  shelf.closeDrawer()
}

function remove(book) {
  shelf.remove(book.id)
  toast.push(`《${book.title}》已从书架移出`, { kind: 'info' })
}

function clearShelf() {
  if (!confirmClear.value) {
    confirmClear.value = true
    return
  }
  shelf.clear()
  confirmClear.value = false
  toast.push('书架已经清空，随时可以重新开始。', { kind: 'info' })
}

function onKeydown(event) {
  if (event.key === 'Escape' && isOpen.value) close()
}

watch(isOpen, async (open) => {
  document.body.classList.toggle('no-scroll', open)
  confirmClear.value = false
  if (open) {
    await nextTick()
    closeButton.value?.focus()
  }
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.classList.remove('no-scroll')
})
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isOpen" class="drawer" role="dialog" aria-modal="true" aria-label="我的书架">
        <div class="drawer__scrim" @click="close" />
        <aside class="drawer__panel">
          <header class="drawer__head">
            <div>
              <p class="eyebrow">MY READING SHELF</p>
              <h2 class="drawer__title">我的书架 <span>{{ count }}</span></h2>
            </div>
            <button ref="closeButton" type="button" class="drawer__close" aria-label="关闭书架" @click="close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="m5 5 14 14M19 5 5 19" stroke-linecap="round" />
              </svg>
            </button>
          </header>

          <div v-if="count" class="drawer__summary">
            <div>
              <strong>{{ count }}</strong>
              <span>本在书架</span>
            </div>
            <div>
              <strong>{{ average }}<small>%</small></strong>
              <span>平均阅读进度</span>
            </div>
            <div>
              <strong>{{ shelf.finishedCount.value }}</strong>
              <span>本已读完</span>
            </div>
          </div>

          <div v-if="!count" class="drawer__empty">
            <div class="drawer__empty-art" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <h3>书架还是空的</h3>
            <p>去书架挑一本合眼缘的书，读完的进度会自动留在这里。</p>
            <BaseButton to="/shelf" variant="primary" size="small" @click="close">
              去挑一本
            </BaseButton>
          </div>

          <div v-else class="drawer__list">
            <TransitionGroup name="shelf-item">
              <article v-for="book in items" :key="book.id" class="drawer-item">
                <RouterLink :to="`/books/${book.id}`" class="drawer-item__cover" @click="close">
                  <BookCover :book="book" size="sm" />
                </RouterLink>
                <div class="drawer-item__body">
                  <div class="drawer-item__top">
                    <div>
                      <h3>
                        <RouterLink :to="`/books/${book.id}`" @click="close">{{ book.title }}</RouterLink>
                      </h3>
                      <p>{{ book.author }} · {{ book.category }}</p>
                    </div>
                    <button
                      type="button"
                      class="drawer-item__remove"
                      :aria-label="`把《${book.title}》移出书架`"
                      @click="remove(book)"
                    >
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="m5.5 5.5 9 9M14.5 5.5l-9 9" stroke-linecap="round" />
                      </svg>
                    </button>
                  </div>
                  <ReadingProgress
                    :model-value="shelf.progressFor(book.id)"
                    title="阅读进度"
                    compact
                    @update:model-value="shelf.setProgress(book.id, $event)"
                  />
                </div>
              </article>
            </TransitionGroup>
          </div>

          <footer v-if="count" class="drawer__foot">
            <BaseButton to="/shelf" variant="primary" size="small" block @click="close">
              查看完整书架
            </BaseButton>
            <button type="button" class="drawer__clear" @click="clearShelf">
              {{ confirmClear ? '再点一次，确认清空' : '清空书架' }}
            </button>
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer {
  position: fixed;
  inset: 0;
  z-index: 150;
  display: flex;
  justify-content: flex-end;
}

.drawer__scrim {
  position: absolute;
  inset: 0;
  background: rgba(18, 27, 22, 0.45);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}

.drawer__panel {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: min(92vw, 460px);
  height: 100%;
  padding: 26px 28px 24px;
  background: var(--paper);
  box-shadow: -30px 0 90px rgba(18, 27, 22, 0.25);
}

.drawer__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--line);
}

.drawer__head .eyebrow {
  margin-bottom: 8px;
  font-size: 9px;
}

.drawer__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 600;
  line-height: 1.2;
}

.drawer__title span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: 5px;
  border-radius: 50%;
  background: var(--clay);
  color: #fff8ec;
  font-family: var(--font-mono);
  font-size: 11px;
  vertical-align: 6px;
}

.drawer__close {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--line);
  border-radius: 50%;
  transition:
    background 0.2s var(--ease-soft),
    color 0.2s var(--ease-soft);
}

.drawer__close:hover {
  background: var(--ink);
  color: var(--paper);
}

.drawer__close svg {
  width: 17px;
}

.drawer__summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
}

.drawer__summary div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.drawer__summary strong {
  color: var(--clay);
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 600;
  line-height: 1.1;
}

.drawer__summary strong small {
  font-family: var(--font-mono);
  font-size: 9px;
}

.drawer__summary span {
  color: var(--ink-faint);
  font-size: 10px;
}

.drawer__list {
  flex: 1;
  overflow-y: auto;
  margin: 0 -10px;
  padding: 8px 10px 20px;
}

.drawer-item {
  display: grid;
  grid-template-columns: 68px 1fr;
  gap: 15px;
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
}

.drawer-item__cover {
  display: block;
  width: 100%;
  padding-top: 4px;
}

.drawer-item__body {
  min-width: 0;
}

.drawer-item__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 11px;
}

.drawer-item__top h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;
}

.drawer-item__top h3 a:hover {
  color: var(--clay);
}

.drawer-item__top p {
  margin: 3px 0 0;
  color: var(--ink-faint);
  font-size: 10.5px;
}

.drawer-item__remove {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: var(--ink-faint);
  transition:
    background 0.2s var(--ease-soft),
    color 0.2s var(--ease-soft);
}

.drawer-item__remove:hover {
  background: rgba(189, 103, 72, 0.12);
  color: var(--clay);
}

.drawer-item__remove svg {
  width: 12px;
}

.drawer__foot {
  padding-top: 17px;
  border-top: 1px solid var(--line);
}

.drawer__clear {
  display: block;
  margin: 12px auto 0;
  color: var(--ink-faint);
  font-size: 10.5px;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.drawer__clear:hover {
  color: var(--clay);
}

.drawer__empty {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 22px;
  text-align: center;
}

.drawer__empty-art {
  position: relative;
  width: 120px;
  height: 82px;
  margin-bottom: 25px;
}

.drawer__empty-art span {
  position: absolute;
  left: 20px;
  display: block;
  height: 13px;
  border-radius: 3px;
  background: var(--forest);
}

.drawer__empty-art span:nth-child(1) {
  bottom: 8px;
  width: 80px;
  transform: rotate(-4deg);
}

.drawer__empty-art span:nth-child(2) {
  bottom: 28px;
  left: 30px;
  width: 68px;
  background: var(--clay);
  transform: rotate(3deg);
}

.drawer__empty-art span:nth-child(3) {
  bottom: 46px;
  left: 24px;
  width: 58px;
  background: var(--gold);
}

.drawer__empty h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 24px;
}

.drawer__empty p {
  max-width: 280px;
  margin: 9px 0 22px;
  color: var(--ink-soft);
  font-size: 12.5px;
  line-height: 1.8;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.35s var(--ease-soft);
}

.drawer-enter-active .drawer__panel,
.drawer-leave-active .drawer__panel {
  transition: transform 0.42s var(--ease-out);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer__panel,
.drawer-leave-to .drawer__panel {
  transform: translateX(100%);
}

.shelf-item-enter-active,
.shelf-item-leave-active {
  transition:
    opacity 0.25s var(--ease-soft),
    transform 0.25s var(--ease-out);
}

.shelf-item-leave-active {
  position: absolute;
  width: calc(100% - 20px);
}

.shelf-item-enter-from,
.shelf-item-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

@media (max-width: 560px) {
  .drawer__panel {
    width: 100%;
    padding: 22px 20px;
  }
}
</style>

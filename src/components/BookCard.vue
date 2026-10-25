<script setup>
import { computed, inject } from 'vue'
import BookCover from './BookCover.vue'
import StarRating from './StarRating.vue'
import BaseTag from './BaseTag.vue'

const props = defineProps({
  book: { type: Object, required: true },
  index: { type: Number, default: 0 },
  compact: { type: Boolean, default: false },
  showNote: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle'])
const shelf = inject('shelf', null)
const inShelf = computed(() => shelf?.has(props.book.id) ?? false)
</script>

<template>
  <article
    v-reveal="{ delay: Math.min(index, 8) * 55 }"
    class="book-card"
    :class="{ 'book-card--compact': compact }"
  >
    <div class="book-card__visual">
      <RouterLink
        :to="`/books/${book.id}`"
        class="book-card__cover-link"
        :aria-label="`查看《${book.title}》详情`"
      >
        <div class="book-card__cover">
          <BookCover :book="book" />
        </div>
        <span v-if="book.featured" class="book-card__badge">编辑精选</span>
      </RouterLink>
      <span class="book-card__shadow" aria-hidden="true" />
    </div>

    <div class="book-card__body">
      <div class="book-card__meta">
        <BaseTag :tone="inShelf ? 'clay' : 'default'">{{ inShelf ? '在书架' : book.category }}</BaseTag>
        <StarRating :rating="book.rating" :count="book.ratings" />
      </div>

      <h3 class="book-card__title">
        <RouterLink :to="`/books/${book.id}`">{{ book.title }}</RouterLink>
      </h3>

      <p class="book-card__author">
        {{ book.author }}
        <span v-if="book.translator"> · 译 {{ book.translator }}</span>
      </p>

      <p v-if="showNote" class="book-card__tagline">{{ book.tagline }}</p>

      <div class="book-card__foot">
        <span class="book-card__meta-text">{{ book.pages }} 页 · {{ book.year }}</span>
        <button
          type="button"
          class="book-card__toggle"
          :class="{ 'is-added': inShelf }"
          :aria-pressed="inShelf"
          @click="emit('toggle', book)"
        >
          <span aria-hidden="true">{{ inShelf ? '✓' : '+' }}</span>
          {{ inShelf ? '已在书架' : '加入书架' }}
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.book-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.book-card__visual {
  position: relative;
  padding: 0 8% 10px 4%;
}

.book-card__cover-link {
  position: relative;
  display: block;
  transition: transform 0.45s var(--ease-out);
}

.book-card__cover {
  position: relative;
  z-index: 2;
  transform: rotate(-1.2deg);
  transition: transform 0.45s var(--ease-out);
}

.book-card:nth-child(3n + 2) .book-card__cover {
  transform: rotate(0.8deg);
}

.book-card:nth-child(3n) .book-card__cover {
  transform: rotate(-0.3deg);
}

.book-card__cover-link:hover .book-card__cover {
  transform: rotate(0deg) translateY(-7px) scale(1.015);
}

.book-card__shadow {
  position: absolute;
  left: 12%;
  right: 12%;
  bottom: 1px;
  z-index: 0;
  height: 16px;
  border-radius: 50%;
  background: rgba(31, 43, 35, 0.18);
  filter: blur(12px);
  transition:
    transform 0.45s var(--ease-out),
    opacity 0.45s var(--ease-out);
}

.book-card__cover-link:hover + .book-card__shadow {
  transform: scale(1.05) translateY(3px);
  opacity: 0.7;
}

.book-card__badge {
  position: absolute;
  top: 12px;
  left: -7px;
  z-index: 3;
  padding: 5px 10px 5px 13px;
  background: var(--clay);
  color: #fff8ec;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  box-shadow: 0 6px 14px rgba(80, 40, 25, 0.2);
}

.book-card__badge::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  border-top: 6px solid var(--clay-deep);
  border-left: 7px solid transparent;
}

.book-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 19px 2px 0;
}

.book-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.book-card__title {
  margin: 14px 0 3px;
  font-family: var(--font-display);
  font-size: 23px;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.025em;
}

.book-card__title a {
  background-image: linear-gradient(var(--ink), var(--ink));
  background-repeat: no-repeat;
  background-size: 0 1px;
  background-position: 0 100%;
  transition: background-size 0.35s var(--ease-soft);
}

.book-card__title a:hover {
  background-size: 100% 1px;
}

.book-card__author {
  margin: 0;
  color: var(--ink-soft);
  font-size: 12px;
  letter-spacing: 0.02em;
}

.book-card__tagline {
  margin: 12px 0 0;
  color: var(--ink-soft);
  font-size: 13px;
  line-height: 1.7;
}

.book-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 17px;
}

.book-card__meta-text {
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.04em;
}

.book-card__toggle {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 0;
  border-bottom: 1px solid transparent;
  color: var(--clay);
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
  transition:
    color 0.2s var(--ease-soft),
    border-color 0.2s var(--ease-soft);
}

.book-card__toggle span {
  font-family: var(--font-mono);
  font-size: 15px;
  line-height: 1;
}

.book-card__toggle:hover {
  border-color: currentColor;
}

.book-card__toggle.is-added {
  color: var(--forest-soft);
}

.book-card--compact .book-card__title {
  font-size: 20px;
}

.book-card--compact .book-card__tagline {
  display: none;
}

.book-card--compact .book-card__cover-link {
  width: 82%;
  margin-inline: auto;
}

@media (max-width: 560px) {
  .book-card__title {
    font-size: 21px;
  }

  .book-card__visual {
    padding-right: 6%;
  }
}
</style>

<script setup>
import { inject, reactive, ref } from 'vue'
import StarRating from './StarRating.vue'

const props = defineProps({
  book: { type: Object, required: true },
})

await new Promise((resolve) => setTimeout(resolve, 520))

const toast = inject('toast', null)

const reviews = reactive([
  {
    id: 1,
    name: '阿枝',
    date: '2026.10.18',
    rating: 9.4,
    text: `读到一半的时候，我把书合上，去阳台站了一会儿。${props.book.title}不是那种会催你往前走的书，它只是安静地陪着你。`,
  },
  {
    id: 2,
    name: 'Momo',
    date: '2026.10.11',
    rating: 8.8,
    text: '纸间的选书单越来越像一张私人的地图了。这一本适合在夜里读，灯光暗一点，字会更亮。',
  },
  {
    id: 3,
    name: '晚风',
    date: '2026.09.29',
    rating: 9.0,
    text: `有些句子舍不得读完，就抄在本子上。${props.book.quote.slice(0, 24)}……谢谢把它放在门口。`,
  },
])

const form = reactive({
  name: '',
  text: '',
  score: 5,
})
const error = ref('')

function submit() {
  if (!form.text.trim()) {
    error.value = '写点什么再发布吧。'
    return
  }
  error.value = ''
  reviews.unshift({
    id: Date.now(),
    name: form.name.trim() || '一位路过的读者',
    date: new Date().toLocaleDateString('zh-CN').replaceAll('/', '.'),
    rating: Number(form.score) * 2,
    text: form.text.trim(),
  })
  form.text = ''
  form.name = ''
  form.score = 5
  toast?.push('短评已发布，谢谢你把它读完。', { kind: 'success' })
}
</script>

<template>
  <div class="reviews">
    <div class="reviews__head">
      <div>
        <p class="eyebrow">READER NOTES · 读者短评</p>
        <h2>读过的人，留下了这些。</h2>
      </div>
      <div class="reviews__score">
        <strong>{{ book.rating.toFixed(1) }}</strong>
        <StarRating :rating="book.rating" :show-value="false" />
        <span>{{ book.ratings.toLocaleString('zh-CN') }} 人读过</span>
      </div>
    </div>

    <div class="reviews__grid">
      <article v-for="review in reviews" :key="review.id" class="review-card">
        <div class="review-card__top">
          <span class="review-card__avatar" aria-hidden="true">{{ review.name.slice(0, 1) }}</span>
          <div>
            <strong>{{ review.name }}</strong>
            <span>{{ review.date }}</span>
          </div>
          <span class="review-card__rating">{{ review.rating.toFixed(1) }}</span>
        </div>
        <p>{{ review.text }}</p>
      </article>
    </div>

    <form class="review-form" novalidate @submit.prevent="submit">
      <div class="review-form__copy">
        <h3>也写一句？</h3>
        <p>不必写得完整，一个停下来的句子就很好。</p>
      </div>

      <div class="review-form__fields">
        <div class="review-form__row">
          <label class="field">
            <span class="field__label">怎么称呼你</span>
            <input v-model.trim="form.name" class="input" type="text" placeholder="不填也可以" maxlength="16" />
          </label>
          <label class="field">
            <span class="field__label">打几分</span>
            <select v-model.number="form.score" class="select">
              <option :value="5">5 星 · 很喜欢</option>
              <option :value="4">4 星 · 不错</option>
              <option :value="3">3 星 · 还行</option>
              <option :value="2">2 星 · 一般</option>
              <option :value="1">1 星 · 不太合拍</option>
            </select>
          </label>
        </div>
        <label class="field">
          <span class="field__label">你的短评</span>
          <textarea
            v-model.trim="form.text"
            class="textarea"
            maxlength="180"
            placeholder="读到哪一页停下来了？"
          />
        </label>
        <div class="review-form__foot">
          <span v-if="error" class="review-form__error">{{ error }}</span>
          <span v-else class="review-form__hint">{{ form.text.length }} / 180</span>
          <button type="submit" class="btn btn--primary btn--small">发布短评</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.reviews {
  padding-top: 8px;
}

.reviews__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 28px;
}

.reviews__head .eyebrow {
  margin-bottom: 9px;
}

.reviews__head h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 31px;
  font-weight: 500;
}

.reviews__score {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.reviews__score strong {
  color: var(--clay);
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 500;
  line-height: 1;
}

.reviews__score span:last-child {
  color: var(--ink-faint);
  font-size: 9px;
}

.reviews__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.review-card {
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--paper-soft);
}

.review-card__top {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 13px;
}

.review-card__avatar {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 29px;
  height: 29px;
  border-radius: 50%;
  background: var(--forest);
  color: var(--cream);
  font-family: var(--font-display);
  font-size: 12px;
}

.review-card__top div {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1px;
}

.review-card__top strong {
  font-size: 11px;
}

.review-card__top div span {
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 7.5px;
}

.review-card__rating {
  color: var(--clay);
  font-family: var(--font-mono);
  font-size: 9px;
}

.review-card > p {
  margin: 0;
  color: var(--ink-soft);
  font-size: 11.5px;
  line-height: 1.85;
}

.review-form {
  display: grid;
  grid-template-columns: 0.34fr 0.66fr;
  gap: 30px;
  margin-top: 30px;
  padding: 27px 29px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--paper-soft);
}

.review-form__copy h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 25px;
  font-weight: 500;
}

.review-form__copy p {
  margin: 7px 0 0;
  color: var(--ink-faint);
  font-size: 10.5px;
  line-height: 1.8;
}

.review-form__fields {
  display: grid;
  gap: 13px;
}

.review-form__row {
  display: grid;
  grid-template-columns: 1fr 0.8fr;
  gap: 12px;
}

.review-form :deep(.input),
.review-form :deep(.select),
.review-form :deep(.textarea) {
  background: var(--cream);
}

.review-form :deep(.textarea) {
  min-height: 98px;
}

.review-form__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.review-form__hint,
.review-form__error {
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 8.5px;
}

.review-form__error {
  color: var(--clay);
}

@media (max-width: 900px) {
  .reviews__grid {
    grid-template-columns: 1fr;
  }

  .review-form {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .reviews__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .reviews__score {
    align-items: flex-start;
  }

  .review-form {
    padding: 20px;
  }

  .review-form__row {
    grid-template-columns: 1fr;
  }
}
</style>

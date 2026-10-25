<script setup>
import { computed, defineAsyncComponent, inject, ref } from 'vue'
import { books, getBook } from '../data/books'
import BookCover from '../components/BookCover.vue'
import BaseTag from '../components/BaseTag.vue'
import BaseButton from '../components/BaseButton.vue'
import StarRating from '../components/StarRating.vue'
import ReadingProgress from '../components/ReadingProgress.vue'
import BookTabs from '../components/BookTabs.vue'
import BookCard from '../components/BookCard.vue'

const props = defineProps({
  id: { type: String, required: true },
})

const BookReviews = defineAsyncComponent(() => import('../components/BookReviews.vue'))

const shelf = inject('shelf')
const toast = inject('toast')

const book = getBook(props.id)
const activeTab = ref('intro')
const copied = ref(false)

const tabs = [
  { id: 'intro', index: '01', label: '内容简介' },
  { id: 'toc', index: '02', label: '目录' },
  { id: 'excerpt', index: '03', label: '书摘' },
  { id: 'reviews', index: '04', label: '读者短评', count: 3 },
]

const inShelf = computed(() => shelf.has(book.id))
const progress = computed({
  get: () => shelf.progressFor(book.id),
  set: (value) => shelf.setProgress(book.id, value),
})

const related = computed(() => {
  const same = books.filter((item) => item.id !== book.id && item.category === book.category)
  const rest = books.filter((item) => item.id !== book.id && !same.some((entry) => entry.id === item.id))
  return [...same, ...rest].slice(0, 3)
})

function toggleShelf() {
  const added = shelf.toggle(book.id)
  toast.push(
    added ? `《${book.title}》已经放进你的书架。` : `《${book.title}》已从书架移出。`,
    { kind: added ? 'success' : 'info', title: added ? '书架 +1' : '书架更新' },
  )
}

function borrow() {
  if (!inShelf.value) shelf.add(book.id)
  toast.push(`借阅成功。30 天内归还即可，不急。`, {
    title: `《${book.title}》`,
    kind: 'success',
  })
}

function finish() {
  toast.push('读完了。要不要写一句短评，留给下一位读者？', {
    title: '恭喜读完',
    kind: 'success',
    duration: 4500,
  })
}

async function copyQuote() {
  try {
    await navigator.clipboard.writeText(book.quote)
    copied.value = true
    toast.push('书摘已复制到剪贴板。', { kind: 'success' })
    setTimeout(() => (copied.value = false), 2200)
  } catch {
    toast.push('浏览器没有允许复制，请手动选中文字。', { kind: 'warning' })
  }
}

function toggleRelated(item) {
  const added = shelf.toggle(item.id)
  toast.push(added ? `《${item.title}》已加入书架。` : `《${item.title}》已移出书架。`, {
    kind: added ? 'success' : 'info',
  })
}
</script>

<template>
  <div v-if="book" class="detail-page">
    <section class="detail-hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="面包屑导航">
          <RouterLink to="/">首页</RouterLink>
          <span aria-hidden="true">/</span>
          <RouterLink to="/shelf">书架</RouterLink>
          <span aria-hidden="true">/</span>
          <RouterLink :to="{ path: '/shelf', query: { category: book.category } }">{{ book.category }}</RouterLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ book.title }}</span>
        </nav>

        <div class="detail-grid">
          <div class="detail-visual">
            <div class="detail-visual__arch" aria-hidden="true">
              <span class="detail-visual__line" />
              <span class="detail-visual__line detail-visual__line--two" />
            </div>
            <div class="detail-visual__sun" aria-hidden="true" />
            <div class="detail-visual__cover">
              <BookCover :book="book" size="lg" />
            </div>
            <div class="detail-visual__stamp">
              <span>PAPER BETWEEN</span>
              <strong>在架 · 可借</strong>
              <small>NO. {{ book.id.slice(0, 3).toUpperCase() }}</small>
            </div>
            <p class="detail-visual__note">“{{ book.tagline }}”</p>
          </div>

          <div class="detail-info">
            <div class="detail-info__tags">
              <BaseTag tone="clay">{{ book.category }}</BaseTag>
              <BaseTag tone="gold">{{ book.mood }}</BaseTag>
              <span class="detail-info__stock"><i aria-hidden="true" />馆内可借</span>
            </div>

            <h1 class="detail-info__title display">{{ book.title }}</h1>
            <p class="detail-info__subtitle">{{ book.subtitle }}</p>
            <p class="detail-info__author">
              {{ book.author }}
              <span v-if="book.translator"> · 译者 {{ book.translator }}</span>
            </p>

            <div class="detail-info__rating">
              <StarRating :rating="book.rating" :count="book.ratings" />
              <span class="detail-info__rating-label">豆瓣读者评分</span>
            </div>

            <p class="detail-info__blurb">{{ book.blurb }}</p>

            <blockquote class="detail-info__quote">
              “{{ book.quote.length > 78 ? `${book.quote.slice(0, 78)}…` : book.quote }}”
              <cite>— {{ book.quoteSource }}</cite>
            </blockquote>

            <div class="detail-info__actions">
              <BaseButton variant="primary" @click="borrow">
                借阅这本书
                <template #trailing>→</template>
              </BaseButton>
              <BaseButton variant="ghost" @click="toggleShelf">
                {{ inShelf ? '移出书架' : '+ 加入书架' }}
              </BaseButton>
              <button
                v-if="inShelf"
                type="button"
                class="detail-info__drawer"
                @click="shelf.openDrawer"
              >
                我的书架（{{ shelf.count.value }}）
              </button>
            </div>

            <div v-if="inShelf" class="detail-info__progress">
              <ReadingProgress v-model="progress" title="我的阅读进度" @finished="finish" />
            </div>
            <p v-else class="detail-info__progress-hint">
              加入书架后，可以随时记录阅读进度，读完会自动标记。
            </p>

            <dl class="detail-info__meta">
              <div>
                <dt>出版社</dt>
                <dd>{{ book.publisher }}</dd>
              </div>
              <div>
                <dt>出版年</dt>
                <dd>{{ book.year }}</dd>
              </div>
              <div>
                <dt>页数</dt>
                <dd>{{ book.pages }} 页</dd>
              </div>
              <div>
                <dt>ISBN</dt>
                <dd>{{ book.isbn }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <section class="section detail-body">
      <div class="container detail-body__grid">
        <aside class="detail-aside">
          <div class="detail-aside__card">
            <span class="detail-aside__mark" aria-hidden="true">“</span>
            <p class="detail-aside__label">店主手记</p>
            <p class="detail-aside__text">{{ book.staffNote }}</p>
            <span class="detail-aside__sign">— 张阿纸</span>
          </div>
          <div class="detail-aside__share">
            <span>把这本书分享给</span>
            <div>
              <button type="button" @click="copyQuote">复制书摘</button>
              <button type="button" @click="toast.push('链接已准备好，粘贴给朋友吧。', { kind: 'info' })">
                分享链接
              </button>
            </div>
            <span v-if="copied" class="detail-aside__copied">已复制 ✓</span>
          </div>
        </aside>

        <div class="detail-main">
          <BookTabs v-model="activeTab" :tabs="tabs" />

          <Transition name="tab-fade" mode="out-in">
            <div :key="activeTab" class="tab-panel" role="tabpanel" :id="`panel-${activeTab}`">
              <template v-if="activeTab === 'intro'">
                <p class="tab-panel__lead">{{ book.blurb }}</p>
                <p>
                  纸间把它放在靠窗第二排。它不是一本需要一口气读完的书，
                  更像一位不太爱说话的朋友，你坐下来，它就陪你坐一会儿。
                </p>
                <div class="intro-facts">
                  <div>
                    <span>适合的时候</span>
                    <strong>{{ book.mood === '治愈' ? '需要被轻轻接住的时候' : book.mood === '思辨' ? '想把问题想深一点的时候' : book.mood === '漫游' ? '想让思绪走远一点的时候' : '需要一点重新出发的力气时' }}</strong>
                  </div>
                  <div>
                    <span>建议读法</span>
                    <strong>{{ book.pages > 500 ? '不必赶，分三周慢慢读' : '一个下午，或连续三个晚上' }}</strong>
                  </div>
                  <div>
                    <span>读完会想</span>
                    <strong>给某个人写一封信</strong>
                  </div>
                </div>
              </template>

              <template v-else-if="activeTab === 'toc'">
                <div class="toc-head">
                  <p class="tab-panel__lead">全书目录 · 共 {{ book.toc.length }} 章</p>
                  <span>{{ book.pages }} 页</span>
                </div>
                <ol class="toc">
                  <li v-for="(chapter, index) in book.toc" :key="chapter">
                    <span class="toc__index">{{ String(index + 1).padStart(2, '0') }}</span>
                    <span class="toc__title">{{ chapter }}</span>
                    <span class="toc__line" aria-hidden="true" />
                    <span class="toc__page">{{ Math.round(((index + 1) / book.toc.length) * book.pages) }}</span>
                  </li>
                </ol>
              </template>

              <template v-else-if="activeTab === 'excerpt'">
                <div class="excerpt">
                  <span class="excerpt__mark" aria-hidden="true">“</span>
                  <blockquote>{{ book.excerpt }}</blockquote>
                  <cite>—《{{ book.title }}》</cite>
                  <button type="button" class="excerpt__copy" @click="copyQuote">
                    {{ copied ? '已复制 ✓' : '复制这段书摘' }}
                  </button>
                </div>
                <p class="excerpt__note">
                  书摘由店员手工录入，可能因版本不同与原文有个别出入。若你恰好读到同一页，
                  欢迎来店里和我们核对。
                </p>
              </template>

              <template v-else>
                <Suspense>
                  <BookReviews :book="book" />
                  <template #fallback>
                    <div class="reviews-loading">
                      <span class="reviews-loading__dot" />
                      <span class="reviews-loading__dot" />
                      <span class="reviews-loading__dot" />
                      <p>正在把读者的便签取下来…</p>
                    </div>
                  </template>
                </Suspense>
              </template>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <section class="section related">
      <div class="container">
        <div class="related__head">
          <div>
            <p class="eyebrow">KEEP READING · 顺藤摸瓜</p>
            <h2 class="display">读完这本，还可以看看</h2>
          </div>
          <RouterLink to="/shelf" class="related__link">回到书架 <span>→</span></RouterLink>
        </div>
        <div class="related__grid">
          <BookCard
            v-for="(item, index) in related"
            :key="item.id"
            :book="item"
            :index="index"
            compact
            @toggle="toggleRelated"
          />
        </div>
      </div>
    </section>
  </div>

  <section v-else class="missing-book">
    <div class="container">
      <p class="eyebrow">404 · NOT ON THE SHELF</p>
      <h1 class="display">这本书不在架上。</h1>
      <p>可能是被谁借走了，也可能只是还没有遇见。</p>
      <BaseButton to="/shelf" variant="primary">回到书架</BaseButton>
    </div>
  </section>
</template>

<style scoped>
.detail-page {
  background: var(--paper);
}

.detail-hero {
  position: relative;
  padding: 28px 0 70px;
  background:
    radial-gradient(circle at 14% 14%, rgba(211, 163, 75, 0.14), transparent 33%),
    var(--paper-soft);
  border-bottom: 1px solid var(--line);
  overflow: hidden;
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 38px;
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.05em;
}

.breadcrumb a {
  transition: color 0.2s var(--ease-soft);
}

.breadcrumb a:hover {
  color: var(--clay);
}

.breadcrumb span[aria-current='page'] {
  color: var(--ink);
}

.detail-grid {
  display: grid;
  grid-template-columns: 0.78fr 1.22fr;
  gap: 64px;
  align-items: center;
}

.detail-visual {
  position: relative;
  min-height: 560px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-visual__arch {
  position: absolute;
  top: 4%;
  left: 5%;
  width: 90%;
  height: 80%;
  border: 1px solid var(--line);
  border-bottom: 0;
  border-radius: 260px 260px 0 0;
  background: linear-gradient(180deg, rgba(250, 245, 236, 0.34), transparent);
  overflow: hidden;
}

.detail-visual__line {
  position: absolute;
  top: 11%;
  left: 50%;
  width: 68%;
  height: 1px;
  background: var(--line);
  transform: translateX(-50%);
}

.detail-visual__line--two {
  top: 14.5%;
  width: 48%;
  opacity: 0.6;
}

.detail-visual__sun {
  position: absolute;
  top: 5%;
  right: 0;
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: var(--gold);
  opacity: 0.5;
}

.detail-visual__cover {
  position: relative;
  z-index: 2;
  width: 61%;
  transform: rotate(-2.3deg);
  filter: drop-shadow(0 35px 40px rgba(25, 37, 29, 0.2));
}

.detail-visual__stamp {
  position: absolute;
  bottom: 10%;
  left: 3%;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 9px 12px;
  border: 1px solid var(--clay);
  color: var(--clay);
  background: var(--paper);
  transform: rotate(-4deg);
}

.detail-visual__stamp span,
.detail-visual__stamp small {
  font-family: var(--font-mono);
  font-size: 6.5px;
  letter-spacing: 0.09em;
}

.detail-visual__stamp strong {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 500;
}

.detail-visual__note {
  position: absolute;
  right: 0;
  bottom: 4%;
  z-index: 3;
  max-width: 190px;
  margin: 0;
  color: var(--ink-faint);
  font-family: var(--font-display);
  font-size: 11.5px;
  line-height: 1.7;
  text-align: right;
}

.detail-info__tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
}

.detail-info__stock {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: 3px;
  color: var(--ink-faint);
  font-size: 9px;
}

.detail-info__stock i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--forest-soft);
  box-shadow: 0 0 0 3px rgba(109, 132, 118, 0.14);
}

.detail-info__title {
  margin: 21px 0 4px;
  font-size: clamp(3.3rem, 6vw, 5.8rem);
  font-weight: 600;
  line-height: 1.03;
  letter-spacing: -0.055em;
}

.detail-info__subtitle {
  margin: 0;
  color: var(--ink-soft);
  font-family: var(--font-display);
  font-size: 16px;
}

.detail-info__author {
  margin: 14px 0 0;
  color: var(--ink-soft);
  font-size: 12px;
}

.detail-info__rating {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 15px;
  padding-top: 14px;
  border-top: 1px dashed var(--line);
}

.detail-info__rating-label {
  color: var(--ink-faint);
  font-size: 8.5px;
}

.detail-info__blurb {
  max-width: 590px;
  margin: 21px 0 0;
  color: var(--ink-soft);
  font-size: 13px;
  line-height: 1.95;
}

.detail-info__quote {
  max-width: 540px;
  margin: 23px 0;
  padding: 14px 0 14px 17px;
  border-left: 2px solid var(--gold);
  font-family: var(--font-display);
  font-size: 14px;
  line-height: 1.8;
}

.detail-info__quote cite {
  display: block;
  margin-top: 6px;
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 7.5px;
  font-style: normal;
}

.detail-info__actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
}

.detail-info__drawer {
  color: var(--ink-faint);
  font-size: 9.5px;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.detail-info__drawer:hover {
  color: var(--clay);
}

.detail-info__progress {
  max-width: 460px;
  margin-top: 22px;
  padding: 16px 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--paper);
}

.detail-info__progress-hint {
  max-width: 460px;
  margin: 19px 0 0;
  padding: 11px 14px;
  border-left: 2px solid var(--line-strong);
  color: var(--ink-faint);
  font-size: 9.5px;
  line-height: 1.7;
}

.detail-info__meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 11px 28px;
  max-width: 540px;
  margin: 25px 0 0;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.detail-info__meta div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 15px;
}

.detail-info__meta dt {
  color: var(--ink-faint);
  font-size: 8.5px;
}

.detail-info__meta dd {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 8.5px;
  text-align: right;
}

.detail-body {
  padding-top: 70px;
}

.detail-body__grid {
  display: grid;
  grid-template-columns: 255px 1fr;
  gap: 64px;
  align-items: start;
}

.detail-aside {
  position: sticky;
  top: calc(var(--header-h) + 24px);
}

.detail-aside__card {
  position: relative;
  padding: 24px 22px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--forest-deep);
  color: var(--cream);
  overflow: hidden;
}

.detail-aside__mark {
  position: absolute;
  top: 1px;
  right: 15px;
  color: var(--gold);
  font-family: var(--font-display);
  font-size: 56px;
  line-height: 1;
  opacity: 0.7;
}

.detail-aside__label {
  margin: 0 0 14px;
  color: var(--gold);
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.14em;
}

.detail-aside__text {
  margin: 0;
  color: rgba(244, 237, 225, 0.82);
  font-family: var(--font-display);
  font-size: 13px;
  line-height: 1.9;
}

.detail-aside__sign {
  display: block;
  margin-top: 15px;
  color: rgba(244, 237, 225, 0.45);
  font-size: 9px;
  text-align: right;
}

.detail-aside__share {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-top: 18px;
  padding: 17px 2px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  color: var(--ink-faint);
  font-size: 9px;
}

.detail-aside__share div {
  display: flex;
  gap: 13px;
}

.detail-aside__share button {
  color: var(--ink-soft);
  font-size: 9.5px;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.detail-aside__share button:hover {
  color: var(--clay);
}

.detail-aside__copied {
  color: var(--forest-soft);
  font-family: var(--font-mono);
  font-size: 8px;
}

.detail-main {
  min-width: 0;
}

.tab-panel {
  padding-top: 30px;
  max-width: 780px;
  color: var(--ink-soft);
  font-size: 13px;
  line-height: 1.95;
}

.tab-panel p {
  margin: 0 0 15px;
}

.tab-panel .tab-panel__lead {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 20px;
  line-height: 1.7;
}

.intro-facts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  margin-top: 28px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--line);
}

.intro-facts div {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 17px;
  background: var(--paper-soft);
}

.intro-facts span {
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 7.5px;
  letter-spacing: 0.08em;
}

.intro-facts strong {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;
}

.toc-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 20px;
}

.toc-head > span {
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 8px;
}

.toc {
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}

.toc li {
  display: flex;
  align-items: baseline;
  gap: 13px;
  padding: 13px 0;
  border-bottom: 1px solid var(--line);
}

.toc__index {
  flex: none;
  width: 24px;
  color: var(--clay);
  font-family: var(--font-mono);
  font-size: 8px;
}

.toc__title {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 15px;
}

.toc__line {
  flex: 1;
  height: 1px;
  border-top: 1px dotted var(--line-strong);
  transform: translateY(-3px);
}

.toc__page {
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 8px;
}

.excerpt {
  position: relative;
  padding: 35px 35px 28px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background:
    radial-gradient(circle at 90% 10%, rgba(211, 163, 75, 0.13), transparent 45%),
    var(--paper-soft);
}

.excerpt__mark {
  position: absolute;
  top: 3px;
  left: 19px;
  color: var(--gold);
  font-family: var(--font-display);
  font-size: 78px;
  line-height: 1;
  opacity: 0.6;
}

.excerpt blockquote {
  position: relative;
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.4vw, 1.7rem);
  line-height: 1.85;
}

.excerpt cite {
  display: block;
  margin-top: 17px;
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 8px;
  font-style: normal;
}

.excerpt__copy {
  margin-top: 20px;
  padding: 5px 0;
  border-bottom: 1px solid var(--line-strong);
  color: var(--clay);
  font-size: 9.5px;
}

.excerpt__note {
  margin-top: 17px !important;
  color: var(--ink-faint);
  font-size: 9.5px;
  line-height: 1.8;
}

.reviews-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 220px;
  color: var(--ink-faint);
}

.reviews-loading__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--clay);
  animation: bounce 1s infinite;
}

.reviews-loading__dot:nth-child(2) {
  animation-delay: 0.12s;
}

.reviews-loading__dot:nth-child(3) {
  animation-delay: 0.24s;
}

.reviews-loading p {
  flex-basis: 100%;
  margin: 9px 0 0;
  text-align: center;
  font-size: 9.5px;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }

  40% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition:
    opacity 0.25s var(--ease-soft),
    transform 0.25s var(--ease-out);
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.related {
  border-top: 1px solid var(--line);
  background: var(--paper-soft);
}

.related__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 40px;
}

.related__head h2 {
  font-size: clamp(2rem, 3.8vw, 3rem);
}

.related__link {
  flex: none;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--line-strong);
  color: var(--ink-soft);
  font-size: 10px;
}

.related__link:hover {
  color: var(--clay);
}

.related__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.missing-book {
  padding: 120px 0;
}

.missing-book h1 {
  font-size: clamp(2.8rem, 6vw, 5rem);
}

.missing-book p {
  margin: 18px 0 30px;
  color: var(--ink-soft);
}

@media (max-width: 1050px) {
  .detail-grid {
    gap: 30px;
  }

  .detail-visual__cover {
    width: 70%;
  }

  .detail-body__grid {
    grid-template-columns: 220px 1fr;
    gap: 40px;
  }
}

@media (max-width: 900px) {
  .detail-hero {
    padding-top: 22px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .detail-visual {
    min-height: 440px;
    max-width: 520px;
    margin-inline: auto;
    width: 100%;
  }

  .detail-visual__cover {
    width: 48%;
  }

  .detail-visual__note {
    right: 5%;
  }

  .detail-body__grid {
    grid-template-columns: 1fr;
  }

  .detail-aside {
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }
}

@media (max-width: 620px) {
  .breadcrumb {
    margin-bottom: 20px;
  }

  .detail-info__title {
    font-size: 3.1rem;
  }

  .detail-info__blurb {
    font-size: 12.5px;
  }

  .detail-visual {
    min-height: 390px;
  }

  .detail-visual__cover {
    width: 57%;
  }

  .detail-visual__stamp {
    bottom: 6%;
  }

  .detail-visual__note {
    display: none;
  }

  .detail-info__meta {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .detail-aside {
    grid-template-columns: 1fr;
  }

  .detail-body {
    padding-top: 50px;
  }

  .intro-facts {
    grid-template-columns: 1fr;
  }

  .excerpt {
    padding: 25px 20px 22px;
  }

  .related__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .related__grid {
    grid-template-columns: 1fr;
    gap: 38px;
  }
}
</style>

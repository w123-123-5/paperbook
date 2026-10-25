<script setup>
import { computed, inject, nextTick, onActivated, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { books, categories, collections, moods } from '../data/books'
import BookCard from '../components/BookCard.vue'
import BookCover from '../components/BookCover.vue'
import SearchField from '../components/SearchField.vue'
import FilterPills from '../components/FilterPills.vue'
import StarRating from '../components/StarRating.vue'
import EmptyState from '../components/EmptyState.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseTag from '../components/BaseTag.vue'

const route = useRoute()
const router = useRouter()
const shelf = inject('shelf')
const toast = inject('toast')

const search = ref(String(route.query.q ?? ''))
const category = ref(categories.includes(String(route.query.category)) ? String(route.query.category) : '全部')
const mood = ref(moods.some((item) => item.value === route.query.mood) ? String(route.query.mood) : 'all')
const sort = ref(['featured', 'rating', 'year', 'title'].includes(String(route.query.sort)) ? String(route.query.sort) : 'featured')
const view = ref(route.query.view === 'list' ? 'list' : 'grid')
const searchRef = ref(null)
let searchTimer = null
let syncing = false

const activeCollection = computed(() => {
  const id = route.query.collection
  return collections.find((collection) => collection.id === id) ?? null
})

const filteredBooks = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  let result = books.filter((book) => {
    if (activeCollection.value && !activeCollection.value.bookIds.includes(book.id)) return false
    if (category.value !== '全部' && book.category !== category.value) return false
    if (mood.value !== 'all' && book.mood !== mood.value) return false
    if (!keyword) return true
    return [book.title, book.author, book.category, book.tagline, book.blurb]
      .join(' ')
      .toLowerCase()
      .includes(keyword)
  })

  result = [...result]
  if (sort.value === 'rating') result.sort((a, b) => b.rating - a.rating)
  if (sort.value === 'year') result.sort((a, b) => b.year - a.year)
  if (sort.value === 'title') result.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
  if (sort.value === 'featured') {
    result.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating)
  }
  return result
})

const hasFilters = computed(
  () => Boolean(search.value.trim()) || category.value !== '全部' || mood.value !== 'all' || Boolean(activeCollection.value),
)

const shelfCount = computed(() => shelf.count.value)
const categoriesInStock = new Set(books.map((book) => book.category)).size

function syncQuery() {
  if (syncing) return
  const query = {}
  if (search.value.trim()) query.q = search.value.trim()
  if (category.value !== '全部') query.category = category.value
  if (mood.value !== 'all') query.mood = mood.value
  if (sort.value !== 'featured') query.sort = sort.value
  if (view.value !== 'grid') query.view = view.value
  if (activeCollection.value) query.collection = activeCollection.value.id
  router.replace({ path: '/shelf', query })
}

watch(
  () => route.query,
  async (query) => {
    syncing = true
    if (query.category && categories.includes(String(query.category))) category.value = String(query.category)
    if (query.mood && moods.some((item) => item.value === query.mood)) mood.value = String(query.mood)
    if (query.sort) sort.value = String(query.sort)
    if (query.view) view.value = String(query.view)
    if (query.q !== undefined) search.value = String(query.q)
    await nextTick()
    syncing = false
  },
  { deep: true },
)

watch(search, () => {
  if (syncing) return
  clearTimeout(searchTimer)
  searchTimer = setTimeout(syncQuery, 320)
})

watch([category, mood, sort, view], () => {
  if (!syncing) syncQuery()
})

function clearFilters() {
  search.value = ''
  category.value = '全部'
  mood.value = 'all'
  router.replace({ path: '/shelf' })
}

function toggle(book) {
  const added = shelf.toggle(book.id)
  toast.push(
    added ? `《${book.title}》已经放进你的书架。` : `《${book.title}》已从书架移出。`,
    { kind: added ? 'success' : 'info', title: added ? '书架 +1' : '书架更新' },
  )
}

async function focusSearch() {
  if (route.query.focus !== '1') return
  await nextTick()
  searchRef.value?.focus()
}

onMounted(focusSearch)
onActivated(focusSearch)
</script>

<template>
  <div class="shelf-page">
    <section class="shelf-hero">
      <div class="container">
        <div class="shelf-hero__top">
          <div class="shelf-hero__copy">
            <p class="eyebrow">THE SHELF · 在架书目</p>
            <h1 class="display">
              把想读的，<br />
              <em>放进书架。</em>
            </h1>
            <p class="shelf-hero__intro">
              十二本我们真正读过的书。可以按心情挑，也可以什么都不想，随便翻翻。
              书架上的每一本，都可以免费借阅。
            </p>
          </div>

          <aside class="shelf-hero__aside">
            <div class="shelf-hero__count">
              <span>{{ String(books.length).padStart(2, '0') }}</span>
              <p>本在架图书<br /><small>每一本都读过才上架</small></p>
            </div>
            <dl class="shelf-hero__facts">
              <div>
                <dt>类别</dt>
                <dd>{{ categoriesInStock }} 种</dd>
              </div>
              <div>
                <dt>借阅</dt>
                <dd>免费 · 30 天</dd>
              </div>
              <div>
                <dt>我的书架</dt>
                <dd>{{ shelfCount }} 本</dd>
              </div>
            </dl>
            <button type="button" class="shelf-hero__drawer" @click="shelf.openDrawer">
              打开我的书架
              <span aria-hidden="true">↗</span>
            </button>
          </aside>
        </div>

        <div class="shelf-hero__marquee" aria-hidden="true">
          <span>READ SLOWLY</span>
          <i>✦</i>
          <span>借阅免费</span>
          <i>✦</i>
          <span>每一本都读过</span>
          <i>✦</i>
          <span>FIND YOUR NEXT BOOK</span>
        </div>
      </div>
    </section>

    <section class="section shelf-main">
      <div class="container">
        <div class="shelf-toolbar">
          <div class="shelf-toolbar__search">
            <SearchField
              ref="searchRef"
              v-model="search"
              placeholder="搜书名、作者、类别，或一种心情…"
              @submit="syncQuery"
            />
          </div>

          <div class="shelf-toolbar__row">
            <FilterPills v-model="category" :options="categories" label="按类别筛选" />

            <div class="shelf-toolbar__selects">
              <label class="select-wrap">
                <span class="sr-only">按气质筛选</span>
                <select v-model="mood" class="select select--small">
                  <option v-for="item in moods" :key="item.value" :value="item.value">{{ item.label }}</option>
                </select>
              </label>

              <label class="select-wrap">
                <span class="sr-only">排序方式</span>
                <select v-model="sort" class="select select--small">
                  <option value="featured">推荐排序</option>
                  <option value="rating">评分最高</option>
                  <option value="year">出版年份</option>
                  <option value="title">书名 A–Z</option>
                </select>
              </label>

              <div class="view-toggle" role="group" aria-label="切换视图">
                <button
                  type="button"
                  :class="{ 'is-active': view === 'grid' }"
                  aria-label="网格视图"
                  :aria-pressed="view === 'grid'"
                  @click="view = 'grid'"
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4">
                    <rect x="3" y="3" width="5.5" height="5.5" />
                    <rect x="11.5" y="3" width="5.5" height="5.5" />
                    <rect x="3" y="11.5" width="5.5" height="5.5" />
                    <rect x="11.5" y="11.5" width="5.5" height="5.5" />
                  </svg>
                </button>
                <button
                  type="button"
                  :class="{ 'is-active': view === 'list' }"
                  aria-label="列表视图"
                  :aria-pressed="view === 'list'"
                  @click="view = 'list'"
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4">
                    <path d="M4 5h12M4 10h12M4 15h12" stroke-linecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeCollection" class="collection-banner">
          <div>
            <span class="collection-banner__kicker">{{ activeCollection.kicker }}</span>
            <h2>{{ activeCollection.title }}</h2>
            <p>{{ activeCollection.description }}</p>
          </div>
          <button type="button" class="collection-banner__close" @click="router.replace({ path: '/shelf' })">
            取消主题筛选
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div class="results-head">
          <p>
            找到 <strong>{{ filteredBooks.length }}</strong> 本书
            <span v-if="search" class="results-head__query">· “{{ search }}”</span>
          </p>
          <button v-if="hasFilters" type="button" class="results-head__clear" @click="clearFilters">
            清除全部筛选
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <Transition name="fade" mode="out-in">
          <EmptyState
            v-if="!filteredBooks.length"
            key="empty"
            title="没有找到这一本"
            description="也许它还在路上。换一个关键词，或者把筛选放宽一点。"
          >
            <BaseButton variant="primary" size="small" @click="clearFilters">看看全部书目</BaseButton>
          </EmptyState>

          <TransitionGroup
            v-else-if="view === 'grid'"
            key="grid"
            name="book-list"
            tag="div"
            class="shelf-grid"
          >
            <BookCard
              v-for="(book, index) in filteredBooks"
              :key="book.id"
              :book="book"
              :index="index"
              show-note
              @toggle="toggle"
            />
          </TransitionGroup>

          <TransitionGroup v-else key="list" name="book-list" tag="div" class="shelf-list">
            <article
              v-for="(book, index) in filteredBooks"
              :key="book.id"
              v-memo="[book.id, shelf.has(book.id)]"
              class="list-item"
            >
              <RouterLink :to="`/books/${book.id}`" class="list-item__cover">
                <BookCover :book="book" size="sm" />
              </RouterLink>

              <div class="list-item__body">
                <div class="list-item__meta">
                  <BaseTag>{{ book.category }}</BaseTag>
                  <span>{{ book.year }}</span>
                  <span>{{ book.pages }} 页</span>
                </div>
                <h3>
                  <RouterLink :to="`/books/${book.id}`">{{ book.title }}</RouterLink>
                  <small>{{ book.subtitle }}</small>
                </h3>
                <p class="list-item__author">{{ book.author }}<span v-if="book.translator"> · 译 {{ book.translator }}</span></p>
                <p class="list-item__tagline">{{ book.tagline }}</p>
              </div>

              <div class="list-item__rating">
                <StarRating :rating="book.rating" :count="book.ratings" />
                <span>{{ book.mood }}</span>
              </div>

              <div class="list-item__actions">
                <button
                  type="button"
                  class="list-item__toggle"
                  :class="{ 'is-added': shelf.has(book.id) }"
                  @click="toggle(book)"
                >
                  {{ shelf.has(book.id) ? '已在书架' : '+ 加入书架' }}
                </button>
                <RouterLink :to="`/books/${book.id}`" class="list-item__arrow" :aria-label="`查看《${book.title}》`">
                  ↗
                </RouterLink>
              </div>
            </article>
          </TransitionGroup>
        </Transition>
      </div>
    </section>
  </div>
</template>

<style scoped>
.shelf-hero {
  position: relative;
  padding: 58px 0 0;
  background:
    radial-gradient(circle at 82% 12%, rgba(211, 163, 75, 0.16), transparent 32%),
    var(--paper-soft);
  border-bottom: 1px solid var(--line);
  overflow: hidden;
}

.shelf-hero::before {
  content: 'SHELF';
  position: absolute;
  right: -1%;
  bottom: -7%;
  color: rgba(32, 51, 42, 0.035);
  font-family: var(--font-display);
  font-size: 19vw;
  font-weight: 700;
  letter-spacing: -0.08em;
  line-height: 1;
  pointer-events: none;
}

.shelf-hero__top {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 0.58fr;
  gap: 70px;
  align-items: end;
  padding-bottom: 55px;
}

.shelf-hero__copy h1 {
  font-size: clamp(3.4rem, 6vw, 5.7rem);
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: -0.055em;
}

.shelf-hero__copy h1 em {
  color: var(--clay);
  font-style: italic;
}

.shelf-hero__intro {
  max-width: 550px;
  margin: 25px 0 0;
  color: var(--ink-soft);
  font-size: 13.5px;
  line-height: 1.95;
}

.shelf-hero__aside {
  padding: 24px 25px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--paper) 76%, transparent);
}

.shelf-hero__count {
  display: flex;
  align-items: center;
  gap: 15px;
  padding-bottom: 17px;
  border-bottom: 1px solid var(--line);
}

.shelf-hero__count > span {
  color: var(--clay);
  font-family: var(--font-display);
  font-size: 58px;
  font-weight: 500;
  line-height: 0.9;
  letter-spacing: -0.06em;
}

.shelf-hero__count p {
  margin: 0;
  color: var(--ink);
  font-size: 12px;
  line-height: 1.6;
}

.shelf-hero__count small {
  color: var(--ink-faint);
  font-size: 9px;
}

.shelf-hero__facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px 20px;
  margin: 16px 0 0;
}

.shelf-hero__facts div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.shelf-hero__facts div:last-child {
  grid-column: 1 / -1;
  padding-top: 9px;
  border-top: 1px dashed var(--line);
}

.shelf-hero__facts dt {
  color: var(--ink-faint);
  font-size: 9.5px;
}

.shelf-hero__facts dd {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 9.5px;
}

.shelf-hero__drawer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 15px;
  padding-top: 13px;
  border-top: 1px solid var(--line);
  color: var(--clay);
  font-size: 10.5px;
  font-weight: 600;
}

.shelf-hero__drawer span {
  transition: transform 0.2s var(--ease-out);
}

.shelf-hero__drawer:hover span {
  transform: translate(2px, -2px);
}

.shelf-hero__marquee {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px 0;
  border-top: 1px solid var(--line);
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.12em;
  white-space: nowrap;
  overflow: hidden;
}

.shelf-hero__marquee i {
  color: var(--clay);
  font-style: normal;
}

.shelf-main {
  padding-top: 44px;
}

.shelf-toolbar {
  position: sticky;
  top: calc(var(--header-h) + 8px);
  z-index: 10;
  display: grid;
  gap: 14px;
  margin-bottom: 30px;
  padding: 17px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--paper) 92%, transparent);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  box-shadow: var(--shadow-sm);
}

.shelf-toolbar__search {
  max-width: 520px;
}

.shelf-toolbar__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.shelf-toolbar__selects {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: none;
}

.select--small {
  width: auto;
  min-height: 34px;
  padding: 4px 30px 4px 11px;
  border-radius: 999px;
  font-size: 10.5px;
  background-color: transparent;
}

.view-toggle {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border: 1px solid var(--line);
  border-radius: 999px;
}

.view-toggle button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 29px;
  height: 29px;
  border-radius: 50%;
  color: var(--ink-faint);
  transition:
    background 0.2s var(--ease-soft),
    color 0.2s var(--ease-soft);
}

.view-toggle button.is-active {
  background: var(--forest);
  color: var(--cream);
}

.view-toggle svg {
  width: 13px;
  height: 13px;
}

.collection-banner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 28px;
  padding: 24px 28px;
  border-left: 3px solid var(--clay);
  background: var(--paper-soft);
}

.collection-banner__kicker {
  color: var(--clay);
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.14em;
}

.collection-banner h2 {
  margin: 6px 0 5px;
  font-family: var(--font-display);
  font-size: 27px;
  font-weight: 500;
}

.collection-banner p {
  margin: 0;
  color: var(--ink-soft);
  font-size: 11.5px;
}

.collection-banner__close {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--ink-faint);
  font-size: 10px;
}

.collection-banner__close span {
  font-size: 15px;
}

.results-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 25px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.results-head p {
  margin: 0;
  color: var(--ink-soft);
  font-size: 11px;
}

.results-head strong {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 600;
}

.results-head__query {
  color: var(--ink-faint);
}

.results-head__clear {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--clay);
  font-size: 10.5px;
}

.results-head__clear span {
  font-size: 14px;
}

.shelf-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 45px 28px;
}

.shelf-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--line-strong);
}

.list-item {
  display: grid;
  grid-template-columns: 96px 1fr 120px 135px;
  gap: 24px;
  align-items: center;
  padding: 21px 4px;
  border-bottom: 1px solid var(--line);
  transition: padding 0.3s var(--ease-out);
}

.list-item:hover {
  padding-left: 10px;
}

.list-item__cover {
  display: block;
  width: 100%;
}

.list-item__meta {
  display: flex;
  align-items: center;
  gap: 11px;
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 8px;
}

.list-item h3 {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 9px;
  margin: 8px 0 2px;
  font-family: var(--font-display);
  font-size: 23px;
  font-weight: 500;
}

.list-item h3 a:hover {
  color: var(--clay);
}

.list-item h3 small {
  color: var(--ink-faint);
  font-family: var(--font-sans);
  font-size: 9.5px;
  font-weight: 400;
}

.list-item__author {
  margin: 0;
  color: var(--ink-soft);
  font-size: 10.5px;
}

.list-item__tagline {
  margin: 7px 0 0;
  color: var(--ink-faint);
  font-size: 11px;
}

.list-item__rating {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 7px;
}

.list-item__rating > span {
  color: var(--clay);
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.08em;
}

.list-item__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 13px;
}

.list-item__toggle {
  color: var(--clay);
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.list-item__toggle.is-added {
  color: var(--forest-soft);
}

.list-item__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid var(--line);
  border-radius: 50%;
  color: var(--ink-faint);
  font-size: 12px;
  transition:
    background 0.2s var(--ease-soft),
    color 0.2s var(--ease-soft);
}

.list-item__arrow:hover {
  background: var(--ink);
  color: var(--paper);
}

.book-list-enter-active,
.book-list-leave-active {
  transition:
    opacity 0.3s var(--ease-soft),
    transform 0.3s var(--ease-out);
}

.book-list-enter-from,
.book-list-leave-to {
  opacity: 0;
  transform: translateY(14px);
}

.book-list-move {
  transition: transform 0.35s var(--ease-out);
}

@media (max-width: 1050px) {
  .shelf-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .shelf-toolbar__row {
    align-items: flex-start;
    flex-direction: column;
  }

  .shelf-toolbar__selects {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 900px) {
  .shelf-hero__top {
    grid-template-columns: 1fr;
    gap: 30px;
    padding-bottom: 38px;
  }

  .shelf-hero__aside {
    max-width: 460px;
  }

  .list-item {
    grid-template-columns: 65px 1fr 85px;
    gap: 17px;
  }

  .list-item__actions {
    grid-column: 2 / -1;
    justify-content: flex-start;
    margin-top: -8px;
  }

  .list-item__rating {
    align-items: flex-end;
  }
}

@media (max-width: 700px) {
  .shelf-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 35px 20px;
  }

  .shelf-toolbar {
    position: static;
    padding: 13px;
  }

  .shelf-toolbar__selects {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .collection-banner {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
    padding: 19px 20px;
  }

  .list-item {
    grid-template-columns: 55px 1fr;
    gap: 13px;
    padding: 16px 2px;
  }

  .list-item__rating {
    display: none;
  }

  .list-item h3 {
    font-size: 20px;
  }

  .list-item__tagline {
    display: none;
  }
}

@media (max-width: 480px) {
  .shelf-hero {
    padding-top: 36px;
  }

  .shelf-hero__copy h1 {
    font-size: 3.1rem;
  }

  .shelf-grid {
    grid-template-columns: 1fr;
    gap: 42px;
  }

  .shelf-hero__marquee {
    gap: 11px;
  }

  .shelf-hero__count > span {
    font-size: 48px;
  }

  .results-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
}
</style>

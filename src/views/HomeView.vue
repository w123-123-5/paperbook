<script setup>
import { computed, inject, ref } from 'vue'
import { books, booksById, collections, events, quotes, stats } from '../data/books'
import BookCard from '../components/BookCard.vue'
import BookCover from '../components/BookCover.vue'
import SectionTitle from '../components/SectionTitle.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseTag from '../components/BaseTag.vue'
import StatBlock from '../components/StatBlock.vue'
import QuoteMarquee from '../components/QuoteMarquee.vue'
import ReadingProgress from '../components/ReadingProgress.vue'
import NewsletterForm from '../components/NewsletterForm.vue'

const shelf = inject('shelf')
const toast = inject('toast')

const featured = books.filter((book) => book.featured).slice(0, 4)
const weeklyBook = booksById['earth-temple']
const weeklyProgress = ref(62)

const inWeeklyShelf = computed(() => shelf.has(weeklyBook.id))

const stackBooks = [booksById['siddhartha'], booksById['camellia'], booksById['night-submarine']]

const collectionBooks = (collection) => collection.bookIds.map((id) => booksById[id])

function toggle(book) {
  const added = shelf.toggle(book.id)
  toast.push(
    added ? `《${book.title}》已经放进你的书架。` : `《${book.title}》已从书架移出。`,
    { kind: added ? 'success' : 'info', title: added ? '书架 +1' : '书架更新' },
  )
}

function joinWeekly() {
  if (!shelf.has(weeklyBook.id)) {
    shelf.add(weeklyBook.id)
    shelf.setProgress(weeklyBook.id, weeklyProgress.value)
    toast.push('已加入本周共读，阅读进度会替你留着。', { title: '共读报名成功' })
  } else {
    shelf.openDrawer()
  }
}

function finishWeekly() {
  toast.push('恭喜读完《我与地坛》。去写两句感受吧。', { title: '本周共读完成', kind: 'success' })
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="container hero__grid">
        <div class="hero__copy">
          <p class="hero__kicker">
            <span>湖南 · 衡阳</span>
            <i aria-hidden="true" />
            <span>独立书店</span>
            <i aria-hidden="true" />
            <span>2019 — 现在</span>
          </p>

          <h1 class="hero__title display">
            <span>让好书</span>
            <span>找到<span class="hero__accent">下一位</span></span>
            <span>读者。</span>
          </h1>

          <p class="hero__lede">
            我们相信阅读不是一件需要赶时间的事。挑一本合眼缘的书，在窗边坐下来，
            让纸页替你把这世界调成静音。
          </p>

          <div class="hero__actions">
            <BaseButton to="/shelf" variant="primary">
              逛逛书架
              <template #trailing>→</template>
            </BaseButton>
            <BaseButton to="/about" variant="ghost">听听书店的故事</BaseButton>
          </div>

          <div class="hero__foot">
            <span><i class="dot dot--open" aria-hidden="true" />今日营业至 21:00</span>
            <span>常胜西路 27 号 · 二楼有猫</span>
          </div>
        </div>

        <div class="hero__visual" aria-label="纸间书店本周推荐的三本书">
          <div class="stage__halo" aria-hidden="true" />
          <div class="stage__arch" aria-hidden="true">
            <span class="stage__arch-line" />
            <span class="stage__arch-line stage__arch-line--two" />
          </div>
          <div class="stage__sun" aria-hidden="true" />

          <div class="stage__label">
            <span>本周共读</span>
            <strong>NO. 07</strong>
          </div>

          <div class="stage__book stage__book--a">
            <BookCover :book="stackBooks[0]" size="lg" />
          </div>
          <div class="stage__book stage__book--b">
            <BookCover :book="stackBooks[1]" size="lg" />
          </div>
          <div class="stage__book stage__book--c">
            <BookCover :book="stackBooks[2]" size="lg" />
          </div>

          <div class="stage__note">
            <span class="stage__note-mark" aria-hidden="true">“</span>
            <p>慢一点读，<br />也没关系。</p>
            <small>店主手写 · 2026</small>
          </div>

          <div class="stage__floor" aria-hidden="true" />
        </div>
      </div>

      <div class="container">
        <div class="hero__stats">
          <StatBlock v-for="stat in stats" :key="stat.label" :value="stat.value" :suffix="stat.suffix" :label="stat.label" />
          <p class="hero__stats-note">
            书店不大，<br />但每一本都是自己挑的。
          </p>
        </div>
      </div>
    </section>

    <div class="marquee" aria-hidden="true">
      <div class="marquee__track">
        <span v-for="n in 2" :key="n" class="marquee__group">
          <span>独立选书</span><i>✦</i>
          <span>每周共读</span><i>✦</i>
          <span>手写信</span><i>✦</i>
          <span>旧书交换</span><i>✦</i>
          <span>窗边座位</span><i>✦</i>
          <span>慢慢营业</span><i>✦</i>
        </span>
      </div>
    </div>

    <section class="section featured">
      <div class="container">
        <SectionTitle
          eyebrow="EDITOR'S PICKS · 编辑精选"
          title="这周，我们把这几本放在门口"
          description="不是因为它们畅销，而是因为最近总有人站在它们面前，翻了两页就舍不得放下。"
        >
          <template #action>
            <RouterLink to="/shelf" class="text-link">查看全部书目 <span>→</span></RouterLink>
          </template>
        </SectionTitle>

        <div class="featured__grid">
          <BookCard
            v-for="(book, index) in featured"
            :key="book.id"
            :book="book"
            :index="index"
            show-note
            @toggle="toggle"
          />
        </div>
      </div>
    </section>

    <section class="collections">
      <div class="container">
        <SectionTitle
          eyebrow="CURATED COLLECTIONS · 主题书架"
          title="从一个问题出发，去读三本书"
          description="我们把书按“最近在想的事”重新排列。你可以顺着一个主题，慢慢走进去。"
        >
          <template #action>
            <BaseTag tone="gold">共 3 个主题 · 9 本书</BaseTag>
          </template>
        </SectionTitle>

        <div class="collection-grid">
          <RouterLink
            v-for="(collection, index) in collections"
            :key="collection.id"
            :to="{ path: '/shelf', query: { collection: collection.id } }"
            class="collection-card"
            :class="`collection-card--${collection.tone}`"
          >
            <div class="collection-card__top">
              <span class="collection-card__index">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="collection-card__kicker">{{ collection.kicker }}</span>
            </div>

            <div class="collection-card__covers" aria-hidden="true">
              <span
                v-for="(book, bookIndex) in collectionBooks(collection)"
                :key="book.id"
                class="collection-card__cover"
                :style="{ '--i': bookIndex }"
              >
                <BookCover :book="book" size="sm" />
              </span>
            </div>

            <div class="collection-card__body">
              <h3>{{ collection.title }}</h3>
              <p>{{ collection.description }}</p>
              <span class="collection-card__more">{{ collection.bookIds.length }} 本书 · 走进去 <i>→</i></span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="section quote-section">
      <div class="container">
        <QuoteMarquee :quotes="quotes" />
      </div>
    </section>

    <section class="section weekly-section">
      <div class="container">
        <div class="weekly">
          <div class="weekly__visual">
            <div class="weekly__number" aria-hidden="true">07</div>
            <div class="weekly__cover">
              <BookCover :book="weeklyBook" size="lg" />
            </div>
            <div class="weekly__stamp">
              <span>本周共读</span>
              <strong>WEEK 07</strong>
              <small>11.02 SAT</small>
            </div>
            <p class="weekly__caption">“一个人，出生了，这就不再是一个可以辩论的问题。”</p>
          </div>

          <div class="weekly__body">
            <p class="eyebrow">THIS WEEK'S READ · 本周共读</p>
            <h2 class="display">把苦想透，<br />然后继续生长。</h2>
            <p class="weekly__intro">
              史铁生摇着轮椅走进地坛的时候，大概也没想到，这座荒芜的园子会接住那么多人的下坠。
              这一周，我们重读《我与地坛》，读一个人如何与命运讲和，又如何不肯认输。
            </p>

            <blockquote class="weekly__quote">
              “死是一件不必急于求成的事，死是一个必然会降临的节日。”
              <cite>—《我与地坛》</cite>
            </blockquote>

            <div class="weekly__progress">
              <ReadingProgress
                v-model="weeklyProgress"
                title="本周共读进度 · 大家可以一起拖"
                @finished="finishWeekly"
              />
            </div>

            <div class="weekly__actions">
              <BaseButton variant="primary" @click="joinWeekly">
                {{ inWeeklyShelf ? '打开我的书架' : '加入共读' }}
              </BaseButton>
              <BaseButton :to="`/books/${weeklyBook.id}`" variant="ghost">先读读这本书</BaseButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section events-section">
      <div class="container">
        <SectionTitle
          eyebrow="IN THE STORE · 书店日历"
          title="接下来，在纸间见面"
          description="不用预约的，直接来；需要报名的，点一下日历就好。"
        >
          <template #action>
            <RouterLink to="/about#events" class="text-link">全部活动 <span>→</span></RouterLink>
          </template>
        </SectionTitle>

        <div class="events">
          <RouterLink
            v-for="(event, index) in events"
            :key="event.title"
            to="/about#events"
            class="event-row"
          >
            <span class="event-row__index">{{ String(index + 1).padStart(2, '0') }}</span>
            <div class="event-row__date">
              <strong>{{ event.date }}</strong>
              <span>{{ event.weekday }}</span>
            </div>
            <div class="event-row__body">
              <h3>{{ event.title }}</h3>
              <p>{{ event.meta }}</p>
            </div>
            <BaseTag tone="clay">{{ event.tag }}</BaseTag>
            <span class="event-row__arrow" aria-hidden="true">↗</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="section newsletter-section">
      <div class="container">
        <NewsletterForm />
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  padding: 56px 0 0;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -18%;
  right: -6%;
  width: 56vw;
  height: 56vw;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(211, 163, 75, 0.16), transparent 65%);
  pointer-events: none;
}

.hero::after {
  content: '';
  position: absolute;
  top: 0;
  right: 8%;
  width: 1px;
  height: 70%;
  background: linear-gradient(var(--line), transparent);
  pointer-events: none;
}

.hero__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.02fr 0.98fr;
  align-items: center;
  gap: 30px;
  min-height: 640px;
}

.hero__copy {
  padding-bottom: 34px;
}

.hero__kicker {
  display: flex;
  align-items: center;
  gap: 11px;
  margin: 0 0 27px;
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
}

.hero__kicker i {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--clay);
}

.hero__title {
  margin: 0;
  font-size: clamp(3.7rem, 6.6vw, 6.3rem);
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: -0.055em;
}

.hero__title span {
  display: block;
}

.hero__title .hero__accent {
  position: relative;
  display: inline-block;
  color: var(--clay);
  font-style: italic;
}

.hero__accent::after {
  content: '';
  position: absolute;
  right: -2px;
  bottom: 6%;
  left: 2px;
  height: 9px;
  background: var(--gold);
  opacity: 0.28;
  transform: rotate(-1.2deg);
  z-index: -1;
}

.hero__lede {
  max-width: 465px;
  margin: 29px 0 0;
  color: var(--ink-soft);
  font-size: 14.5px;
  line-height: 2;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 11px;
  margin-top: 33px;
}

.hero__foot {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  margin-top: 38px;
  color: var(--ink-faint);
  font-size: 10px;
  letter-spacing: 0.03em;
}

.hero__foot span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--forest-soft);
}

.dot--open {
  box-shadow: 0 0 0 3px rgba(109, 132, 118, 0.14);
}

.hero__visual {
  position: relative;
  height: 600px;
  min-width: 0;
}

.stage__halo {
  position: absolute;
  top: 18%;
  left: 10%;
  width: 80%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(211, 163, 75, 0.22), transparent 68%);
  filter: blur(4px);
}

.stage__arch {
  position: absolute;
  top: 3%;
  left: 9%;
  width: 72%;
  height: 78%;
  border: 1px solid var(--line);
  border-bottom: 0;
  border-radius: 300px 300px 0 0;
  background: linear-gradient(180deg, rgba(250, 245, 236, 0.5), rgba(232, 221, 203, 0.1));
  overflow: hidden;
}

:root[data-theme='night'] .stage__arch {
  background: linear-gradient(180deg, rgba(29, 42, 35, 0.7), rgba(17, 26, 22, 0.2));
}

.stage__arch-line {
  position: absolute;
  top: 12%;
  left: 50%;
  width: 72%;
  height: 1px;
  background: var(--line);
  transform: translateX(-50%);
}

.stage__arch-line--two {
  top: 16%;
  width: 55%;
  opacity: 0.6;
}

.stage__sun {
  position: absolute;
  top: 12%;
  right: 2%;
  width: 86px;
  height: 86px;
  border-radius: 50%;
  background: var(--gold);
  opacity: 0.55;
  filter: blur(1px);
}

.stage__label {
  position: absolute;
  top: 5%;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 9px 12px;
  border: 1px solid var(--line-strong);
  background: var(--paper);
  transform: rotate(-3deg);
}

.stage__label span {
  color: var(--clay);
  font-size: 9px;
  letter-spacing: 0.1em;
}

.stage__label strong {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
}

.stage__book {
  position: absolute;
  width: 37%;
  filter: drop-shadow(0 25px 30px rgba(25, 37, 29, 0.16));
  transition: transform 0.55s var(--ease-out);
}

.stage__book--a {
  top: 28%;
  left: 13%;
  z-index: 1;
  transform: rotate(-9deg);
}

.stage__book--b {
  top: 16%;
  left: 33%;
  z-index: 3;
  width: 39%;
  transform: rotate(2deg);
}

.stage__book--c {
  top: 38%;
  left: 57%;
  z-index: 2;
  transform: rotate(12deg);
}

.hero__visual:hover .stage__book--a {
  transform: rotate(-12deg) translate(-8px, -5px);
}

.hero__visual:hover .stage__book--b {
  transform: rotate(0deg) translateY(-10px);
}

.hero__visual:hover .stage__book--c {
  transform: rotate(15deg) translate(8px, -4px);
}

.stage__note {
  position: absolute;
  right: -1%;
  bottom: 9%;
  z-index: 4;
  width: 146px;
  padding: 16px 16px 13px;
  background: var(--cream);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-md);
  transform: rotate(2.5deg);
}

.stage__note-mark {
  position: absolute;
  top: 2px;
  right: 12px;
  color: var(--gold);
  font-family: var(--font-display);
  font-size: 34px;
  line-height: 1;
}

.stage__note p {
  margin: 0;
  font-family: var(--font-display);
  font-size: 15px;
  line-height: 1.65;
}

.stage__note small {
  display: block;
  margin-top: 9px;
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 7.5px;
  letter-spacing: 0.08em;
}

.stage__floor {
  position: absolute;
  right: 0;
  bottom: 2%;
  left: 0;
  height: 1px;
  background: var(--line);
}

.hero__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr) 1.25fr;
  gap: 24px;
  align-items: center;
  padding: 27px 0 30px;
  border-top: 1px solid var(--line);
}

.hero__stats-note {
  margin: 0;
  padding-left: 30px;
  border-left: 1px solid var(--line);
  color: var(--ink-faint);
  font-family: var(--font-display);
  font-size: 12px;
  line-height: 1.7;
}

.marquee {
  overflow: hidden;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: var(--paper-soft);
}

.marquee__track {
  display: flex;
  width: max-content;
  animation: marquee 34s linear infinite;
}

.marquee__group {
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 13px 0;
  white-space: nowrap;
}

.marquee__group span {
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.15em;
}

.marquee__group i {
  color: var(--clay);
  font-style: normal;
  font-size: 8px;
}

@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}

.featured__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding-bottom: 3px;
  border-bottom: 1px solid var(--line-strong);
  color: var(--ink);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition:
    border-color 0.2s var(--ease-soft),
    color 0.2s var(--ease-soft);
}

.text-link span {
  transition: transform 0.2s var(--ease-out);
}

.text-link:hover {
  border-color: var(--clay);
  color: var(--clay);
}

.text-link:hover span {
  transform: translateX(3px);
}

.collections {
  padding: 96px 0 100px;
  background: var(--forest-deep);
  color: var(--cream);
}

.collections :deep(.eyebrow) {
  color: var(--gold);
}

.collections :deep(.section-title__desc) {
  color: rgba(244, 237, 225, 0.62);
}

.collections :deep(.tag) {
  border-color: rgba(244, 237, 225, 0.22);
  color: rgba(244, 237, 225, 0.7);
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.collection-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 430px;
  padding: 25px 25px 24px;
  border: 1px solid rgba(244, 237, 225, 0.15);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition:
    background 0.35s var(--ease-soft),
    border-color 0.35s var(--ease-soft),
    transform 0.35s var(--ease-out);
}

.collection-card:hover {
  border-color: rgba(244, 237, 225, 0.35);
  transform: translateY(-5px);
}

.collection-card--green {
  background: linear-gradient(160deg, rgba(109, 132, 118, 0.22), rgba(34, 55, 45, 0.4));
}

.collection-card--clay {
  background: linear-gradient(160deg, rgba(189, 103, 72, 0.2), rgba(34, 55, 45, 0.4));
}

.collection-card--ink {
  background: linear-gradient(160deg, rgba(211, 163, 75, 0.13), rgba(34, 55, 45, 0.5));
}

.collection-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.collection-card__index {
  color: var(--gold);
  font-family: var(--font-display);
  font-size: 23px;
}

.collection-card__kicker {
  color: rgba(244, 237, 225, 0.38);
  font-family: var(--font-mono);
  font-size: 7.5px;
  letter-spacing: 0.14em;
}

.collection-card__covers {
  position: relative;
  height: 178px;
  margin: 12px 0 4px;
}

.collection-card__cover {
  position: absolute;
  top: 18px;
  left: calc(50% - 55px + var(--i) * 37px);
  display: block;
  width: 96px;
  transform: rotate(calc((var(--i) - 1) * 7deg));
  transition:
    transform 0.45s var(--ease-out),
    top 0.45s var(--ease-out);
}

.collection-card:hover .collection-card__cover {
  top: 7px;
}

.collection-card:hover .collection-card__cover:nth-child(1) {
  transform: rotate(-10deg) translateX(-8px);
}

.collection-card:hover .collection-card__cover:nth-child(2) {
  transform: rotate(0deg) translateY(-5px);
}

.collection-card:hover .collection-card__cover:nth-child(3) {
  transform: rotate(10deg) translateX(8px);
}

.collection-card__body {
  margin-top: auto;
  padding-top: 21px;
  border-top: 1px solid rgba(244, 237, 225, 0.13);
}

.collection-card__body h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 25px;
  font-weight: 500;
  letter-spacing: -0.03em;
}

.collection-card__body p {
  min-height: 44px;
  margin: 9px 0 20px;
  color: rgba(244, 237, 225, 0.58);
  font-size: 11.5px;
  line-height: 1.8;
}

.collection-card__more {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(244, 237, 225, 0.82);
  font-size: 10px;
  letter-spacing: 0.04em;
}

.collection-card__more i {
  font-style: normal;
  transition: transform 0.25s var(--ease-out);
}

.collection-card:hover .collection-card__more i {
  transform: translateX(4px);
}

.quote-section {
  padding: 95px 0;
}

.weekly-section {
  padding: 40px 0 110px;
}

.weekly {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 76px;
  align-items: center;
}

.weekly__visual {
  position: relative;
  min-height: 500px;
  padding: 30px 30px 0;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background:
    radial-gradient(circle at 20% 10%, rgba(211, 163, 75, 0.16), transparent 45%),
    var(--paper-soft);
}

.weekly__number {
  position: absolute;
  top: 12px;
  right: 22px;
  color: var(--line-strong);
  font-family: var(--font-display);
  font-size: 98px;
  line-height: 1;
  letter-spacing: -0.06em;
}

.weekly__cover {
  position: relative;
  z-index: 1;
  width: 62%;
  margin: 39px auto 0;
  transform: rotate(-2.5deg);
}

.weekly__stamp {
  position: absolute;
  top: 33px;
  left: 24px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 9px 12px;
  border: 1px solid var(--clay);
  color: var(--clay);
  transform: rotate(-4deg);
}

.weekly__stamp span,
.weekly__stamp small {
  font-family: var(--font-mono);
  font-size: 7px;
  letter-spacing: 0.1em;
}

.weekly__stamp strong {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.weekly__caption {
  position: absolute;
  right: 24px;
  bottom: 26px;
  left: 24px;
  margin: 0;
  padding-top: 15px;
  border-top: 1px solid var(--line);
  color: var(--ink-faint);
  font-family: var(--font-display);
  font-size: 12px;
  line-height: 1.7;
}

.weekly__body h2 {
  font-size: clamp(2.3rem, 4.2vw, 3.7rem);
  margin-bottom: 22px;
}

.weekly__intro {
  max-width: 530px;
  margin: 0;
  color: var(--ink-soft);
  font-size: 13.5px;
  line-height: 1.95;
}

.weekly__quote {
  max-width: 500px;
  margin: 25px 0;
  padding: 17px 0 17px 19px;
  border-left: 2px solid var(--gold);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 15px;
  line-height: 1.8;
}

.weekly__quote cite {
  display: block;
  margin-top: 8px;
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 8px;
  font-style: normal;
  letter-spacing: 0.05em;
}

.weekly__progress {
  max-width: 470px;
  margin-bottom: 26px;
  padding: 18px 20px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--paper-soft);
}

.weekly__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.events-section {
  padding-top: 0;
}

.events {
  border-top: 1px solid var(--line-strong);
}

.event-row {
  display: grid;
  grid-template-columns: 34px 72px 1fr auto 24px;
  align-items: center;
  gap: 22px;
  padding: 25px 0;
  border-bottom: 1px solid var(--line);
  transition: padding 0.3s var(--ease-out);
}

.event-row:hover {
  padding-left: 10px;
}

.event-row__index {
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 9px;
}

.event-row__date {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.event-row__date strong {
  font-family: var(--font-display);
  font-size: 27px;
  font-weight: 500;
  line-height: 1;
}

.event-row__date span {
  color: var(--clay);
  font-family: var(--font-mono);
  font-size: 7.5px;
  letter-spacing: 0.1em;
}

.event-row__body h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 500;
}

.event-row__body p {
  margin: 3px 0 0;
  color: var(--ink-faint);
  font-size: 10.5px;
}

.event-row__arrow {
  color: var(--ink-faint);
  font-size: 16px;
  transition: transform 0.25s var(--ease-out);
}

.event-row:hover .event-row__arrow {
  transform: translate(3px, -3px);
}

.newsletter-section {
  padding-top: 30px;
  padding-bottom: 110px;
}

@media (max-width: 1100px) {
  .hero__grid {
    gap: 0;
  }

  .hero__visual {
    height: 520px;
  }

  .stage__book {
    width: 42%;
  }

  .stage__book--b {
    left: 30%;
    width: 43%;
  }

  .stage__book--c {
    left: 55%;
  }

  .featured__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px 30px;
  }

  .quiz {
    grid-template-columns: 1fr;
  }

  .weekly {
    grid-template-columns: 1fr;
    gap: 42px;
  }

  .weekly__visual {
    min-height: 540px;
    max-width: 560px;
  }

  .weekly__body {
    max-width: 720px;
  }
}

@media (max-width: 900px) {
  .hero {
    padding-top: 34px;
  }

  .hero__grid {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .hero__copy {
    position: relative;
    z-index: 2;
    padding-bottom: 0;
  }

  .hero__title {
    font-size: clamp(3.4rem, 11vw, 5.6rem);
  }

  .hero__visual {
    height: 520px;
    max-width: 580px;
    margin: 8px auto 0;
    width: 100%;
  }

  .hero__stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px 20px;
    margin-top: 20px;
  }

  .hero__stats-note {
    display: none;
  }

  .collection-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .collection-card {
    min-height: 0;
  }

  .collection-card__covers {
    height: 165px;
  }

  .collections {
    padding: 70px 0;
  }

  .quote-section {
    padding: 60px 0;
  }

  .event-row {
    grid-template-columns: 24px 64px 1fr 20px;
    gap: 15px;
  }

  .event-row :deep(.tag) {
    display: none;
  }
}

@media (max-width: 620px) {
  .hero__kicker {
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }

  .hero__title {
    font-size: clamp(3.05rem, 14vw, 4.3rem);
  }

  .hero__lede {
    margin-top: 22px;
    font-size: 13.5px;
  }

  .hero__actions {
    margin-top: 26px;
  }

  .hero__actions :deep(.btn) {
    flex: 1;
  }

  .hero__foot {
    gap: 12px;
    margin-top: 28px;
  }

  .hero__visual {
    height: 400px;
  }

  .stage__arch {
    left: 4%;
    width: 82%;
  }

  .stage__book--a {
    left: 7%;
    width: 44%;
  }

  .stage__book--b {
    left: 28%;
    width: 46%;
  }

  .stage__book--c {
    left: 54%;
    width: 43%;
  }

  .stage__note {
    right: 0;
    bottom: 4%;
    width: 120px;
    padding: 12px;
  }

  .stage__note p {
    font-size: 13px;
  }

  .stage__label {
    top: 1%;
  }

  .hero__stats {
    padding-bottom: 24px;
  }

  .featured__grid {
    grid-template-columns: 1fr;
    gap: 45px;
  }

  .collection-card__covers {
    height: 150px;
  }

  .collection-card__cover {
    width: 84px;
    left: calc(50% - 48px + var(--i) * 32px);
  }

  .weekly {
    gap: 30px;
  }

  .weekly__visual {
    min-height: 450px;
    padding-inline: 20px;
  }

  .weekly__cover {
    width: 68%;
    margin-top: 55px;
  }

  .weekly__caption {
    right: 18px;
    bottom: 18px;
    left: 18px;
    font-size: 11px;
  }

  .weekly__body h2 {
    font-size: 2.45rem;
  }

  .weekly__quote {
    font-size: 14px;
  }

  .weekly__actions :deep(.btn) {
    flex: 1;
  }

  .event-row {
    grid-template-columns: 55px 1fr 18px;
    gap: 12px;
  }

  .event-row__index {
    display: none;
  }

  .event-row__date strong {
    font-size: 23px;
  }

  .event-row__body h3 {
    font-size: 18px;
  }

  .newsletter-section {
    padding-bottom: 70px;
  }
}
</style>

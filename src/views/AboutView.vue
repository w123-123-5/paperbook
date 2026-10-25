<script setup>
import { inject } from 'vue'
import { events, stats } from '../data/books'
import BaseButton from '../components/BaseButton.vue'
import BaseTag from '../components/BaseTag.vue'
import SectionTitle from '../components/SectionTitle.vue'
import StatBlock from '../components/StatBlock.vue'
import FaqList from '../components/FaqList.vue'
import ContactForm from '../components/ContactForm.vue'
import NewsletterForm from '../components/NewsletterForm.vue'

const toast = inject('toast')

const values = [
  {
    number: '01',
    title: '认真选书',
    text: '不追榜单，不堆畅销书。每一本上架前，至少有一位店员完整读过。',
  },
  {
    number: '02',
    title: '允许发呆',
    text: '窗边有三把椅子，不消费也可以坐。书翻到一半睡着，是这里的正常事。',
  },
  {
    number: '03',
    title: '相信纸页',
    text: '在屏幕上能读到更多，但有些句子，需要在纸上被手指按过才作数。',
  },
]

const timeline = [
  { year: '2019', title: '在常胜西路开门', text: '一间 42 平方米的铺面，三面书架，一张旧木桌。第一天卖出了 7 本书。' },
  { year: '2020', title: '把共读搬到线上', text: '不能见面的那一年，我们开始每周写一封共读信，寄给 300 多位读者。' },
  { year: '2022', title: '门前小院的旧书市集', text: '每月最后一个周六，把读过的书带来，换一本来路不明的故事。' },
  { year: '2024', title: '搬到现在的位置', text: '多了一间阅读室，也多了一只叫“年糕”的猫。它不负责营业，只负责睡觉。' },
  { year: '2026', title: '第七年，还在慢慢开', text: '书架从 3 面变成 9 面，常客从 7 位变成很多位。我们仍然不着急。' },
]

const team = [
  { name: '张阿纸', role: '店主 · 选书', initial: '纸', note: '前媒体编辑。选书靠直觉，回信很慢，但一定会回。' },
  { name: '林晚', role: '共读策划', initial: '晚', note: '负责把一本书拆成四次聊天。相信讨论比答案重要。' },
  { name: '小满', role: '咖啡 · 猫', initial: '满', note: '手冲做得比拉花好。年糕的监护人，也是书店的日常摄影师。' },
]

const faqs = [
  {
    question: '书可以借多久？需要押金吗？',
    answer: '免费借阅 30 天，不需要押金。如果还没读完，可以来店里续借一次；逾期也不会罚款，只希望你把书带回来，让下一位读者也能读到。',
  },
  {
    question: '不消费可以坐多久？',
    answer: '想坐多久都可以。窗边的三把椅子是留给任何人的，不点单也没关系。如果遇到满座，吧台边上还有两只矮凳。',
  },
  {
    question: '可以带自己的书来换吗？',
    answer: '当然。每月最后一个周六下午是旧书交换市集，带一本你读过的书来，可以在长桌上换走一本别人的。没有严格等价，合眼缘最重要。',
  },
  {
    question: '书店可以带宠物吗？',
    answer: '可以，牵好绳就好。年糕大部分时间在二楼睡觉，不太会下来社交。如果你的猫怕生，建议先在一楼坐坐。',
  },
  {
    question: '活动需要提前报名吗？',
    answer: '共读和工作坊因为座位有限，需要提前报名；市集和放映会直接来就好。报名可以在这页的活动区点“占个位”，也可以来店里说一声。',
  },
]

function signup(event) {
  toast.push(`「${event.title}」已为你留一个位置，活动前一天会再提醒你。`, {
    title: '报名成功',
    kind: 'success',
    duration: 4200,
  })
}
</script>

<template>
  <div class="about-page">
    <section class="about-hero">
      <div class="container about-hero__grid">
        <div class="about-hero__copy">
          <p class="eyebrow">ABOUT PAPER BETWEEN · 关于纸间</p>
          <h1 class="display">
            一家<br />
            不着急的<em>书店。</em>
          </h1>
          <p class="about-hero__intro">
            我们把书店开在一条不算热闹的街上，卖自己读过的书，办小规模的共读，
            替人写信，也替人保留一段可以什么都不做的时间。
          </p>
          <div class="about-hero__meta">
            <span><i aria-hidden="true" />2019 年开门</span>
            <span>42 m² 到 96 m²</span>
            <span>三只猫，一位常驻</span>
          </div>
        </div>

        <div class="about-hero__visual">
          <div class="storefront" aria-label="纸间书店门面插画">
            <div class="storefront__sign">
              <strong>纸间</strong>
              <span>PAPER BETWEEN</span>
            </div>
            <div class="storefront__awning" aria-hidden="true" />
            <div class="storefront__window">
              <span class="storefront__glow" aria-hidden="true" />
              <span class="storefront__shelf storefront__shelf--one" aria-hidden="true" />
              <span class="storefront__shelf storefront__shelf--two" aria-hidden="true" />
              <span class="storefront__cat" aria-hidden="true">
                <i />
                <i />
              </span>
              <span class="storefront__plant" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span class="storefront__open">OPEN</span>
            </div>
            <div class="storefront__door">
              <span class="storefront__handle" aria-hidden="true" />
              <span class="storefront__door-text">推门<br />进来</span>
            </div>
            <div class="storefront__step" aria-hidden="true" />
          </div>
          <p class="about-hero__caption">
            常胜西路 27 号 · 二楼有猫<br />
            <span>门口那盏灯，晚上九点才关。</span>
          </p>
        </div>
      </div>

      <div class="container">
        <div class="about-hero__stats">
          <StatBlock v-for="stat in stats" :key="stat.label" :value="stat.value" :suffix="stat.suffix" :label="stat.label" />
        </div>
      </div>
    </section>

    <section id="story" class="section story">
      <div class="container story__grid">
        <div class="story__copy">
          <p class="eyebrow">OUR STORY · 书店故事</p>
          <h2 class="display">从一张借书卡开始。</h2>
          <p>
            开店以前，张阿纸在一家报社做编辑。每天处理很多字，却越来越少有时间读完一本书。
            2018 年的冬天，她在旧货市场买下一张木质借书卡柜，突然想：不如开一家书店，
            让书和人都有地方慢慢待着。
          </p>
          <p>
            2019 年春天，纸间在常胜西路开门。最初的 42 平方米里，只有三面书架、一张旧木桌，
            和一台总是卡纸的打印机。我们没做开业活动，只在门口写了一行字：
            <em>“进来坐坐，不买也没关系。”</em>
          </p>
          <p>
            七年过去，书店长出了阅读室、旧书市集、共读计划，也长出了很多固定的面孔。
            有人在这里写完论文，有人在这里哭过，有人把第一次约会放在窗边第三把椅子。
            我们仍然不着急，因为一家书店真正的内容，从来不只是书。
          </p>
          <div class="story__sign">
            <span class="story__sign-line" aria-hidden="true" />
            <div>
              <strong>张阿纸</strong>
              <span>店主 · 2026 年秋</span>
            </div>
          </div>
        </div>

        <aside class="story__aside">
          <div class="story__quote">
            <span aria-hidden="true">“</span>
            <p>我们希望这家店像一张旧沙发：不精致，但坐下来会松一口气。</p>
            <small>— 写在收银台后面</small>
          </div>
          <div class="story__facts">
            <p class="eyebrow">SMALL FACTS</p>
            <dl>
              <div><dt>开门</dt><dd>周二至周日 10:00</dd></div>
              <div><dt>打烊</dt><dd>21:00（雨天可能早一点）</dd></div>
              <div><dt>藏书</dt><dd>约 1,280 本，仍在增加</dd></div>
              <div><dt>猫</dt><dd>年糕，橘白，不营业</dd></div>
            </dl>
          </div>
        </aside>
      </div>
    </section>

    <section class="values">
      <div class="container">
        <div class="values__head">
          <p class="eyebrow">WHAT WE BELIEVE · 我们相信</p>
          <h2 class="display">把小事，做得久一点。</h2>
        </div>
        <div class="values__grid">
          <article v-for="value in values" :key="value.number" class="value-card">
            <span class="value-card__number">{{ value.number }}</span>
            <h3>{{ value.title }}</h3>
            <p>{{ value.text }}</p>
            <span class="value-card__line" aria-hidden="true" />
          </article>
        </div>
      </div>
    </section>

    <section class="section timeline-section">
      <div class="container timeline-grid">
        <div class="timeline-intro">
          <p class="eyebrow">SEVEN YEARS · 七年</p>
          <h2 class="display">慢慢长成<br />现在的样子。</h2>
          <p>没有融资，没有扩张计划。只是把每一年过完，把每一本书放回它该在的位置。</p>
        </div>
        <div class="timeline">
          <article v-for="item in timeline" :key="item.year" class="timeline__item">
            <span class="timeline__year">{{ item.year }}</span>
            <span class="timeline__dot" aria-hidden="true" />
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section team-section">
      <div class="container">
        <SectionTitle
          eyebrow="THE PEOPLE · 店里的人"
          title="三个把日子过成书店的人"
          description="他们不总是站在柜台后面。有时在选书，有时在煮咖啡，有时只是和客人聊到忘记时间。"
        />
        <div class="team-grid">
          <article v-for="person in team" :key="person.name" class="team-card">
            <div class="team-card__avatar" aria-hidden="true">
              <span>{{ person.initial }}</span>
              <i />
            </div>
            <div class="team-card__body">
              <h3>{{ person.name }}</h3>
              <p class="team-card__role">{{ person.role }}</p>
              <p>{{ person.note }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="events" class="section events-section">
      <div class="container">
        <SectionTitle
          eyebrow="IN THE STORE · 书店日历"
          title="接下来，在纸间见面"
          description="不用预约的，直接来；需要报名的，点一下就好。所有活动都不收取费用。"
        />

        <div class="event-grid">
          <article v-for="(event, index) in events" :key="event.title" class="event-card">
            <div class="event-card__top">
              <span class="event-card__index">0{{ index + 1 }}</span>
              <BaseTag tone="clay">{{ event.tag }}</BaseTag>
            </div>
            <div class="event-card__date">
              <strong>{{ event.date }}</strong>
              <span>{{ event.weekday }} / 2026</span>
            </div>
            <h3>{{ event.title }}</h3>
            <p>{{ event.meta }}</p>
            <button type="button" class="event-card__signup" @click="signup(event)">
              占个位
              <span aria-hidden="true">→</span>
            </button>
          </article>
        </div>
      </div>
    </section>

    <section class="section faq-section">
      <div class="container faq-grid">
        <div class="faq-intro">
          <p class="eyebrow">BEFORE YOU COME · 来之前</p>
          <h2 class="display">一些你可能会<br />想问的事。</h2>
          <p>如果这里没有答案，欢迎直接来店里问，或者写一封信。</p>
          <BaseButton to="/about#contact" variant="ghost" size="small">写信给我们</BaseButton>
        </div>
        <FaqList :items="faqs" />
      </div>
    </section>

    <section id="contact" class="section contact-section">
      <div class="container contact-grid">
        <div class="contact-info">
          <p class="eyebrow">FIND US · 找到我们</p>
          <h2 class="display">来坐坐，<br />或者写封信。</h2>
          <p class="contact-info__intro">
            书店在一条种着梧桐的小街上。看到门口那盏写着“纸间”的灯，就到了。
          </p>

          <div class="map" aria-label="纸间书店位置示意图">
            <span class="map__road map__road--one" aria-hidden="true" />
            <span class="map__road map__road--two" aria-hidden="true" />
            <span class="map__river" aria-hidden="true" />
            <span class="map__block map__block--one" aria-hidden="true" />
            <span class="map__block map__block--two" aria-hidden="true" />
            <span class="map__block map__block--three" aria-hidden="true" />
            <span class="map__marker">
              <i />
              <span>纸间</span>
            </span>
            <span class="map__label map__label--one">常胜西路</span>
            <span class="map__label map__label--two">蒸水河</span>
            <span class="map__scale">200m</span>
          </div>

          <dl class="contact-list">
            <div>
              <dt>地址</dt>
              <dd>湖南省衡阳市蒸湘区常胜西路 27 号 2 楼</dd>
            </div>
            <div>
              <dt>邮件</dt>
              <dd><a href="mailto:hello@paperbetween.space">hello@paperbetween.space</a></dd>
            </div>
            <div>
              <dt>电话</dt>
              <dd>0734 · 888 2710</dd>
            </div>
            <div>
              <dt>到达</dt>
              <dd>公交 18 / 31 路“常胜西路”站，步行 3 分钟</dd>
            </div>
          </dl>
        </div>

        <div class="contact-form-wrap">
          <div class="contact-form-wrap__head">
            <div>
              <p class="eyebrow">WRITE TO US · 写信</p>
              <h3>告诉我们，你最近在读什么。</h3>
            </div>
            <span aria-hidden="true">✉</span>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>

    <section class="section newsletter-section">
      <div class="container">
        <NewsletterForm compact source="关于页" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-hero {
  position: relative;
  padding: 58px 0 0;
  background:
    radial-gradient(circle at 76% 24%, rgba(211, 163, 75, 0.18), transparent 33%),
    var(--paper-soft);
  border-bottom: 1px solid var(--line);
  overflow: hidden;
}

.about-hero::before {
  content: '';
  position: absolute;
  top: 0;
  right: 14%;
  width: 1px;
  height: 65%;
  background: linear-gradient(var(--line), transparent);
}

.about-hero__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.02fr 0.98fr;
  gap: 55px;
  align-items: center;
  min-height: 550px;
}

.about-hero__copy h1 {
  font-size: clamp(3.6rem, 6.2vw, 6rem);
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: -0.055em;
}

.about-hero__copy h1 em {
  color: var(--clay);
  font-style: italic;
}

.about-hero__intro {
  max-width: 510px;
  margin: 27px 0 0;
  color: var(--ink-soft);
  font-size: 13.5px;
  line-height: 2;
}

.about-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 19px;
  margin-top: 29px;
  padding-top: 17px;
  border-top: 1px solid var(--line);
  color: var(--ink-faint);
  font-size: 9.5px;
}

.about-hero__meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.about-hero__meta i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--forest-soft);
  box-shadow: 0 0 0 3px rgba(109, 132, 118, 0.14);
}

.about-hero__visual {
  position: relative;
  padding: 20px 10px 30px;
}

.storefront {
  position: relative;
  width: min(100%, 430px);
  height: 390px;
  margin-inline: auto;
  border: 1px solid var(--line-strong);
  border-radius: 6px 6px 2px 2px;
  background: var(--paper-deep);
  box-shadow: 18px 26px 60px rgba(49, 45, 34, 0.14);
}

.storefront__sign {
  position: absolute;
  top: -24px;
  left: 50%;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 132px;
  padding: 11px 8px 8px;
  border: 1px solid var(--line-strong);
  background: var(--forest-deep);
  color: var(--cream);
  transform: translateX(-50%);
}

.storefront__sign strong {
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 500;
  letter-spacing: 0.15em;
}

.storefront__sign span {
  font-family: var(--font-mono);
  font-size: 5.5px;
  letter-spacing: 0.15em;
  opacity: 0.6;
}

.storefront__awning {
  position: absolute;
  top: 20px;
  right: -9px;
  left: -9px;
  z-index: 2;
  height: 54px;
  background: repeating-linear-gradient(90deg, var(--clay) 0 34px, #f1e4ce 34px 68px);
  clip-path: polygon(0 0, 100% 0, 100% 80%, 95% 100%, 90% 80%, 85% 100%, 80% 80%, 75% 100%, 70% 80%, 65% 100%, 60% 80%, 55% 100%, 50% 80%, 45% 100%, 40% 80%, 35% 100%, 30% 80%, 25% 100%, 20% 80%, 15% 100%, 10% 80%, 5% 100%, 0 80%);
  filter: drop-shadow(0 7px 7px rgba(49, 45, 34, 0.12));
}

.storefront__window {
  position: absolute;
  top: 100px;
  left: 28px;
  width: 215px;
  height: 199px;
  border: 9px solid var(--forest-deep);
  background: linear-gradient(180deg, #ecd9b0, #cfa970);
  overflow: hidden;
}

.storefront__glow {
  position: absolute;
  top: 15%;
  left: 50%;
  width: 110%;
  height: 70%;
  border-radius: 50%;
  background: rgba(255, 241, 205, 0.6);
  transform: translateX(-50%);
  filter: blur(14px);
}

.storefront__shelf {
  position: absolute;
  right: 15px;
  left: 15px;
  height: 2px;
  background: rgba(61, 48, 30, 0.3);
}

.storefront__shelf--one {
  top: 38%;
}

.storefront__shelf--two {
  top: 62%;
}

.storefront__shelf::before {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 8%;
  width: 82%;
  height: 17px;
  background: repeating-linear-gradient(90deg, #44604f 0 7px, #c56b4a 7px 12px, #d8b05d 12px 17px, #30453b 17px 24px, transparent 24px 26px);
  opacity: 0.8;
}

.storefront__cat {
  position: absolute;
  right: 33px;
  bottom: 8px;
  width: 27px;
  height: 31px;
  border-radius: 46% 46% 30% 30%;
  background: #3a2a1f;
}

.storefront__cat i {
  position: absolute;
  top: -7px;
  width: 0;
  height: 0;
  border-right: 5px solid transparent;
  border-bottom: 9px solid #3a2a1f;
  border-left: 5px solid transparent;
}

.storefront__cat i:first-child {
  left: 2px;
}

.storefront__cat i:last-child {
  right: 2px;
}

.storefront__plant {
  position: absolute;
  bottom: 7px;
  left: 31px;
  width: 23px;
  height: 24px;
  border-radius: 0 0 4px 4px;
  background: #9f5c40;
}

.storefront__plant i {
  position: absolute;
  bottom: 19px;
  left: 0;
  width: 17px;
  height: 8px;
  border-radius: 100% 0 100% 0;
  background: #4c6a4d;
  transform-origin: bottom left;
}

.storefront__plant i:first-child {
  transform: rotate(-34deg);
}

.storefront__plant i:nth-child(2) {
  left: 7px;
  transform: rotate(12deg) scale(0.9);
}

.storefront__plant i:nth-child(3) {
  left: -5px;
  transform: rotate(-58deg) scale(0.7);
}

.storefront__open {
  position: absolute;
  top: 12px;
  right: 11px;
  padding: 3px 5px;
  border: 1px solid rgba(61, 48, 30, 0.45);
  color: #4b3b28;
  font-family: var(--font-mono);
  font-size: 5.5px;
  letter-spacing: 0.1em;
}

.storefront__door {
  position: absolute;
  right: 28px;
  bottom: 0;
  width: 100px;
  height: 199px;
  border: 9px solid var(--forest-deep);
  border-bottom: 0;
  background: linear-gradient(180deg, #d9bd8e, #b99362);
}

.storefront__handle {
  position: absolute;
  top: 52%;
  left: 12px;
  width: 4px;
  height: 18px;
  border-radius: 2px;
  background: #5c4228;
}

.storefront__door-text {
  position: absolute;
  top: 24%;
  right: 12px;
  color: rgba(61, 48, 30, 0.6);
  font-family: var(--font-display);
  font-size: 10px;
  line-height: 1.5;
  text-align: right;
}

.storefront__step {
  position: absolute;
  right: -12px;
  bottom: -9px;
  left: -12px;
  height: 10px;
  background: var(--paper-deep);
  border: 1px solid var(--line);
}

.about-hero__caption {
  margin: 19px auto 0;
  max-width: 430px;
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 8px;
  line-height: 1.8;
  text-align: right;
}

.about-hero__caption span {
  color: var(--ink-soft);
}

.about-hero__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  padding: 28px 0 30px;
  border-top: 1px solid var(--line);
}

.story__grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 85px;
  align-items: start;
}

.story__copy h2,
.faq-intro h2,
.contact-info h2,
.timeline-intro h2 {
  font-size: clamp(2.4rem, 4.4vw, 3.8rem);
  margin-bottom: 26px;
}

.story__copy > p {
  max-width: 620px;
  margin: 0 0 18px;
  color: var(--ink-soft);
  font-size: 13.5px;
  line-height: 2.05;
}

.story__copy > p em {
  color: var(--clay);
  font-family: var(--font-display);
  font-style: normal;
}

.story__sign {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 30px;
}

.story__sign-line {
  width: 40px;
  height: 1px;
  background: var(--line-strong);
}

.story__sign div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.story__sign strong {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 500;
}

.story__sign span {
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 7.5px;
}

.story__aside {
  display: grid;
  gap: 19px;
}

.story__quote {
  position: relative;
  padding: 30px 27px 25px;
  border-radius: var(--radius-md);
  background: var(--forest-deep);
  color: var(--cream);
}

.story__quote > span {
  position: absolute;
  top: 2px;
  right: 20px;
  color: var(--gold);
  font-family: var(--font-display);
  font-size: 66px;
  line-height: 1;
  opacity: 0.65;
}

.story__quote p {
  margin: 0;
  color: rgba(244, 237, 225, 0.9);
  font-family: var(--font-display);
  font-size: 18px;
  line-height: 1.8;
}

.story__quote small {
  display: block;
  margin-top: 19px;
  color: rgba(244, 237, 225, 0.42);
  font-family: var(--font-mono);
  font-size: 7.5px;
}

.story__facts {
  padding: 22px 24px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--paper-soft);
}

.story__facts .eyebrow {
  margin-bottom: 13px;
  font-size: 8px;
}

.story__facts dl {
  margin: 0;
}

.story__facts dl div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 17px;
  padding: 9px 0;
  border-bottom: 1px solid var(--line);
}

.story__facts dl div:last-child {
  border-bottom: 0;
}

.story__facts dt {
  color: var(--ink-faint);
  font-size: 9px;
}

.story__facts dd {
  margin: 0;
  font-size: 10px;
  text-align: right;
}

.values {
  padding: 86px 0 92px;
  background: var(--forest-deep);
  color: var(--cream);
}

.values :deep(.eyebrow) {
  color: var(--gold);
}

.values__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 45px;
}

.values__head h2 {
  font-size: clamp(2.4rem, 4.4vw, 3.6rem);
}

.values__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.value-card {
  position: relative;
  min-height: 235px;
  padding: 25px;
  border: 1px solid rgba(244, 237, 225, 0.16);
  border-radius: var(--radius-md);
  background: rgba(244, 237, 225, 0.035);
  overflow: hidden;
}

.value-card__number {
  color: var(--gold);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.1em;
}

.value-card h3 {
  margin: 29px 0 11px;
  font-family: var(--font-display);
  font-size: 25px;
  font-weight: 500;
}

.value-card p {
  max-width: 290px;
  margin: 0;
  color: rgba(244, 237, 225, 0.58);
  font-size: 11.5px;
  line-height: 1.85;
}

.value-card__line {
  position: absolute;
  right: 25px;
  bottom: 24px;
  left: 25px;
  height: 1px;
  background: rgba(244, 237, 225, 0.12);
}

.timeline-grid {
  display: grid;
  grid-template-columns: 0.65fr 1.35fr;
  gap: 80px;
}

.timeline-intro p:last-child {
  max-width: 290px;
  margin: 22px 0 0;
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1.9;
}

.timeline {
  position: relative;
  padding-left: 26px;
  border-left: 1px solid var(--line-strong);
}

.timeline__item {
  position: relative;
  display: grid;
  grid-template-columns: 62px 1fr;
  gap: 24px;
  padding: 0 0 34px;
}

.timeline__item:last-child {
  padding-bottom: 0;
}

.timeline__year {
  color: var(--clay);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.timeline__dot {
  position: absolute;
  top: 6px;
  left: -31px;
  width: 9px;
  height: 9px;
  border: 2px solid var(--paper);
  border-radius: 50%;
  background: var(--clay);
  box-shadow: 0 0 0 1px var(--clay);
}

.timeline__item h3 {
  margin: 0 0 6px;
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 500;
}

.timeline__item p {
  max-width: 560px;
  margin: 0;
  color: var(--ink-soft);
  font-size: 11.5px;
  line-height: 1.9;
}

.team-section {
  padding-top: 0;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.team-card {
  display: flex;
  gap: 17px;
  padding: 23px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--paper-soft);
}

.team-card__avatar {
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 78px;
  border-radius: 50% 50% 46% 46%;
  background: linear-gradient(160deg, var(--forest), var(--forest-deep));
  color: var(--cream);
  overflow: hidden;
}

.team-card:nth-child(2) .team-card__avatar {
  background: linear-gradient(160deg, var(--clay), #7f3c2a);
}

.team-card:nth-child(3) .team-card__avatar {
  background: linear-gradient(160deg, var(--gold), #a4772b);
  color: var(--forest-deep);
}

.team-card__avatar span {
  position: relative;
  z-index: 1;
  font-family: var(--font-display);
  font-size: 26px;
}

.team-card__avatar i {
  position: absolute;
  right: -11px;
  bottom: -14px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
}

.team-card__body h3 {
  margin: 4px 0 1px;
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 500;
}

.team-card__role {
  margin: 0 0 11px !important;
  color: var(--clay) !important;
  font-family: var(--font-mono);
  font-size: 8px !important;
  letter-spacing: 0.06em;
}

.team-card__body > p {
  margin: 0;
  color: var(--ink-soft);
  font-size: 10.5px;
  line-height: 1.8;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.event-card {
  display: flex;
  flex-direction: column;
  min-height: 305px;
  padding: 25px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--paper-soft);
  transition:
    transform 0.3s var(--ease-out),
    box-shadow 0.3s var(--ease-soft);
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-sm);
}

.event-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.event-card__index {
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 8px;
}

.event-card__date {
  display: flex;
  align-items: baseline;
  gap: 9px;
  margin: 26px 0 14px;
}

.event-card__date strong {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 500;
  line-height: 1;
}

.event-card__date span {
  color: var(--clay);
  font-family: var(--font-mono);
  font-size: 7.5px;
  letter-spacing: 0.06em;
}

.event-card h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 500;
  line-height: 1.5;
}

.event-card > p {
  margin: 9px 0 20px;
  color: var(--ink-faint);
  font-size: 10px;
  line-height: 1.7;
}

.event-card__signup {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid var(--line);
  color: var(--clay);
  font-size: 10.5px;
  font-weight: 600;
}

.event-card__signup span {
  transition: transform 0.2s var(--ease-out);
}

.event-card__signup:hover span {
  transform: translateX(3px);
}

.faq-section {
  border-top: 1px solid var(--line);
  background: var(--paper-soft);
}

.faq-grid {
  display: grid;
  grid-template-columns: 0.55fr 1.45fr;
  gap: 75px;
  align-items: start;
}

.faq-intro p {
  max-width: 300px;
  margin: 0 0 22px;
  color: var(--ink-soft);
  font-size: 11.5px;
  line-height: 1.9;
}

.contact-section {
  padding-bottom: 80px;
}

.contact-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 70px;
  align-items: start;
}

.contact-info__intro {
  max-width: 410px;
  margin: 0 0 25px;
  color: var(--ink-soft);
  font-size: 12.5px;
  line-height: 1.9;
}

.map {
  position: relative;
  height: 230px;
  border: 1px solid var(--line);
  background:
    linear-gradient(90deg, transparent 49.5%, rgba(32, 51, 42, 0.04) 50%, transparent 50.5%),
    linear-gradient(transparent 49.5%, rgba(32, 51, 42, 0.04) 50%, transparent 50.5%),
    var(--paper-soft);
  background-size: 34px 34px;
  overflow: hidden;
}

.map__road {
  position: absolute;
  background: var(--paper-deep);
}

.map__road--one {
  top: 54%;
  right: -5%;
  left: -5%;
  height: 18px;
  transform: rotate(-7deg);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.map__road--two {
  top: -10%;
  bottom: -10%;
  left: 34%;
  width: 12px;
  transform: rotate(14deg);
  border-right: 1px solid var(--line);
  border-left: 1px solid var(--line);
}

.map__river {
  position: absolute;
  top: -20%;
  right: -12%;
  width: 52%;
  height: 150%;
  border-radius: 50%;
  background: rgba(109, 132, 118, 0.15);
  transform: rotate(-16deg);
}

.map__block {
  position: absolute;
  border: 1px solid var(--line);
  background: rgba(232, 221, 203, 0.5);
}

.map__block--one {
  top: 16%;
  left: 10%;
  width: 17%;
  height: 24%;
}

.map__block--two {
  bottom: 10%;
  left: 45%;
  width: 22%;
  height: 18%;
}

.map__block--three {
  top: 18%;
  right: 13%;
  width: 15%;
  height: 20%;
}

.map__marker {
  position: absolute;
  top: 44%;
  left: 44%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.map__marker i {
  display: block;
  width: 17px;
  height: 17px;
  border: 3px solid var(--cream);
  border-radius: 50% 50% 50% 0;
  background: var(--clay);
  box-shadow: 0 0 0 1px var(--clay), 0 5px 14px rgba(163, 79, 53, 0.3);
  transform: rotate(-45deg);
}

.map__marker span {
  padding: 2px 5px;
  background: var(--forest-deep);
  color: var(--cream);
  font-family: var(--font-display);
  font-size: 8px;
  letter-spacing: 0.1em;
}

.map__label {
  position: absolute;
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 6.5px;
  letter-spacing: 0.08em;
}

.map__label--one {
  top: 65%;
  left: 16%;
  transform: rotate(-7deg);
}

.map__label--two {
  top: 31%;
  right: 11%;
  color: var(--forest-soft);
}

.map__scale {
  position: absolute;
  right: 9px;
  bottom: 8px;
  padding-top: 3px;
  border-top: 1px solid var(--ink-faint);
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 5.5px;
}

.contact-list {
  margin: 24px 0 0;
}

.contact-list div {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 14px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
}

.contact-list dt {
  color: var(--ink-faint);
  font-size: 9px;
}

.contact-list dd {
  margin: 0;
  color: var(--ink-soft);
  font-size: 10.5px;
  line-height: 1.7;
}

.contact-list a:hover {
  color: var(--clay);
}

.contact-form-wrap {
  padding: 33px 34px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--paper-soft);
  box-shadow: var(--shadow-sm);
}

.contact-form-wrap__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 26px;
  padding-bottom: 19px;
  border-bottom: 1px solid var(--line);
}

.contact-form-wrap__head .eyebrow {
  margin-bottom: 8px;
  font-size: 8px;
}

.contact-form-wrap__head h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 25px;
  font-weight: 500;
}

.contact-form-wrap__head > span {
  color: var(--gold);
  font-size: 27px;
  line-height: 1;
}

.newsletter-section {
  padding-top: 0;
}

@media (max-width: 1050px) {
  .about-hero__grid {
    gap: 25px;
  }

  .storefront {
    transform: scale(0.92);
    transform-origin: center;
  }

  .story__grid {
    gap: 45px;
  }

  .timeline-grid {
    gap: 45px;
  }

  .team-grid {
    grid-template-columns: 1fr;
  }

  .contact-grid {
    gap: 40px;
  }
}

@media (max-width: 900px) {
  .about-hero {
    padding-top: 38px;
  }

  .about-hero__grid {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .about-hero__visual {
    margin-top: 20px;
  }

  .about-hero__stats {
    margin-top: 25px;
  }

  .story__grid,
  .timeline-grid,
  .faq-grid,
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .story__aside {
    grid-template-columns: 1fr 1fr;
  }

  .values__grid,
  .event-grid {
    grid-template-columns: 1fr;
  }

  .values__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 0;
  }

  .value-card {
    min-height: 190px;
  }

  .event-card {
    min-height: 0;
  }

  .faq-intro p {
    max-width: 460px;
  }
}

@media (max-width: 620px) {
  .about-hero__copy h1 {
    font-size: 3.15rem;
  }

  .about-hero__stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 22px;
  }

  .storefront {
    height: 330px;
    transform: scale(0.9);
    margin-top: -15px;
  }

  .storefront__window {
    width: 190px;
    height: 170px;
  }

  .storefront__door {
    width: 82px;
    height: 170px;
  }

  .about-hero__caption {
    margin-top: 5px;
  }

  .story__aside {
    grid-template-columns: 1fr;
  }

  .story__copy h2,
  .faq-intro h2,
  .contact-info h2,
  .timeline-intro h2 {
    font-size: 2.45rem;
  }

  .timeline__item {
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .timeline {
    padding-left: 20px;
  }

  .timeline__dot {
    left: -25px;
  }

  .contact-form-wrap {
    padding: 24px 20px;
  }

  .contact-form-wrap__head h3 {
    font-size: 21px;
  }

  .map {
    height: 200px;
  }
}
</style>

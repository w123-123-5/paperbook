<script setup>
const year = new Date().getFullYear()

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="site-footer">
    <div v-once class="site-footer__watermark" aria-hidden="true">纸间</div>
    <div class="container site-footer__inner">
      <div class="site-footer__lead">
        <p class="eyebrow">PAPER BETWEEN · SINCE 2019</p>
        <h2 class="display">把日子，<br />读慢一点。</h2>
        <p class="site-footer__intro">
          一家不着急的独立书店。我们选书、办共读、替人写信，也留一张靠窗的椅子给路过的你。
        </p>
      </div>

      <div class="site-footer__columns">
        <div class="footer-col">
          <h3>营业时间</h3>
          <p>周二至周日<br />10:00 — 21:00</p>
          <p class="muted">周一闭店，整理书架。</p>
        </div>
        <div class="footer-col">
          <h3>在纸间</h3>
          <RouterLink to="/shelf">在架书目</RouterLink>
          <RouterLink to="/about#story">书店故事</RouterLink>
          <RouterLink to="/about#events">活动日历</RouterLink>
          <RouterLink to="/about#contact">联系我们</RouterLink>
        </div>
        <div class="footer-col">
          <h3>找到我们</h3>
          <p>湖南省衡阳市<br />常胜西路 27 号</p>
          <a href="mailto:hello@paperbetween.space">hello@paperbetween.space</a>
          <p class="footer-col__social">小红书 / 豆瓣 / 即刻</p>
        </div>
      </div>

      <div class="site-footer__bottom">
        <span>© {{ year }} 纸间书店 · 本站为 Vue 课程练习作品</span>
        <span class="site-footer__tech">Vue 3 · Vite · Vue Router</span>
        <button type="button" class="site-footer__top" @click="toTop">
          回到顶部
          <span aria-hidden="true">↑</span>
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  overflow: hidden;
  margin-top: 40px;
  background: var(--forest-deep);
  color: #f2ead9;
}

:root[data-theme='night'] .site-footer {
  background: #0f1713;
}

.site-footer__watermark {
  position: absolute;
  right: -2vw;
  bottom: -8vw;
  color: rgba(244, 237, 225, 0.035);
  font-family: var(--font-display);
  font-size: 32vw;
  font-weight: 700;
  line-height: 0.8;
  letter-spacing: -0.08em;
  pointer-events: none;
  user-select: none;
}

.site-footer__inner {
  position: relative;
  z-index: 1;
  padding-top: 86px;
  padding-bottom: 28px;
}

.site-footer__lead {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: end;
  gap: 48px;
  padding-bottom: 56px;
  border-bottom: 1px solid rgba(244, 237, 225, 0.16);
}

.site-footer__lead .eyebrow {
  color: #d5a64a;
}

.site-footer__lead h2 {
  font-size: clamp(2.8rem, 6vw, 5.4rem);
  font-weight: 500;
  letter-spacing: -0.04em;
}

.site-footer__intro {
  max-width: 370px;
  margin: 0 0 6px auto;
  color: rgba(244, 237, 225, 0.66);
  font-size: 13px;
  line-height: 1.95;
}

.site-footer__columns {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 48px;
  padding: 50px 0 64px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 9px;
  color: rgba(244, 237, 225, 0.7);
  font-size: 12.5px;
  line-height: 1.8;
}

.footer-col h3 {
  margin: 0 0 10px;
  color: rgba(244, 237, 225, 0.4);
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.footer-col p {
  margin: 0;
}

.footer-col a {
  position: relative;
  transition: color 0.2s var(--ease-soft);
}

.footer-col a:hover {
  color: #fffaf0;
}

.footer-col a::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -2px;
  left: 0;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s var(--ease-out);
}

.footer-col a:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.footer-col .muted {
  color: rgba(244, 237, 225, 0.4);
  font-size: 11px;
}

.footer-col__social {
  margin-top: 3px;
  color: rgba(244, 237, 225, 0.4);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.08em;
}

.site-footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(244, 237, 225, 0.12);
  color: rgba(244, 237, 225, 0.4);
  font-size: 10px;
}

.site-footer__tech {
  font-family: var(--font-mono);
  letter-spacing: 0.06em;
}

.site-footer__top {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: rgba(244, 237, 225, 0.7);
  font-size: 10.5px;
  transition: color 0.2s var(--ease-soft);
}

.site-footer__top:hover {
  color: #fffaf0;
}

.site-footer__top span {
  font-size: 14px;
  transition: transform 0.2s var(--ease-out);
}

.site-footer__top:hover span {
  transform: translateY(-2px);
}

@media (max-width: 860px) {
  .site-footer__lead {
    grid-template-columns: 1fr;
    gap: 20px;
    padding-bottom: 40px;
  }

  .site-footer__intro {
    margin-left: 0;
  }

  .site-footer__columns {
    grid-template-columns: 1fr 1fr;
    gap: 34px;
    padding: 40px 0 50px;
  }

  .site-footer__bottom {
    flex-wrap: wrap;
  }

  .site-footer__tech {
    order: 3;
    flex-basis: 100%;
  }
}

@media (max-width: 560px) {
  .site-footer__inner {
    padding-top: 60px;
  }

  .site-footer__columns {
    grid-template-columns: 1fr;
  }

  .site-footer__bottom {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }
}
</style>

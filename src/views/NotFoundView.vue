<script setup>
import BaseButton from '../components/BaseButton.vue'
</script>

<template>
  <section class="not-found">
    <div class="container not-found__inner">
      <p class="eyebrow">404 · PAGE NOT FOUND</p>
      <div class="not-found__number" aria-hidden="true">
        <span>4</span>
        <span class="not-found__zero">0</span>
        <span>4</span>
      </div>
      <h1 class="display">这一页，还没有被写下。</h1>
      <p>也许它被夹进了某本书里，也许只是走错了书架。回到有字的地方吧。</p>
      <div class="not-found__actions">
        <BaseButton to="/" variant="primary">回到首页</BaseButton>
        <BaseButton to="/shelf" variant="ghost">去书架看看</BaseButton>
      </div>
      <p class="not-found__note">纸间书店 · 每一本都有它的位置</p>
    </div>
  </section>
</template>

<style scoped>
.not-found {
  min-height: calc(100vh - var(--header-h));
  display: flex;
  align-items: center;
  background:
    radial-gradient(circle at 50% 30%, rgba(211, 163, 75, 0.14), transparent 40%),
    var(--paper);
  overflow: hidden;
}

.not-found__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 0;
  text-align: center;
}

.not-found__number {
  display: flex;
  align-items: center;
  gap: 3vw;
  margin: 10px 0 28px;
  color: var(--forest);
  font-family: var(--font-display);
  font-size: clamp(7rem, 19vw, 15rem);
  font-weight: 600;
  line-height: 0.85;
  letter-spacing: -0.08em;
}

.not-found__zero {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.86em;
  height: 1.02em;
  border: 0.065em solid var(--clay);
  border-radius: 50%;
  color: transparent;
  transform: rotate(8deg);
}

.not-found__zero::after {
  content: '';
  position: absolute;
  right: 22%;
  bottom: 12%;
  left: 22%;
  height: 0.05em;
  background: var(--gold);
  transform: rotate(-18deg);
}

.not-found h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.35rem);
  font-weight: 500;
}

.not-found p {
  max-width: 470px;
  margin: 17px 0 0;
  color: var(--ink-soft);
  font-size: 12.5px;
  line-height: 1.9;
}

.not-found__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 28px;
}

.not-found__note {
  margin-top: 60px !important;
  color: var(--ink-faint) !important;
  font-family: var(--font-mono);
  font-size: 8px !important;
  letter-spacing: 0.1em;
}
</style>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  book: { type: Object, required: true },
  size: { type: String, default: 'md' },
})

const titleSize = computed(() => {
  const length = [...props.book.title].length
  if (length <= 2) return 23
  if (length <= 4) return 18.5
  if (length <= 6) return 14.5
  if (length <= 8) return 12
  return 10.2
})

const style = computed(() => ({
  '--cover-bg': props.book.palette.bg,
  '--cover-ink': props.book.palette.ink,
  '--cover-accent': props.book.palette.accent,
  '--title-size': `${titleSize.value}cqw`,
}))
</script>

<template>
  <div
    class="cover"
    :class="[`cover--${size}`, `cover--${book.motif}`]"
    :style="style"
    role="img"
    :aria-label="`${book.title} 封面`"
  >
    <span class="cover__spine" aria-hidden="true" />
    <span class="cover__art" aria-hidden="true">
      <i class="art-shape art-shape--one" />
      <i class="art-shape art-shape--two" />
      <i class="art-shape art-shape--three" />
    </span>

    <div class="cover__top">
      <span>{{ book.category }}</span>
      <span>{{ book.year }}</span>
    </div>

    <div class="cover__title-wrap">
      <h3 class="cover__title">{{ book.title }}</h3>
      <p class="cover__subtitle">{{ book.subtitle }}</p>
    </div>

    <div class="cover__bottom">
      <span class="cover__author">{{ book.author }}</span>
      <span class="cover__mark">纸间</span>
    </div>

    <span class="cover__edge" aria-hidden="true" />
  </div>
</template>

<style scoped>
.cover {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  isolation: isolate;
  container-type: inline-size;
  border-radius: 3px 7px 7px 3px;
  background: var(--cover-bg);
  color: var(--cover-ink);
  box-shadow:
    0 22px 46px rgba(31, 43, 35, 0.2),
    0 3px 0 rgba(255, 255, 255, 0.16) inset;
  transform: translateZ(0);
}

.cover::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  opacity: 0.18;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='.28'/%3E%3C/svg%3E");
  mix-blend-mode: soft-light;
}

.cover__spine {
  position: absolute;
  inset: 0 auto 0 0;
  z-index: 5;
  width: 7%;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.26), rgba(255, 255, 255, 0.06) 60%, transparent);
  box-shadow: 1px 0 0 rgba(255, 255, 255, 0.12) inset;
}

.cover__edge {
  position: absolute;
  inset: 0 0 0 auto;
  z-index: 5;
  width: 2.4%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.14) 55%, rgba(0, 0, 0, 0.12));
}

.cover__top {
  position: absolute;
  top: 6.5%;
  left: 13%;
  right: 8%;
  z-index: 3;
  display: flex;
  justify-content: space-between;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 3.1cqw;
  letter-spacing: 0.12em;
  line-height: 1.4;
  opacity: 0.76;
}

.cover__title-wrap {
  position: absolute;
  top: 22%;
  left: 13%;
  right: 8%;
  z-index: 3;
}

.cover__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--title-size, 18.5cqw);
  font-weight: 600;
  line-height: 1.03;
  letter-spacing: -0.07em;
  text-wrap: balance;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.08);
}

.cover__subtitle {
  max-width: 85%;
  margin: 3.3cqw 0 0;
  font-size: 3.9cqw;
  font-weight: 400;
  line-height: 1.55;
  letter-spacing: 0.05em;
  opacity: 0.74;
}

.cover__bottom {
  position: absolute;
  left: 13%;
  right: 8%;
  bottom: 6.5%;
  z-index: 3;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  font-size: 3.3cqw;
  letter-spacing: 0.08em;
}

.cover__author {
  max-width: 72%;
  line-height: 1.45;
  opacity: 0.8;
}

.cover__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 8.4cqw;
  height: 8.4cqw;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-family: var(--font-display);
  font-size: 2.5cqw;
  letter-spacing: 0;
  opacity: 0.76;
}

.cover__art {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.art-shape {
  position: absolute;
  display: block;
}

/* 太阳 */
.cover--sun .art-shape--one {
  top: 10%;
  right: -14%;
  width: 58%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--cover-accent);
  opacity: 0.86;
}

.cover--sun .art-shape--two {
  right: -20%;
  bottom: 18%;
  width: 70%;
  height: 1px;
  background: currentColor;
  opacity: 0.35;
  box-shadow:
    0 10px 0 currentColor,
    0 20px 0 currentColor,
    0 30px 0 currentColor,
    0 40px 0 currentColor;
}

.cover--sun .art-shape--three {
  top: 0;
  right: 38%;
  width: 1px;
  height: 40%;
  background: linear-gradient(transparent, currentColor);
  opacity: 0.28;
}

/* 邮票 */
.cover--stamp .art-shape--one {
  top: 19%;
  right: 8%;
  width: 29%;
  aspect-ratio: 4 / 5;
  border: 2px dashed var(--cover-accent);
  background: rgba(255, 255, 255, 0.05);
  transform: rotate(6deg);
  opacity: 0.92;
}

.cover--stamp .art-shape--two {
  top: 27%;
  right: 15%;
  width: 16%;
  aspect-ratio: 1;
  border: 1px solid var(--cover-accent);
  border-radius: 50%;
  opacity: 0.8;
}

.cover--stamp .art-shape--three {
  inset: auto -8% 8% auto;
  width: 62%;
  height: 36%;
  border-radius: 50%;
  border: 1px solid currentColor;
  opacity: 0.2;
}

/* 迷宫 */
.cover--maze .art-shape--one {
  top: 17%;
  right: -9%;
  width: 54%;
  aspect-ratio: 1;
  border: 1px solid var(--cover-accent);
  box-shadow:
    0 0 0 12px var(--cover-bg),
    0 0 0 13px var(--cover-accent),
    0 0 0 25px var(--cover-bg),
    0 0 0 26px var(--cover-accent);
  transform: rotate(9deg);
  opacity: 0.65;
}

.cover--maze .art-shape--two {
  bottom: 12%;
  left: 13%;
  width: 34%;
  height: 20%;
  background-image:
    linear-gradient(var(--cover-accent) 1px, transparent 1px),
    linear-gradient(90deg, var(--cover-accent) 1px, transparent 1px);
  background-size: 11px 11px;
  opacity: 0.24;
}

.cover--maze .art-shape--three {
  top: 12%;
  left: 13%;
  width: 7px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--cover-accent);
}

/* 拱门 */
.cover--arch .art-shape--one {
  right: 9%;
  bottom: 11%;
  width: 55%;
  height: 50%;
  border: 1px solid var(--cover-accent);
  border-bottom: 0;
  border-radius: 50% 50% 0 0;
  opacity: 0.8;
}

.cover--arch .art-shape--two {
  right: 19%;
  bottom: 11%;
  width: 35%;
  height: 35%;
  border-radius: 50% 50% 0 0;
  background: var(--cover-accent);
  opacity: 0.38;
}

.cover--arch .art-shape--three {
  left: 13%;
  bottom: 20%;
  width: 52%;
  height: 1px;
  background: currentColor;
  opacity: 0.28;
  box-shadow:
    0 9px 0 currentColor,
    0 18px 0 currentColor;
}

/* 波浪 */
.cover--wave .art-shape--one {
  right: -30%;
  bottom: 16%;
  width: 110%;
  aspect-ratio: 1;
  border: 1px solid var(--cover-accent);
  border-radius: 45% 55% 50% 50%;
  opacity: 0.56;
  transform: rotate(-10deg);
  box-shadow:
    0 0 0 14px var(--cover-bg),
    0 0 0 15px var(--cover-accent),
    0 0 0 29px var(--cover-bg),
    0 0 0 30px var(--cover-accent),
    0 0 0 44px var(--cover-bg),
    0 0 0 45px var(--cover-accent);
}

.cover--wave .art-shape--two {
  top: 17%;
  left: 13%;
  width: 10%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--cover-accent);
  opacity: 0.8;
}

.cover--wave .art-shape--three {
  top: 26%;
  left: 13%;
  width: 34%;
  height: 22%;
  background-image: radial-gradient(var(--cover-accent) 1px, transparent 1.4px);
  background-size: 10px 10px;
  opacity: 0.32;
}

/* 星 */
.cover--star .art-shape--one {
  top: 11%;
  right: 12%;
  width: 8%;
  aspect-ratio: 1;
  background: var(--cover-accent);
  clip-path: polygon(50% 0, 61% 36%, 100% 50%, 61% 64%, 50% 100%, 39% 64%, 0 50%, 39% 36%);
}

.cover--star .art-shape--two {
  top: 17%;
  right: 30%;
  width: 3.5%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--cover-accent);
  box-shadow:
    -70px 42px 0 -1px var(--cover-accent),
    -25px 85px 0 -1px var(--cover-accent),
    -95px 130px 0 -1px var(--cover-accent),
    -42px 170px 0 -1px var(--cover-accent);
  opacity: 0.9;
}

.cover--star .art-shape--three {
  left: 13%;
  bottom: 17%;
  width: 62%;
  height: 1px;
  background: currentColor;
  opacity: 0.2;
  box-shadow:
    0 8px 0 currentColor,
    0 16px 0 currentColor;
}

/* 叶片 */
.cover--leaf .art-shape--one {
  top: 16%;
  right: -7%;
  width: 55%;
  height: 44%;
  border: 1px solid var(--cover-accent);
  border-radius: 100% 0 100% 0;
  transform: rotate(-18deg);
  opacity: 0.75;
}

.cover--leaf .art-shape--two {
  top: 21%;
  right: 4%;
  width: 39%;
  height: 31%;
  background: var(--cover-accent);
  border-radius: 100% 0 100% 0;
  transform: rotate(-18deg);
  opacity: 0.26;
}

.cover--leaf .art-shape--three {
  left: 13%;
  bottom: 18%;
  width: 1px;
  height: 27%;
  background: currentColor;
  opacity: 0.3;
  transform: rotate(24deg);
  transform-origin: bottom;
}

/* 山 */
.cover--mountain .art-shape--one {
  right: -12%;
  bottom: 8%;
  width: 85%;
  height: 42%;
  background: var(--cover-accent);
  clip-path: polygon(0 100%, 24% 36%, 42% 70%, 62% 0, 100% 100%);
  opacity: 0.38;
}

.cover--mountain .art-shape--two {
  right: 2%;
  bottom: 8%;
  width: 56%;
  height: 26%;
  background: var(--cover-bg);
  clip-path: polygon(0 100%, 32% 22%, 52% 64%, 72% 12%, 100% 100%);
  opacity: 0.92;
}

.cover--mountain .art-shape--three {
  left: 13%;
  top: 16%;
  width: 9%;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 1px solid var(--cover-accent);
  opacity: 0.8;
}

/* 光球 */
.cover--orb .art-shape--one {
  top: 13%;
  right: -2%;
  width: 56%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle at 32% 30%, var(--cover-ink), var(--cover-accent) 45%, transparent 70%);
  opacity: 0.76;
  filter: blur(0.2px);
}

.cover--orb .art-shape--two {
  top: 20%;
  right: 12%;
  width: 33%;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 1px solid var(--cover-ink);
  opacity: 0.42;
}

.cover--orb .art-shape--three {
  left: 13%;
  bottom: 18%;
  width: 50%;
  height: 1px;
  background: currentColor;
  opacity: 0.26;
  box-shadow:
    0 9px 0 currentColor,
    0 18px 0 currentColor,
    0 27px 0 currentColor;
}

/* 窗 */
.cover--window .art-shape--one {
  top: 17%;
  right: 8%;
  width: 44%;
  height: 38%;
  border: 1px solid var(--cover-accent);
  background-image:
    linear-gradient(var(--cover-accent) 1px, transparent 1px),
    linear-gradient(90deg, var(--cover-accent) 1px, transparent 1px);
  background-size: 50% 50%;
  opacity: 0.58;
  transform: rotate(3deg);
}

.cover--window .art-shape--two {
  top: 17%;
  right: 8%;
  width: 44%;
  height: 38%;
  border: 1px solid var(--cover-accent);
  transform: rotate(3deg);
  box-shadow: 9px 9px 0 rgba(0, 0, 0, 0.06);
}

.cover--window .art-shape--three {
  left: 13%;
  bottom: 15%;
  width: 56%;
  height: 18%;
  background: linear-gradient(135deg, transparent 46%, currentColor 47%, currentColor 48%, transparent 49%);
  opacity: 0.25;
}

/* 湖 */
.cover--lake .art-shape--one {
  left: 8%;
  right: 8%;
  bottom: 10%;
  height: 38%;
  border-radius: 50%;
  background: var(--cover-accent);
  opacity: 0.24;
  filter: blur(2px);
}

.cover--lake .art-shape--two {
  left: 13%;
  right: 8%;
  bottom: 20%;
  height: 1px;
  background: var(--cover-accent);
  opacity: 0.7;
  box-shadow:
    0 8px 0 var(--cover-accent),
    0 16px 0 var(--cover-accent),
    0 24px 0 var(--cover-accent),
    0 32px 0 var(--cover-accent);
}

.cover--lake .art-shape--three {
  top: 13%;
  right: 12%;
  width: 13%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--cover-accent);
  opacity: 0.8;
}

/* 网格 */
.cover--grid .art-shape--one {
  inset: 15% 8% 22% 13%;
  background-image:
    linear-gradient(var(--cover-accent) 1px, transparent 1px),
    linear-gradient(90deg, var(--cover-accent) 1px, transparent 1px);
  background-size: 18% 14%;
  opacity: 0.22;
}

.cover--grid .art-shape--two {
  top: 22%;
  right: 9%;
  width: 25%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--cover-accent);
  opacity: 0.74;
}

.cover--grid .art-shape--three {
  left: 13%;
  bottom: 15%;
  width: 31%;
  height: 4px;
  background: currentColor;
  opacity: 0.5;
  box-shadow:
    0 7px 0 currentColor,
    0 14px 0 currentColor;
}

.cover--lg {
  border-radius: 5px 12px 12px 5px;
  box-shadow:
    0 42px 80px rgba(31, 43, 35, 0.26),
    0 4px 0 rgba(255, 255, 255, 0.14) inset;
}

.cover--sm {
  border-radius: 2px 5px 5px 2px;
  box-shadow: 0 10px 24px rgba(31, 43, 35, 0.18);
}
</style>

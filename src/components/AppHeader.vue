<script setup>
import { inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const shelf = inject('shelf')
const theme = inject('theme')

const scrolled = ref(false)
const menuOpen = ref(false)

const links = [
  { to: '/', label: '首页', en: 'Home', index: '01' },
  { to: '/shelf', label: '书架', en: 'Shelf', index: '02' },
  { to: '/about', label: '关于', en: 'About', index: '03' },
]

function onScroll() {
  scrolled.value = window.scrollY > 18
}

function closeMenu() {
  menuOpen.value = false
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

watch(menuOpen, (open) => {
  document.body.classList.toggle('no-scroll', open)
})

watch(
  () => route.fullPath,
  () => closeMenu(),
)

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.body.classList.remove('no-scroll')
})
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <div class="container site-header__inner">
      <RouterLink to="/" class="brand" aria-label="纸间书店首页">
        <span class="brand__mark">
          <svg viewBox="0 0 42 42" fill="none" aria-hidden="true">
            <path
              d="M7 11.5c5.3-2.2 9.8-1.5 13.5 1.6v20.2c-3.7-3.1-8.2-3.8-13.5-1.6V11.5Z"
              fill="currentColor"
            />
            <path
              d="M35 11.5c-5.3-2.2-9.8-1.5-13.5 1.6v20.2c3.7-3.1 8.2-3.8 13.5-1.6V11.5Z"
              fill="currentColor"
              opacity=".55"
            />
            <path d="M21.5 13.8v19.4" stroke="var(--paper)" stroke-width="1.4" />
            <path d="M11 18.5c2.4-.7 4.5-.4 6 .7M11 23.5c2.4-.7 4.5-.4 6 .7M31 18.5c-2.4-.7-4.5-.4-6 .7" stroke="var(--paper)" stroke-width="1" stroke-linecap="round" opacity=".55" />
          </svg>
        </span>
        <span class="brand__text">
          <strong>纸间</strong>
          <small>PAPER BETWEEN</small>
        </span>
      </RouterLink>

      <nav class="desktop-nav" aria-label="主导航">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="desktop-nav__link"
          active-class="is-active"
        >
          <span class="desktop-nav__index">{{ link.index }}</span>
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="header-actions">
        <RouterLink to="/shelf?focus=1" class="header-action header-action--search" aria-label="搜索书目">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
            <circle cx="10.7" cy="10.7" r="6.2" />
            <path d="m15.6 15.6 4.3 4.3" stroke-linecap="round" />
          </svg>
        </RouterLink>

        <button
          type="button"
          class="header-action"
          :aria-label="theme.theme.value === 'day' ? '切换到夜读模式' : '切换到日间模式'"
          :title="theme.theme.value === 'day' ? '夜读模式' : '日间模式'"
          @click="theme.toggle"
        >
          <Transition name="theme-icon" mode="out-in">
            <svg
              v-if="theme.theme.value === 'day'"
              key="moon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" stroke-linejoin="round" />
            </svg>
            <svg
              v-else
              key="sun"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" stroke-linecap="round" />
            </svg>
          </Transition>
        </button>

        <button
          type="button"
          class="header-action header-action--shelf"
          :aria-label="`打开我的书架，共 ${shelf.count.value} 本`"
          @click="shelf.openDrawer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M4 5.5h5.5v14H4zM10.5 5.5H16v14h-5.5zM17.5 6.6l4.1 12.5-3.4 1.1L15 7.7z" stroke-linejoin="round" />
          </svg>
          <span v-if="shelf.count.value" class="header-action__badge">{{ shelf.count.value }}</span>
        </button>

        <button
          type="button"
          class="menu-toggle"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          aria-label="打开菜单"
          @click="toggleMenu"
        >
          <span />
          <span />
        </button>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <Transition name="fade">
      <div v-if="menuOpen" class="menu-scrim" @click="closeMenu" />
    </Transition>
    <Transition name="menu">
      <div v-if="menuOpen" id="mobile-menu" class="mobile-menu" role="dialog" aria-modal="true" aria-label="导航菜单">
        <div class="mobile-menu__head">
          <span class="mobile-menu__brand">纸间 / PAPER BETWEEN</span>
          <button type="button" class="mobile-menu__close" aria-label="关闭菜单" @click="closeMenu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="m5 5 14 14M19 5 5 19" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <nav class="mobile-menu__nav" aria-label="移动端导航">
          <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="mobile-menu__link">
            <span class="mobile-menu__index">{{ link.index }}</span>
            <span class="mobile-menu__label">{{ link.label }}</span>
            <span class="mobile-menu__en">{{ link.en }}</span>
          </RouterLink>
        </nav>

        <div class="mobile-menu__foot">
          <p>营业时间<br />周二至周日 10:00 — 21:00</p>
          <p>湖南省衡阳市 · 常胜西路 27 号</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 80;
  height: var(--header-h);
  border-bottom: 1px solid transparent;
  transition:
    background 0.35s var(--ease-soft),
    border-color 0.35s var(--ease-soft),
    box-shadow 0.35s var(--ease-soft);
}

.site-header.is-scrolled {
  border-color: var(--line);
  background: color-mix(in srgb, var(--paper) 88%, transparent);
  box-shadow: 0 10px 30px rgba(32, 51, 42, 0.04);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: 28px;
}

.brand {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 10px;
}

.brand__mark {
  display: inline-flex;
  width: 35px;
  height: 35px;
  color: var(--forest);
}

.brand__text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.brand__text strong {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.brand__text small {
  margin-top: 5px;
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 6.5px;
  letter-spacing: 0.15em;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-left: auto;
}

.desktop-nav__link {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  color: var(--ink-soft);
  font-size: 13px;
  transition: color 0.2s var(--ease-soft);
}

.desktop-nav__index {
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 8px;
  transition: color 0.2s var(--ease-soft);
}

.desktop-nav__link::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -7px;
  left: 0;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s var(--ease-out);
}

.desktop-nav__link:hover,
.desktop-nav__link.is-active {
  color: var(--ink);
}

.desktop-nav__link:hover::after,
.desktop-nav__link.is-active::after {
  transform: scaleX(1);
  transform-origin: left;
}

.desktop-nav__link.is-active .desktop-nav__index {
  color: var(--clay);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 7px;
}

.header-action {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid transparent;
  border-radius: 50%;
  color: var(--ink);
  transition:
    background 0.2s var(--ease-soft),
    border-color 0.2s var(--ease-soft),
    transform 0.2s var(--ease-out);
}

.header-action:hover {
  border-color: var(--line);
  background: var(--paper-soft);
  transform: translateY(-1px);
}

.header-action svg {
  width: 19px;
  height: 19px;
}

.header-action__badge {
  position: absolute;
  top: 2px;
  right: 1px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 15px;
  height: 15px;
  padding: 0 3px;
  border: 2px solid var(--paper);
  border-radius: 999px;
  background: var(--clay);
  color: #fff8ec;
  font-family: var(--font-mono);
  font-size: 7.5px;
  line-height: 1;
}

.theme-icon-enter-active,
.theme-icon-leave-active {
  transition:
    opacity 0.18s var(--ease-soft),
    transform 0.18s var(--ease-out);
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-35deg);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(35deg);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 38px;
  height: 38px;
  padding: 0 9px;
}

.menu-toggle span {
  display: block;
  height: 1px;
  background: var(--ink);
  transition: transform 0.2s var(--ease-soft);
}

.menu-scrim {
  position: fixed;
  inset: 0;
  z-index: 95;
  background: rgba(20, 30, 24, 0.35);
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
}

.mobile-menu {
  position: fixed;
  inset: 0 0 0 auto;
  z-index: 96;
  display: flex;
  flex-direction: column;
  width: min(88vw, 420px);
  padding: 24px 30px 34px;
  background: var(--paper);
  box-shadow: -30px 0 80px rgba(20, 30, 24, 0.2);
  overflow-y: auto;
}

.mobile-menu__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);
}

.mobile-menu__brand {
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.12em;
}

.mobile-menu__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--line);
  border-radius: 50%;
}

.mobile-menu__close svg {
  width: 17px;
}

.mobile-menu__nav {
  display: flex;
  flex-direction: column;
  margin-top: 18px;
}

.mobile-menu__link {
  display: grid;
  grid-template-columns: 27px 1fr auto;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
}

.mobile-menu__index {
  color: var(--clay);
  font-family: var(--font-mono);
  font-size: 9px;
}

.mobile-menu__label {
  font-family: var(--font-display);
  font-size: 32px;
  line-height: 1.2;
}

.mobile-menu__en {
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.mobile-menu__foot {
  margin-top: auto;
  padding-top: 34px;
  color: var(--ink-soft);
  font-size: 11px;
  line-height: 1.9;
}

.mobile-menu__foot p {
  margin: 0 0 12px;
}

.menu-enter-active,
.menu-leave-active {
  transition: transform 0.4s var(--ease-out);
}

.menu-enter-from,
.menu-leave-to {
  transform: translateX(100%);
}

@media (max-width: 860px) {
  .desktop-nav {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }

  .header-action--search {
    display: none;
  }
}

@media (max-width: 560px) {
  .brand__text strong {
    font-size: 20px;
  }

  .header-actions {
    gap: 2px;
  }

  .header-action {
    width: 36px;
    height: 36px;
  }

  .mobile-menu {
    width: 100%;
    padding-inline: 22px;
  }
}
</style>

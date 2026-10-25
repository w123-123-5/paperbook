<script setup>
defineProps({
  title: { type: String, default: '这里暂时空着' },
  description: { type: String, default: '换一个关键词，或者去书架的另一头看看。' },
})
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__art" aria-hidden="true">
      <span class="empty-state__sun" />
      <span class="empty-state__book empty-state__book--one" />
      <span class="empty-state__book empty-state__book--two" />
      <span class="empty-state__book empty-state__book--three" />
    </div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <div v-if="$slots.default" class="empty-state__action">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 76px 24px;
  text-align: center;
}

.empty-state__art {
  position: relative;
  width: 180px;
  height: 140px;
  margin-bottom: 26px;
}

.empty-state__sun {
  position: absolute;
  top: 8px;
  right: 22px;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: var(--gold-soft);
  opacity: 0.8;
}

.empty-state__book {
  position: absolute;
  bottom: 16px;
  display: block;
  border-radius: 4px 8px 8px 4px;
  box-shadow: 4px 6px 0 rgba(32, 51, 42, 0.08);
}

.empty-state__book--one {
  left: 28px;
  width: 105px;
  height: 18px;
  background: var(--forest);
  transform: rotate(-6deg);
}

.empty-state__book--two {
  left: 44px;
  bottom: 38px;
  width: 92px;
  height: 15px;
  background: var(--clay);
  transform: rotate(3deg);
}

.empty-state__book--three {
  left: 35px;
  bottom: 57px;
  width: 76px;
  height: 13px;
  background: var(--gold);
  transform: rotate(-2deg);
}

.empty-state h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 25px;
  font-weight: 600;
}

.empty-state p {
  max-width: 420px;
  margin: 10px 0 0;
  color: var(--ink-soft);
  font-size: 14px;
}

.empty-state__action {
  margin-top: 24px;
}
</style>

<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  align: { type: String, default: 'left' },
  level: { type: String, default: 'h2' },
})
</script>

<template>
  <header class="section-title" :class="`section-title--${align}`">
    <div class="section-title__text">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <component :is="level" class="section-title__heading display">
        <slot name="title">{{ title }}</slot>
      </component>
      <p v-if="description || $slots.description" class="section-title__desc">
        <slot name="description">{{ description }}</slot>
      </p>
    </div>
    <div v-if="$slots.action" class="section-title__action">
      <slot name="action" />
    </div>
  </header>
</template>

<style scoped>
.section-title {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 44px;
}

.section-title__heading {
  max-width: 720px;
  font-size: clamp(2rem, 4.2vw, 3.55rem);
}

.section-title__desc {
  max-width: 590px;
  margin: 16px 0 0;
  color: var(--ink-soft);
  font-size: 15px;
  line-height: 1.85;
}

.section-title__action {
  flex: none;
  padding-bottom: 6px;
}

.section-title--center {
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.section-title--center .section-title__text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-title--center .eyebrow {
  justify-content: center;
}

.section-title--center .eyebrow::after {
  content: '';
  width: 28px;
  height: 1px;
  background: currentColor;
}

.section-title--right {
  flex-direction: row-reverse;
  text-align: right;
}

.section-title--right .eyebrow {
  flex-direction: row-reverse;
}

@media (max-width: 760px) {
  .section-title {
    align-items: flex-start;
    flex-direction: column;
    gap: 19px;
    margin-bottom: 32px;
  }

  .section-title--center {
    align-items: center;
  }

  .section-title__action {
    padding-bottom: 0;
  }

  .section-title__desc {
    font-size: 14px;
  }
}
</style>

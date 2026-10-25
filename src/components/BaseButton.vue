<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  to: { type: [String, Object], default: null },
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  block: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
})

const tag = computed(() => (props.to ? RouterLink : 'button'))
</script>

<template>
  <component
    :is="tag"
    :to="to || undefined"
    :type="to ? undefined : type"
    class="btn"
    :class="[`btn--${variant}`, { 'btn--small': size === 'small', 'btn--block': block }]"
  >
    <span v-if="$slots.icon" class="btn__icon"><slot name="icon" /></span>
    <span v-if="$slots.default" class="btn__label"><slot /></span>
    <span v-if="$slots.trailing" class="btn__trailing"><slot name="trailing" /></span>
  </component>
</template>

<style scoped>
.btn__icon,
.btn__trailing {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}

.btn__icon :deep(svg),
.btn__trailing :deep(svg) {
  width: 16px;
  height: 16px;
}

.btn__trailing {
  transition: transform 0.25s var(--ease-out);
}

.btn:hover .btn__trailing {
  transform: translateX(3px);
}
</style>

<script setup>
defineProps({
  tone: { type: String, default: 'default' },
  as: { type: String, default: 'span' },
})
</script>

<template>
  <component :is="as" class="tag" :class="`tag--${tone}`">
    <slot />
  </component>
</template>

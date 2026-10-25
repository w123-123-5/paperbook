<script setup>
import { provide } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import ToastStack from './components/ToastStack.vue'
import ShelfDrawer from './components/ShelfDrawer.vue'
import { useShelf } from './composables/useShelf'
import { useTheme } from './composables/useTheme'
import { useToast } from './composables/useToast'

const route = useRoute()
const shelf = useShelf()
const theme = useTheme()
const toast = useToast()

provide('shelf', shelf)
provide('theme', theme)
provide('toast', toast)
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">跳到正文</a>
    <AppHeader />
    <main id="main-content">
      <RouterView v-slot="{ Component, route: currentRoute }">
        <Transition name="page" mode="out-in">
          <KeepAlive :include="['ShelfView']">
            <component :is="Component" :key="currentRoute.path" />
          </KeepAlive>
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <ShelfDrawer />
    <ToastStack />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>

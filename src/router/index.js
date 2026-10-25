import { createRouter, createWebHashHistory } from 'vue-router'
import { getBook } from '../data/books'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { title: '让好书找到下一位读者' },
    },
    {
      path: '/shelf',
      name: 'shelf',
      component: () => import('../views/ShelfView.vue'),
      meta: { title: '在架书目' },
    },
    {
      path: '/books/:id',
      name: 'book',
      component: () => import('../views/BookDetailView.vue'),
      props: true,
      meta: { title: '书籍详情' },
      beforeEnter: (to) => {
        if (!getBook(String(to.params.id))) {
          return { name: 'not-found', params: { pathMatch: to.path.split('/').slice(1) } }
        }
        return true
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: '关于纸间' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: '这一页还没有被写下' },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 110 }
    return { top: 0, behavior: 'smooth' }
  },
})

router.afterEach((to) => {
  const title = to.meta.title ? `${to.meta.title} · 纸间书店` : '纸间书店'
  document.title = title
})

export default router

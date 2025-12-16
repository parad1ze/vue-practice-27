import { createRouter, createWebHistory } from 'vue-router'

// Вариант A: Используем lazy loading для всех компонентов
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/generator',
    name: 'generator',
    component: () => import('../views/GeneratorView.vue')
  },
  {
    path: '/library',
    name: 'library',
    component: () => import('../views/LibraryView.vue')
  },
  {
    path: '/accessibility',
    name: 'accessibility',
    component: () => import('../views/AccessibilityView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'acceuil',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/leclub',
      name: 'leclub',
      component: () => import('../views/TeamView.vue'),
    },
    {
      path: '/planning',
      name: 'planning',
      component: () => import('../views/PlanningView.vue'),
    },
    {
      path: '/boutique',
      name: 'boutique',
      component: () => import('../views/BoutiqueView.vue'),
    },
    {
      path: '/actualites',
      name: 'actualites',
      component: () => import('../views/NewsView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
    },
  ],
})

export default router

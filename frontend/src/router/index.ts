import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'acceuil',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/leclub',
      name: 'leclub',
      component: () => import('@/views/ClubView.vue'),
    },
    {
      path: '/planning',
      name: 'planning',
      component: () => import('@/views/PlanningView.vue'),
    },
    {
      path: '/planning-entrainement',
      name: 'planning-entrainement',
      component: () => import('@/views/TrainingPlanningView.vue'),
    },
    {
      path: '/actualites',
      name: 'actualites',
      component: () => import('@/views/NewsView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
    },
    {
      path: '/equipes',
      name: 'equipes',
      component: () => import('@/views/TeamView.vue'),
    },
    {
      path: '/histoire',
      name: 'histoire',
      component: () => import('@/views/HistoryView.vue'),
    },
    {
      path: '/bureau',
      name: 'bureau',
      component: () => import('@/views/CommitteesView.vue'),
    },
    {
      path: '/mentions-legales',
      name: 'mentions-legales',
      component: () => import('@/views/LegalNoticesView.vue'),
    },
    {
      path: '/politique-de-confidentialite',
      name: 'politique-de-confidentialite',
      component: () => import('@/views/PrivacyPolicyView.vue'),
    },
    {
      path: '/inscription',
      name: 'inscription',
      component: () => import('@/views/RegistrationView.vue'),
    },
    {
      path: '/basketfit',
      name: 'basketfit',
      component: () => import('@/views/BasketFitView.vue'),
    },
  ],
})

export default router

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
    // Admin
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/AdminLoginView.vue'),
    },
    {
      path: '/admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: { requiresAdminAuth: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/AdminDashboard.vue'),
        },
        {
          path: 'committees',
          name: 'admin-committees',
          component: () => import('@/views/admin/AdminCommitteesView.vue'),
        },
        {
          path: 'key-roles',
          name: 'admin-key-roles',
          component: () => import('@/views/admin/AdminKeyRolesView.vue'),
        },
        {
          path: 'history-events',
          name: 'admin-history-events',
          component: () => import('@/views/admin/AdminHistoryEventsView.vue'),
        },
        {
          path: 'matches',
          name: 'admin-matches',
          component: () => import('@/views/admin/AdminMatchesView.vue'),
        },
        {
          path: 'news',
          name: 'admin-news',
          component: () => import('@/views/admin/AdminNewsView.vue'),
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('@/views/admin/AdminProductsView.vue'),
        },
        {
          path: 'season-events',
          name: 'admin-season-events',
          component: () => import('@/views/admin/AdminSeasonEventsView.vue'),
        },
        {
          path: 'teams',
          name: 'admin-teams',
          component: () => import('@/views/admin/AdminTeamsView.vue'),
        },
        {
          path: 'training-schedules',
          name: 'admin-training-schedules',
          component: () => import('@/views/admin/AdminTrainingSchedulesView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAdminAuth && !localStorage.getItem('bsm_admin_token')) {
    return { name: 'admin-login' }
  }
})

export default router

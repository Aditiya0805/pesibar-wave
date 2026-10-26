import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DetailView from '@/views/DetailView.vue'
import BookingView from '@/views/BookingView.vue'
import AdminView from '@/views/AdminView.vue'
import { useAuthStore } from '@/stores/authStore'
import { useLangStore } from '@/stores/langStore'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: DetailView,
    props: true
  },
  {
    path: '/booking',
    name: 'Booking',
    component: BookingView
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: 'smooth'
          })
        }, 120)
      })
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  }
})

// Navigation Guard
router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAdmin) {
    // The Admin route itself renders the login form, so it is allowed.
    // Any other protected route is redirected to the login screen.
    if (to.name !== 'Admin') {
      return { name: 'Admin' }
    }
  }

  return true
})

// Dynamic document title update
router.afterEach((to) => {
  const langStore = useLangStore()
  if (to.name === 'Home') {
    langStore.setDocumentTitle()
  } else if (to.name === 'Booking') {
    langStore.setDocumentTitle(langStore.t('nav.bookNow'))
  } else if (to.name === 'Admin') {
    langStore.setDocumentTitle('Admin Portal')
  }
})

export default router

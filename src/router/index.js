import { createRouter, createWebHistory } from 'vue-router'
import { useCookies } from "vue3-cookies";

import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },
]

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, // short for `routes: routes`
})

router.beforeEach((to,from,next) => {
  const params = new URLSearchParams(location.search);
  const session_id = params.get("session_id");

  const { cookies } = useCookies();

  if (session_id) {
    cookies.set("session_id", token);
  }

  const hasToken = cookies.isKey("session_id");

  if(!hasToken && to.path !== '/') {
    next('/');
  }
  else if(hasToken && to.path == '/') {
    next('/home');
  }
  else {
    next();
  }
});

export default router
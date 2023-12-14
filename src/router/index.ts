import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/SignInView.vue';
import SignUpView from '../views/SignUpView.vue';
import TaskView from '../views/TaskView.vue';
import ProfileView from '../views/ProfileView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: SignInView
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: SignUpView
    },
    {
      path: '/task/:id?',
      name: 'task',
      component: TaskView
    },
    {
      path: '/profile/:id?',
      name: 'profile',
      component: ProfileView
    }
  ]
})

export default router

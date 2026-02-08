import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import PostDetail from './pages/PostDetail.vue'

const routes = [
  { path: '/home', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/posts/:id', name: 'Post-Detail', component: PostDetail, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
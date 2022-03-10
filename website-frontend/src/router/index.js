import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue';
import DashBoard from '../views/DashBoard.vue';
import Server from '../views/Server.vue';


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashBoard
  },
  {
    path: '/server/:guildid',
    name: 'server',
    component: Server
  },
  {
    path: '/status/:ip',
    name: 'status',
    component: Server
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

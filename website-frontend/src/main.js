import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueHead from 'vue-head'

Vue.config.productionTip = false

new Vue({
  router,
  VueHead,
  render: (h) => h(App)
}).$mount('body')

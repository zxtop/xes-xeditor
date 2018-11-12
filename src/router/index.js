import Vue from 'vue'
import Router from 'vue-router'
// import ElementUI from 'element-ui';
// import Home from '@/components/Home'
import Index from "@/components/Index"
Vue.use(Router);
// Vue.use(ElementUI);
export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'Home',
    //   component: Home
    // },
    {
      path: '/',
      name: 'Index',
      component: Index
    }
  ]
})

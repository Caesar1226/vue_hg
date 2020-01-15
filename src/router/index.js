import Vue from 'vue'
import Router from 'vue-router'
import { routes } from './router'
import { Message } from 'element-ui'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: routes,
  base: '/demo01/'
})

router.beforeEach((to, from, next) => {
  
  let token = localStorage.getItem('token')
  if(to.name == 'Login'){
    next()
  }else {
    if(token){
      next()
    }else {
      next({path: '/login'})
      Message({ message: '请重新登陆', type: 'warning' })
    }
  }
})

export default router
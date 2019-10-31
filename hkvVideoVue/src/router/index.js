import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // name: 'HelloWorld',
      // component: HelloWorld
      component: () => import('@/views/hkv'),
    }
  ]
  // scrollBehavior: () => ({ y: 0 }),
  // routes: constantRouterMap
})

export const constantRouterMap = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  }
]

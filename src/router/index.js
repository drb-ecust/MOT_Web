/**
 * 程序名：前端路由配置
 * 功能：配置前端路由
 */
import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'

import Index from '@/components/Index'
import Home from '@/components/Home'
import Display from '@/components/Display'
import Time from '@/components/Time'
import ThankYou from '@/components/ThankYou'
import newBase from '@/components/newBase'
import WjList from '@/components/WjList'
import Design from '@/components/Design'
import Answer from '@/components/Answer'
import ps from '@/components/ps'
Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path:'/',
      name:'Base',
      component: newBase,
      children:[
        {
          path:'/',
          name:'index',
          component: Index
        },
        {
          path:'/index',
          name: 'index',
          component: Index
        },
        {
          path:'/list',
          name:'list',
          component: WjList
        },{
          path:'/design',
          name:'design',
          component: Home
        },{
          path:'/time',
          name:'time',
          component: Time
        },{
          path:'/ps',
          name:'ps',
          component:ps
        },{
          path:'/answer',
          name:'answer',
          component: Answer
        },{
                path: '/login',
                name: 'Login',
                component: Login
              },
              {
                path: '/register',
                name: 'Register',
                component: Register
              },
      ],
      meta:{
        title:"外卖宝"
      }
    },
   
    {
      path: '/display/:id',
      name: 'Display',
      component: Display
    },
   
    {
      path: '/thankyou',
      name: 'ThankYou',
      component: ThankYou
    },
  ]
})

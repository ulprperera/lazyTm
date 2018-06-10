import Vue from 'vue'
import Router from 'vue-router'

import Now from '../components/now'
import Roster from '../components/roster'
import Agenda from '../components/agenda'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/now',
      name: 'now',
      component: Now
    },
    {
        path: '/roster',
        name: 'roster',
        component: Roster
      }  ,
      {
        path: '/agenda',
        name: 'agenda',
        component: Agenda
      }      
  ]
})
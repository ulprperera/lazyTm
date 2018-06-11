import Vue from 'vue'
import bootstrapVue from "bootstrap-vue"
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import router from './router'
import Data from './assets/Data'
import jsPDF from 'jsPDF'
import  './firebase'
import vueFire from 'vueFire'
import VueFirestore from 'vue-firestore'
import underscore from 'vue-underscore';

require('firebase/firestore')


Vue.use(bootstrapVue);
Vue.use(vueFire)
Vue.use(VueFirestore)
Vue.use(underscore);

new Vue({
  el: '#app',
  // this won't work in runtime-only build which is what you get by default with `import Vue from 'vue'`
  template: '<App/>',  
  router, 
  data:Data,
  
  components: { App },
});
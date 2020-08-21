import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store/store'
import './registerServiceWorker'

import { fb } from '@/config/firebase'

import Vue2Editor from 'vue2-editor'

// axios, vue-axios
import axios from 'axios'
import VueAxios from 'vue-axios'

import Vuelidate from 'vuelidate'

import VueLazyload from 'vue-lazyload'

import UUID from 'vue-uuid'

import VueCarousel from '@chenfengyuan/vue-carousel'

// boostrap 4
import BootstrapVue from 'bootstrap-vue'

// vue notification
import Notifications from 'vue-notification'

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faUtensils } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
Vue.use(Vue2Editor)
Vue.use(VueAxios, axios)
Vue.use(Vuelidate)
Vue.use(VueLazyload)
Vue.use(UUID)
Vue.component(VueCarousel.name, VueCarousel)

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(Notifications)

library.add(faUserSecret, faUtensils)

Vue.component('font-awesome-icon', FontAwesomeIcon)

let app = null

fb.auth().onAuthStateChanged(() => {
  if (!app) {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})

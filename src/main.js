import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import "./registerServiceWorker";

import { fb, db } from "@/config/firebase";

import Vue2Editor from "vue2-editor";
Vue.use(Vue2Editor);


// axios, vue-axios
import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);

import Vuelidate from "vuelidate";
Vue.use(Vuelidate);

import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload);

import UUID from "vue-uuid";
Vue.use(UUID);

import VueCarousel from "@chenfengyuan/vue-carousel";
Vue.component(VueCarousel.name, VueCarousel);

Vue.config.productionTip = false;

// boostrap 4
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

//vue notification
import Notifications from 'vue-notification'
Vue.use(Notifications)


// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faUtensils } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret,faUtensils )

Vue.component('font-awesome-icon', FontAwesomeIcon)


let app = null;

fb.auth().onAuthStateChanged(() => {
  if (!app) {
   var vm = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});

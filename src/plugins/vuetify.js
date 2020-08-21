import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#cb7a43',
    secondary: '#261c1d',
    anyColor: '#000',
    success: '#8db600'
  }
})

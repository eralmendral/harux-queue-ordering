<template>
  <v-toolbar color="secondary" class="navbar-user">
    <v-layout>
       <img src="/haruxlogo.png" alt="logo" class="navbar-logo"/>
        <v-flex xs12 text-center>
          <span class="navbar-user-table-number font-custom">#{{tableProfile.table_number}}</span>
          <v-btn class="navbar-user-menu" to="/">
          <span class="font-custom">Menu</span>
        </v-btn>
        <v-btn class="navbar-user-menu" to="/myorders">
          <span class="font-custom">My Orders</span>
        </v-btn>
        <v-btn
          slot="activator"
          @click="toggleCart"
          fab
          class="drawerActivator"
        >
          <v-badge color>
            <template v-slot:badge>
              <h5
                class="cartSizeIndicator"
              >{{cartSize ? cartSize : ''}}</h5>
            </template>
            <font-awesome-icon icon="utensils" class="primary--text drawerActivatorIcon"/>
          </v-badge>
        </v-btn>
        </v-flex>
    </v-layout>
  </v-toolbar>
</template>

<script>
import { fb } from '@/config/firebase'

import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      title: 'Harux'
    }
  },
  methods: {
    ...mapActions(['billout']),
    toggleCart () {
      this.$emit('toggleCart')
    },
    logout () {
      fb.auth()
        .signOut()
        .then(() => {
          this.$router.push('/login')
        })
    }
  },
  computed: {
    ...mapGetters(['cartSize', 'tableProfile'])
  }
}
</script>

<style>
.navbar-user {
  position: fixed;
  width: 100%;
  z-index: 99;
}

.navbar-user-table-number {
  display: inline-block;
  margin-right: 15px;
  font-size: 24px;
  color: #cb7a43 !important;
  font-weight: bolder;
}

.navbar-user-menu {
    background: inherit !important;
    border: 1px solid #cb7a43;
    border-radius: 0px;
    color: #cb7a43 !important;
    padding: 20px;
    font-size: 24px;
}

.drawerActivator {
  position: relative;
  background: inherit !important;
  border: 1px solid #cb7a43;
  outline: none !important;
  height: 40px;
  width: 40px;
}

.cartSizeIndicator {
  position: absolute;
  width: 30px;
  height: 25px;
  color: #eeebea;
  font-weight: bolder;
  font-size: 18px;
}

.drawerActivatorIcon {
  font-size: 24px;
}

.navbar-logo {
  position: absolute;
  width: 120px !important;
  height: 120px !important;
}
</style>

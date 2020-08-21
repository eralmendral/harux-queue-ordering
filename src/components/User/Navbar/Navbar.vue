<template>
  <v-toolbar flat style="background: #ddae6a; opacity: .9; " height="75px">
    <v-layout row justify-center align-content-center align-center style="z-index:99999 ">
      <div class>
        <!-- <v-btn style="background: inherit">
          <h4 class="white--text">
            <span class="green--text">{{tableProfile.table_number}}</span>
          </h4>
        </v-btn>-->

        <v-btn style="background: inherit; border: 1px solid #fff; padding: 25px" to="/">
          <h4 class="mt-2 nav_title">MENU</h4>
        </v-btn>

        <v-btn
          class="align-center justify-center"
          color
          style="background: inherit; border: 1px solid #fff;padding: 25px"
          to="/myorders"
        >
          <h4 class="mt-2 nav_title">MY ORDERS</h4>
        </v-btn>

        <v-btn
          slot="activator"
          @click="toggleCart"
          fab
          style="background: inherit; border: 1px solid #fff; height: 50px;width:50px"
        >
          <v-badge color>
            <template v-slot:badge>
              <h5
                class="font-weight-bold white--text"
                :class="cartSize > 0 ? 'pink' : ''"
                style="border-radius: 50%; padding: 2px; width: 30px;height: 25px"
              >{{cartSize ? cartSize : ''}}</h5>
            </template>
            <font-awesome-icon icon="utensils" class="secondary--text" size="2x" />
          </v-badge>
        </v-btn>
      </div>
    </v-layout>
  </v-toolbar>
</template>

<script>
import { fb } from '@/config/firebase'

import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      title: 'Harux1'
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
        .catch(err => console.log(err))
    }
  },
  computed: {
    ...mapGetters(['cartSize', 'tableProfile'])
  }
}
</script>

<style>
.nav_title {
  font-family: "Times New Roman" !important;

  color: rgb(37, 23, 4);
}
</style>

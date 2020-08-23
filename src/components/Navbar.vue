<template>
  <nav>
    <v-toolbar app flat style='background: #36231d' height='50px'>
      <v-btn flat small fab color='primary' v-if='drawer' v-on:click='mini = !mini'>
        <v-icon large v-if='mini'>toggle_off</v-icon>
        <v-icon large v-else>toggle_on</v-icon>
      </v-btn>
      <v-btn flat small fab color='primary' v-on:click='drawer = !drawer'>
        <v-icon large v-if='drawer'>close</v-icon>
        <v-icon large v-else>menu</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
      <v-icon medium right  color='primary' @click='logout' title='logout'>exit_to_app</v-icon>
    </v-toolbar>

    <v-navigation-drawer
      style='overflow-y: scroll; overflow-x: hidden; background:#1f1610'
      app
      v-model='drawer'
      class='white--text'
      :mini-variant.sync='mini'
      :width='230'
    >
      <v-layout></v-layout>
      <v-layout column justify-center align-center>
        <v-flex class>
          <v-avatar :size="mini ? '80' : '150'">
            <img src='/haruxlogo.png' alt='avatar' />
          </v-avatar>
          <p class='white--text subheading mt-1 text-xs-center' v-if='!mini'>Harux Admin</p>
        </v-flex>
      </v-layout>
      <v-list>
        <v-list-tile v-for='link in links' :key='link.text' router :to='link.route'>
          <v-tooltip right>
            <template v-slot:activator='{ on }' class='pink'>
              <v-icon :color='link.color' v-on='on' :medium='mini' :small='!mini' left>{{link.icon}}</v-icon>
            </template>
            <span class='white--text'>{{link.text}}</span>
          </v-tooltip>

          <v-list-tile-content>
            <v-list-tile-title class='font-weight-normal' style='color:rgb(243, 143, 35)'>{{link.text}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { fb } from '@/config/firebase'
export default {
  name: 'Navbar',
  data () {
    return {
      drawer: true,
      mini: false,
      billoutTooltip: false,
      queueTooltip: false,
      links: [
        {
          icon: 'dashboard',
          text: 'Dashboard',
          route: '/dashboard',
          color: 'white'
        },
        {
          icon: 'date_range',
          text: 'Pending Orders',
          route: '/dashboard/new-orders',
          color: 'white'
        },

        {
          icon: 'group_work',
          text: 'Tables',
          route: '/dashboard/tables',
          color: 'white'
        },
        {
          icon: 'attach_money',
          text: 'Billout',
          route: '/dashboard/billout',
          color: 'white'
        },
        {
          icon: 'star_border',
          text: 'Chickens',
          route: '/dashboard/chickens',
          color: 'white'
        },
        {
          icon: 'opacity',
          text: 'Sauces',
          route: '/dashboard/sauces',
          color: 'white'
        },

        {
          icon: 'invert_colors',
          text: 'Sauce Categories',
          route: '/dashboard/sauces/categories',
          color: 'white'
        },
        {
          icon: 'shopping_cart',
          text: 'Products',
          route: '/dashboard/products',
          color: 'white'
        },
        {
          icon: 'apps',
          text: 'Product Categories',
          route: '/dashboard/categories',
          color: 'white'
        },
        {
          icon: 'date_range',
          text: 'Finished Orders',
          route: '/dashboard/finished-orders',
          color: 'white'
        },
        {
          icon: 'delete',
          text: 'Cancelled Orders',
          route: '/dashboard/cancelled-orders',
          color: 'white'
        },
        {
          icon: 'person',
          text: 'Users',
          route: '/dashboard/users',
          color: 'white'
        },
        {
          icon: 'collections',
          text: 'Slideshow',
          route: '/dashboard/slideshow',
          color: 'white'
        },
        {
          icon: 'settings',
          text: 'Settings',
          route: '/dashboard/settings',
          color: 'white'
        }
      ]
    }
  },
  methods: {
    logout () {
      fb.auth()
        .signOut()
        .then(() => {
          this.$router.push('/login')
        })
    }
  }
}
</script>

<style scoped>
  button {
    border: none;
    outline: none;
  }
</style>

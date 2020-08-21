<template>
  <div>
    <v-layout row wrap>
      <Navbar @toggleDrawer="drawer = !drawer" @toggleCart="cart = !cart" />

      <v-navigation-drawer
        v-model="cart"
        absolute
        temporary
        right
        persistent
        width="400px"

        class="secondary primary--text"
      >
        <v-btn fab absolute @click="cart = !cart" right color="primary white--text mt-2" small>
          <v-icon>close</v-icon>
        </v-btn>
        <v-list class="pa-1 text-xs-center">
          <div class="text-xs-left"></div>
          <v-layout row  align-center>
            <v-flex xs3>
              <img src="/haruxlogo.png" alt="logo" width="80px" height="80px" />
            </v-flex >
            <v-flex xs6>
              <h3 class="primary--text font-weight-bold display-1 text-center">{{tableProfile.table_number}}</h3>
            </v-flex>
          </v-layout>
        </v-list>

        <v-list class="pt-0" dense>
          <v-list-tile v-for="item in orderItems" :key="item.title">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <div class="container">
          <h3 class>
            <v-chip class="primary">
              <span class="white--text">{{cartSize}}</span>
            </v-chip>
            <span class="white--text">products</span>
          </h3>
          <div v-if="!cartSize" class="primary white--text pa-3">Table is empty! Please add some orders.</div>
          <table v-else class="table table-striped mb-5">
            <thead class="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Product</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Remove</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in fetchCart" :key="product.id">
                <th scope="row" class="white--text">{{index + 1}}</th>
                <td class="white--text">{{product.name}}</td>
                <td class="white--text">Php {{product.price}}</td>
                <td>
                  <button
                    v-if="product.category != 'Chicken'"
                    @click="removeFromCart(product.id)"
                    class="btn btn-outline-danger btn-small"
                  >-</button>
                  <span class="mx-2 white--text">{{product.quantity ? product.quantity : '' }}</span>
                  <button
                    v-if="product.category != 'Chicken'"
                    @click="addToCart({productId: product.id})"
                    :disabled="product.quantity === product.stock"
                    class="btn btn-outline-success btn-small"
                  >+</button>
                </td>
                <td>
                  <button
                    v-if="product.category != 'Chicken'"
                    @click="deleteFromCart(product.id)"
                    class="btn btn-outline-warning btn-small"
                  >x</button>
                </td>
                <td class="white--text">{{product.quantity* product.price}}</td>
              </tr>

              <tr class="table-footer white--text font-weight-bold">
                <td colspan="4" class="total">Total:</td>
                <td>
                  <span>Php. {{cartTotalAmount}}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="text-xs-center" v-if="fetchCart.length > 0">
          <v-btn large class="stdBtn white--text" @click="confirmTheseOrder()">
            <span>Confirm Order</span>
          </v-btn>
        </div>
      </v-navigation-drawer>
    </v-layout>

    <router-view></router-view>
     <br>
     <br>
     <br>
    <Queue />
  </div>
</template>

<script>
import Navbar from '@/components/User/Navbar/Navbar'
import Queue from '@/components/User/Navbar/Queue'

import { fb, db } from '@/config/firebase'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      drawer: null,
      cart: null,
      items: [
        { title: 'Menu', icon: 'dashboard' },
        { title: 'My Orders', icon: 'shopping_cart' }
      ],
      orderItems: [],
      tableprofile: {}
    }
  },
  components: {
    Navbar,
    Queue
  },
  methods: {
    ...mapActions([
      'setTableProfile',
      'setCategories',
      'fetchProducts',
      'setProducts',
      'addToCart',
      'removeFromCart',
      'deleteFromCart',
      'confirmOrder'
    ]),
    toggleDrawer () {
      this.drawer = !this.drawer
    },
    confirmTheseOrder () {
      this.confirmOrder()
      this.$router.push('/')
    }
  },
  created () {
    let userid = fb.auth().currentUser.uid
    db.collection('users')
      .doc(userid)
      .onSnapshot(doc => {
        this.setTableProfile(doc.data())
      })

    this.setCategories()
  },
  computed: {
    ...mapGetters([
      'tableProfile',
      'occupied',
      'billingOut',
      'fetchCategories',
      'fetchProducts',
      'fetchCart',
      'cartSize',
      'cartTotalAmount',
      'fetchProductQuantity'
    ])
  }
}
</script>

<style>
body,
html {
  overflow-x: hidden;
}
</style>

<template>
  <div>
    <div v-if="loading">Loading....</div>
    <div v-else class="mt-100">
      <div class="text-xs-center">
        <h2 class="primary--text text--darken-2">{{this.category}}</h2>
      </div>

      <div class="text-xs-center" v-if="fetchCart.length > 0">
        <v-btn
          fixed
          bottom
          right
          @click="confirmTheseOrder()"
          class="secondary primary--text confirm-button"
        ><span class="font-custom">Confirm Order</span></v-btn>
      </div>

      <div>
        <v-container v-if="products.length > 0">
          <v-card v-for="product in products" :key="product.id" class="pa-3 bg-grey" flat>
            <v-card-text>
              <v-layout row justify-content-center align-center>
                <v-flex>
                    <img :src="product.image ? product.image : '/haruxlogo.png'" class="product-table-image" :alt="product.name" />
                </v-flex>
                <v-flex>
                  <router-link tag="div" :to="{name: 'userproduct' , params:{id:product.id}}" style="cursor:pointer">
                    <h2 class="text-center secondary--text">{{product.name}}</h2>
                  </router-link>
                </v-flex>

                <v-flex>
                  <v-layout class="justify-end align-center">
                    <h2 style='margin-right: 100px'><b>₱ {{product.price}}</b></h2>
                    <button class="secondary circleBtn" @click="removeFromCart(product.id)">
                      <v-icon class="primary--text">remove</v-icon>
                    </button>
                    <h2
                      class="primary--text"
                    >{{fetchProductQuantity(product.id) ? fetchProductQuantity(product.id).quantity : '0'}}</h2>
                    <button class="secondary circleBtn" @click="addToCart({productId: product.id})">
                      <v-icon class="primary--text">add</v-icon>
                    </button>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-container>
        <div v-else class="text-xs-center mt-5">
          <h2 class="primary--text">There is no product in these category.</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/config/firebase'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      loading: false,
      title: 'Products',
      category: '',
      products: []
    }
  },
  methods: {
    ...mapActions([
      'setProducts',
      'addToCart',
      'removeFromCart',
      'deleteFromCart',
      'confirmOrder'
    ]),
    confirmTheseOrder () {
      this.confirmOrder()
      this.$router.push('/')
    }
  },
  created () {
    // set category
    this.category = this.$route.params.category
    this.setProducts(this.category)

    db.collection('products')
      .where('category', '==', this.category)
      .where('status', '==', 'available')
      .onSnapshot(snapshot => {
        this.products = []
        snapshot.forEach(doc => {
          this.products.push(doc.data())
        })
      })
  },
  beforeRouteEnter (to, from, next) {
    if (to.params.category === 'Sauce') {
      next({ name: 'usersauces' })
    }
    if (to.params.category === 'Chicken') {
      next({ name: 'userchickens' })
    } else {
      next()
    }
  },
  computed: {
    ...mapGetters([
      'fetchCart',
      'cartSize',
      'cartTotalAmount',
      'fetchProductQuantity'
    ])
  }
}
</script>

<style>
</style>

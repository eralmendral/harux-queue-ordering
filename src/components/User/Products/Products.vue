<template>
  <div>
    <div v-if="loading">Loading....</div>
    <div v-else>
      <div class="text-xs-center my-5">
        <h3 class="primary--text text--darken-2">{{this.category}}</h3>
      </div>

      <div class="text-xs-center" v-if="fetchCart.length > 0">
        <v-btn
          large
          fixed
          bottom
          style="margin-bottom: 100px;"
          right
          depressed
          @click="confirmTheseOrder()"
          class="stdBtn secondary--text"
        >Confirm Order</v-btn>
      </div>

      <div>
        <div v-if="products.length > 0">
          <v-card v-for="product in products" :key="product.id" class="ma-2" flat>
            <v-card-text>
              <v-layout row wrap flex justify-space-around align-center>
                <v-flex xs2>
                  <router-link :to="{name: 'userproduct' , params:{id:product.id}}">
                      <img :src="product.image" class="product_img" alt="product image" />
                  </router-link>

                </v-flex>
                <v-flex xs3>
                  <router-link tag="div" :to="{name: 'userproduct' , params:{id:product.id}}" style="cursor:pointer">
                    <h6 class="card-title ml-2 text-center">{{product.name}}</h6>
                  </router-link>
                </v-flex>

                <v-flex xs2>
                  <h6 class="card-text text-center brown--text">
                    <b>₱ {{product.price}}</b>
                  </h6>
                </v-flex>

                <v-flex xs5>
                  <v-layout class="justify-center align-center">
                    <button class="circleBtn" @click="removeFromCart(product.id)">
                      <v-icon class="primary--text">remove</v-icon>
                    </button>
                    <h3
                      class="primary--text"
                    >{{fetchProductQuantity(product.id) ? fetchProductQuantity(product.id).quantity : '0'}}</h3>
                    <button class="circleBtn" @click="addToCart({productId: product.id})">
                      <v-icon class="primary--text">add</v-icon>
                    </button>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>

           <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
        <br />
      <br />
      <br />
        </div>
        <div v-else class="text-xs-center">
          <h3 class="primary--text">There is No Product in these Category</h3>
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
    // fetch products based on category

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
    //  console.log("Fetched Products",this.fetchProducts);
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

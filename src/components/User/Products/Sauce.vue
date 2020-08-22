<template>
  <div>
    <div v-if="loading">Loading....</div>
    <div v-else class="mt-100">
       <div class="text-xs-center">
        <h2 class="primary--text text--darken-2">Sauces</h2>
      </div>
      <div class="text-xs-center" v-if="fetchCart.length > 0">
        <v-btn
          fixed
          bottom
          style="z-index:999"
          right
          @click="confirmTheseOrder()"
          class="secondary primary--text confirm-button"
        >Confirm Order</v-btn>
      </div>

      <v-card class="ma-5 bg-grey"
        flat
        v-for="sauceCateg in sauceCategories"
        :key="sauceCateg.id"
      >
        <h2 class="text-xs-center pt-3" v-bind:style="{ 'color':  sauceCateg.color  }">
          <small>****</small>
          {{sauceCateg.name}}
          <small>****</small>
        </h2>

        <v-container>
          <v-layout
            flex
            row
            wrap
            align-center
            justify-space-around
            v-for="sauce in filterSauces(sauceCateg.name)"
            :key="sauce.id"
          >
            <v-flex>
                <v-layout  >
                  <v-flex row align-center>
                    <img :src="sauce.image ? sauce.image : '/haruxlogo.png'" class="d-block product-table-image" :alt="sauce.name" />
                    <router-link
                    tag="div"
                    :to="{name: 'userproduct' , params:{id:sauce.id}}"
                    style="cursor:pointer"
                  >
                    <h2 class="ml-5 text-center" style="color:#261c1d !important;">{{sauce.name}}</h2>
                  </router-link>
                </v-flex>
                </v-layout>
            </v-flex>

            <v-flex>
              <p class="text-start" v-html="sauce.details" ></p>
            </v-flex>

            <v-flex>
              <v-layout class="justify-end align-center">
                <button class="secondary circleBtn" @click="removeFromCart(sauce.id)">
                  <v-icon class="primary--text">remove</v-icon>
                </button>
                <h2 class="primary--text"
                >{{fetchProductQuantity(sauce.id) ? fetchProductQuantity(sauce.id).quantity : '0'}}</h2>
                <button class="secondary circleBtn" @click="addToCart({productId: sauce.id})">
                  <v-icon class="primary--text">add</v-icon>
                </button>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
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
      sauceCategories: [],
      sauces: []
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
    fetchSauceCategories () {
      db.collection('saucecategories').onSnapshot(snapshot => {
        this.sauceCategories = []
        snapshot.forEach(doc => {
          this.sauceCategories.push(doc.data())
        })
      })
    },
    fetchSauce () {
      db.collection('products')
        .where('category', '==', 'Sauce')
        .where('status', '==', 'available')
        .onSnapshot(snapshot => {
          this.sauces = []
          snapshot.forEach(doc => {
            this.sauces.push(doc.data())
          })
        })
    },
    filterSauces (subcategory) {
      return this.sauces.filter(s => s.subcategory === subcategory)
    },
    confirmTheseOrder () {
      this.confirmOrder()
      this.$router.push('/')
    }
  },
  created () {
    this.setProducts('Sauce')
    this.fetchSauceCategories()
    this.fetchSauce()
  },
  computed: {
    ...mapGetters([
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
.sauceTitle {
  font-family: "Lobster", cursive !important;
  font-weight: bolder;
}
</style>

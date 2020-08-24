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

      <v-card class="ma-4 bg-grey"
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
          <div
            v-for="sauce in filterSauces(sauceCateg.name)"
            :key="sauce.id"
          >

          <div class="row mb-4">
            <div class="col-6  col-sm-3">
              <img :src="sauce.image ? sauce.image : '/haruxlogo.png'" class="d-block mx-auto product-table-image" :alt="sauce.name" />
            </div>
            <div class="col-6 col-sm-3 d-flex align-center">
               <router-link
                    tag="div"
                    :to="{name: 'userproduct' , params:{id:sauce.id}}"
                    style="cursor:pointer"
                  >
                    <h2 class="product-name product-sauce-name text-start">{{sauce.name}}</h2>
                  </router-link>
            </div>

            <div class="col-12 col-sm-3 d-flex align-center">
                 <p class="text-start" v-html="sauce.details" ></p>
            </div>

            <div class="col-12 col-sm-3 d-flex align-center">
              <v-layout class="align-center justify-content-center">
                <button class="secondary circleBtn" @click="removeFromCart(sauce.id)">
                  <v-icon class="primary--text">remove</v-icon>
                </button>
                <h2 class="primary--text"
                >{{fetchProductQuantity(sauce.id) ? fetchProductQuantity(sauce.id).quantity : '0'}}</h2>
                <button class="secondary circleBtn" @click="addToCart({productId: sauce.id})">
                  <v-icon class="primary--text">add</v-icon>
                </button>
              </v-layout>
            </div>
          </div>
          <v-divider></v-divider>
          </div>
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

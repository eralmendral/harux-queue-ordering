<template>
  <div>
    <v-container>
      <v-layout column justify-center align-center>
        <v-flex>
          <img :src="product.image" class="product-table-image" :alt="product.name"/>
          <h4 class="text-center my-2 product-name">{{product.name}}</h4>
          <h5 class="text-center my-2 product-price">₱ {{product.price}}</h5>
        </v-flex>
        <v-flex>
          <div class="container">
            <p v-html="product.details"></p>
          </div>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
       <router-link  :to="{name: 'userproducts', params: {category: product.category}}">
              <button class="circleBtn" >
            <v-icon color="white">arrow_back</v-icon>
          </button>
       </router-link>
        </v-flex>
      </v-layout>
    </v-container>
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
</template>

<script>
import { db } from '@/config/firebase'
export default {
  data () {
    return {
      id: '',
      product: {}
    }
  },
  created () {
    this.id = this.$route.params.id
    db.collection('products')
      .doc(this.id)
      .onSnapshot(doc => {
        this.product = doc.data()
      })
  },
  methods: {}
}
</script>

<style>
</style>

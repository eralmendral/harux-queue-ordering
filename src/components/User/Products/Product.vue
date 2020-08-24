<template>
  <div class="mt-100 mb-100">
    <v-container>
      <v-layout column justify-center align-center>
        <v-flex>
          <img :src="product.image" class="product-detail-image img-fluid" :alt="product.name"/>
          <h2 class="text-center my-2 product-detail-name">{{product.name}}</h2>
          <h2 v-if="product.price" class="text-center my-2 product-detail-price">₱ {{product.price}}</h2>
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
          <button class="primary secondary--text pa-2 rounded-circle">
            <v-icon color="white">arrow_back</v-icon>
          </button>
       </router-link>
        </v-flex>
      </v-layout>
    </v-container>
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
.product-detail-image {
  width: 720px;
  height: auto;
}
</style>

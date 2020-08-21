<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-container>
      <v-layout wrap justify-center align-items-center>
        <v-flex>
          <v-card flat class="pa-4">
                <v-layout>
                  <v-flex><img :src="product.image ? product.image : '/haruxlogo.png'" class="product-view-image" :alt="product.name"/></v-flex>
                  <v-flex>
                   <div class="ml-3" style="width: 80%; overflow:scroll" v-if="product.details.length > 25" >
                      <p class="secondary--text" v-html="product.details"></p>
                    </div>
                  </v-flex>
                  </v-layout>
                    <p v-if="product.details.length < 25" v-html="product.details"></p>
                    <h3><b class="ml-1 font-custom secondary--text">{{product.name}}</b></h3>
                    <h3> <b class="ml-1 font-custom secondary--text">{{product.category}}</b></h3>
                    <h3 v-if="product.price"> <b class="ml-1 font-custom secondary--text">₱ {{product.price}}</b></h3>
          </v-card>
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
      categories: [],
      product: {
        image: '',
        name: '',
        category: '',
        price: '',
        status: false,
        details: ''
      },
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/dashboard/#'
        },
        {
          text: 'Products',
          disabled: false,
          to: '/dashboard/products'
        },
        {
          text: 'Info',
          disabled: true
        }
      ]
    }
  },
  beforeRouteEnter (to, from, next) {
    db.collection('products')
      .where('id', '==', to.params.product_id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            vm.product.id = doc.data().id
            vm.product.name = doc.data().name
            vm.product.category = doc.data().category
            vm.product.image = doc.data().image
            vm.product.status = doc.data().status
            vm.product.price = doc.data().price
            vm.product.details = doc.data().details
          })
        })
      })
  },
  methods: {
    getProductTitle () {
      return this.product.name
    }
  },
  created () {
    this.fetchCategories()
  }
}
</script>

<style>
</style>

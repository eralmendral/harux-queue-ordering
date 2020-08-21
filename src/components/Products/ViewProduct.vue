<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-container>
      <v-layout row>
        <v-flex>
          <v-card flat>
            <v-layout row wrap>
              <v-flex xs4>
                <img :src="product.image" alt width="250px" class="ml-4 mt-4"/>
              </v-flex>
              <v-flex justify-center align-baseline xs6 ma-3>
                <h4><small>Name:</small> <span class="ml-4 font-weight primary--text">{{product.name}}</span></h4>
                <h5><small>Category:</small> <span class="ml-4 font-weight secondary--text">{{product.category}}</span></h5>
                <h5><small>Price:</small> <span class="ml-4 font-weight secondary--text">₱.{{product.price}}</span></h5>

                <p>Details:</p>
                <p class="secondary--text" v-html="product.details"></p>
              </v-flex>
            </v-layout>
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

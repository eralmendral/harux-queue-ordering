<template>
  <div class="all-categories-page">
    <v-container fluid>
      <v-layout row flex wrap justify-center align-center>
        <div v-if="canSauce">
          <router-link style="cursor:pointer" tag="div" to="/mainproduct/sauces">
            <img
              :src="sauceCategory.image"
              :alt="sauceCategory.name"
              class="productCategoryButton"
              v-bind:style="{ 'border': '3px solid' + sauceCategory.color  }"
            />
            <h2 class="text-center">{{sauceCategory.name}}</h2>
          </router-link>
        </div>

        <div v-for="categ in categories" :key="categ.name" >
          <div>
            <router-link
              v-if="categ.name != 'Sauce'"
              style="cursor:pointer"
              tag="div"
              :to="{name: 'userproducts', params: {category: categ.name}}"
            >
              <img
                :src="categ.image"
                :alt="categ.image"
                class="productCategoryButton"
                v-bind:style="{ 'border': '3px solid' + categ.color  }"
              />
              <h2 class="text-center">{{categ.name}}</h2>
            </router-link>
          </div>
        </div>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { db } from '@/config/firebase'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      sauceCategory: null,
      categories: []
    }
  },
  methods: {
    fetchSauceCategory () {
      db.collection('categories')
        .where('name', '==', 'Sauce')
        .onSnapshot(snapshot => {
          this.sauceCategory = null
          snapshot.forEach(doc => {
            this.sauceCategory = doc.data()
          })
        })
    },
    fetchCategories () {
      db.collection('categories')
        .where('status', '==', true)
        .onSnapshot(snapshot => {
          this.categories = []
          snapshot.forEach(doc => {
            this.categories.push(doc.data())
          })
        })
    }
  },
  created () {
    this.fetchSauceCategory()
    this.fetchCategories()
  },
  computed: {
    ...mapGetters(['canSauce'])
  }
}
</script>

<style>
.all-categories-page{
  margin-top: 10%;
}
</style>

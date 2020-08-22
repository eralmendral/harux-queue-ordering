<template>
  <div>
    <v-container fluid>
      <v-layout row flex wrap justify-center align-center>
        <div v-if="canSauce">
            <router-link tag="div" to="/mainproduct/sauces">
              <img
                :src="sauceCategory.image"
                :alt="sauceCategory.name"
                class="productCategoryButton"
                v-bind:style="{ 'border': '3px solid' + sauceCategory.color  }"
              />
              <h2 class="text-center">{{sauceCategory.name}}</h2>
            </router-link>
        </div>

        <div v-for="categ in categories" :key="categ.name">
            <router-link
              v-if="categ.name != 'Sauce'"
              tag="div"
              :to="{name: 'userproducts', params: {category: categ.name}}"
            >
              <img
                :src="categ.image"
                :alt="categ.name"
                class="productCategoryButton"
                v-bind:style="{ 'border': '3px solid' + categ.color  }"
              />
              <h2 class="text-center">{{categ.name}}</h2>
            </router-link>
        </div>

        <router-link to="/">
          <v-btn class="productCategoryButton moreCategoryButton primary mb-5" to="/allcategories">
            <h2>More</h2>
          </v-btn>
        </router-link>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { db } from '@/config/firebase'
export default {
  data () {
    return {
      sauceCategory: null
    }
  },
  props: {
    categories: Array
  },
  methods: {
    fetchSauceCategory () {
      db.collection('categories')
        .where('name', '==', 'Sauce')
        .onSnapshot(snapshot => {
          snapshot.forEach(doc => {
            this.sauceCategory = doc.data()
          })
        })
    }
  },
  created () {
    this.fetchSauceCategory()
  },
  computed: {
    ...mapGetters(['tableProfile', 'canSauce'])
  }
}
</script>

<style>
.productCategoryButton {
  border-radius: 50%;
  width: 180px;
  height: 180px;
  cursor: pointer;
  transition: all .4s ease;
}

.productCategoryButton:hover {
   box-shadow: 0 0 10px #b1581c;
}

.moreCategoryButton {
  border: 3px solid #422009 !important;
}

.categ_title {
  font-size: 20px;
  color: #422009 !important;
  font-weight: bold;
  margin: 10px;

}
</style>

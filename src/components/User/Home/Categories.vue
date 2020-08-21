<template>
  <div>
    <v-container fluid>
      <v-layout row flex wrap justify-center align-center>

        <div v-if="canSauce">
            <router-link style="cursor:pointer" tag="div" to="/mainproduct/sauces">
              <img
                :src="sauceCategory.image"
                :alt="sauceCategory.name"
                v-bind:style="{ 'border': '3px solid' + sauceCategory.color  }"
                class="category_box_image"
              />
              <h3 class="mr-1 text-center categ_title ">{{sauceCategory.name}}</h3>
            </router-link>
        </div>

        <div v-for="categ in categories" :key="categ.name">
          <div>
            <router-link
              v-if="categ.name != 'Sauce'"
              style="cursor:pointer"
              tag="div"
              :to="{name: 'userproducts', params: {category: categ.name}}"
            >
              <img
                :src="categ.image"
                alt
                class="category_box_image"
                v-bind:style="{ 'border': '3px solid' + categ.color  }"
              />
              <h3 class="mr-1 text-center categ_title">{{categ.name}}</h3>
            </router-link>
          </div>
        </div>

        <div>
          <router-link style="cursor:pointer" tag="div" to="/">
            <v-btn class="more_categ " to="/allcategories">
              <span>More</span>
            </v-btn>
          </router-link>
        </div>
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
.category_box_image {
  border-radius: 50%;
  width: 120px;
  height: 120px;
}

.more_categ {
  width: 120px;
  height: 120px;
  border-radius: 50%;
   background: #ddae6a !important;
  color: #261c1d !important;

  margin-bottom: 40px !important;

  font-size: 24px;
  font-family: "Montserrat" !important;
}

.categ_title {
  font-size: 20px;
  color: #422009 !important;
  font-weight: bold;
  margin: 10px;

}
</style>

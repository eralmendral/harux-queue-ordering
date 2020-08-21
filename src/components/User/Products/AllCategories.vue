<template>
  <div class="mt-3">
    <v-container fluid>
      <v-layout row flex wrap justify-center align-center>
        <div v-if="canSauce">
          <router-link style="cursor:pointer" tag="div" to="/mainproduct/sauces">
            <img
              :src="sauceCategory.image"
              :alt="sauceCategory.name"
              v-bind:style="{ 'border': '3px solid' + sauceCategory.color  }"
              class="category_box_image mx-3"
            />
            <h3 class="mr-1 text-center categ_title">{{sauceCategory.name}}</h3>
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
                alt
                class="category_box_image mx-3"
                v-bind:style="{ 'border': '3px solid' + categ.color  }"
                style="box-shadow: 0px 3px 3px black"
                
              />
              <h3 class="mr-1 text-center categ_title">{{categ.name}}</h3>
            </router-link>
          </div>
        </div>
      </v-layout>
    </v-container>

    <br>
    <br>
    <br>
    <br>
  </div>
</template>

<script>
import { fb, db } from "@/config/firebase";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      sauceCategory: null,
      categories: []
    };
  },
  methods: {
    fetchSauceCategory() {
      db.collection("categories")
        .where("name", "==", "Sauce")
        .onSnapshot(snapshot => {
          this.sauceCategory = null;
          snapshot.forEach(doc => {
            this.sauceCategory = doc.data();
          });
        });
    },
    fetchCategories() {
      db.collection("categories")
        .where("status", "==", true)
        .onSnapshot(snapshot => {
          this.categories = [];
          snapshot.forEach(doc => {
            this.categories.push(doc.data());
          });
        });
    }
  },
  created() {
    this.fetchSauceCategory();
    this.fetchCategories();
  },
  computed: {
    ...mapGetters(["canSauce"])
  }
};
</script>

<style>
</style>

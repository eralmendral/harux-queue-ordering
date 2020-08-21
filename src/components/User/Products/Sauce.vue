<template>
  <div>
    <div v-if="loading">Loading....</div>
    <div v-else>
      <div class="text-xs-center mt-4">
        <h3 class="primary--text text--darken-2">Sauces</h3>
      </div>

      <div class="text-xs-center" v-if="fetchCart.length > 0">
        <v-btn
          large
          fixed
          bottom
          style="margin-bottom: 80px; z-index:999"
          right
          depressed
          @click="confirmTheseOrder()"
          class="stdBtn secondary--text"
        >Confirm Order</v-btn>
      </div>

      <v-card
        class="my-1"
        flat
        style="background: #f1f1f1"
        v-for="sauceCateg in sauceCategories"
        :key="sauceCateg.id"
      >
        <h3 class="text-xs-center pt-3 sauceTitle" v-bind:style="{ 'color':  sauceCateg.color  }">
          <small>****</small>
          {{sauceCateg.name}}
          <small>****</small>
        </h3>

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
            <!-- disabled if 0 -->
            <v-flex >
                  <router-link :to="{name: 'userproduct' , params:{id:sauce.id}}">
                    <img :src="sauce.image" :alt="sauce.name" class="product_img d-block mx-auto" />
                  </router-link>
                  <router-link
                    tag="div"
                    :to="{name: 'userproduct' , params:{id:sauce.id}}"
                    style="cursor:pointer"
                  >
                    <h5 class="ml-3 sauce_title text-center" style="color:#261c1d !important;">{{sauce.name}}</h5>
                  </router-link>
            </v-flex>

            <v-flex xs4>
              <p v-html="sauce.details" class="mt-3"></p>
            </v-flex>

            <v-flex xs4>
              <v-layout class="justify-center align-center">
                <button class="circleBtn" @click="removeFromCart(sauce.id)">
                  <v-icon class="primary--text">remove</v-icon>
                </button>

                <h3
                  class="primary--text"
                >{{fetchProductQuantity(sauce.id) ? fetchProductQuantity(sauce.id).quantity : '0'}}</h3>
                <button class="circleBtn" @click="addToCart({productId: sauce.id})">
                  <v-icon class="primary--text">add</v-icon>
                </button>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>

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
  </div>
</template>

<script>
import { fb, db } from "@/config/firebase";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      loading: false,
      title: "Products",
      category: "",
      sauceCategories: [],
      sauces: []
    };
  },
  methods: {
    ...mapActions([
      "setProducts",
      "addToCart",
      "removeFromCart",
      "deleteFromCart",
      "confirmOrder"
    ]),
    fetchSauceCategories() {
      db.collection("saucecategories").onSnapshot(snapshot => {
        this.sauceCategories = [];
        snapshot.forEach(doc => {
          this.sauceCategories.push(doc.data());
        });
      });
    },
    fetchSauce() {
      db.collection("products")
        .where("category", "==", "Sauce")
        .where('status', '==','available')
        .onSnapshot(snapshot => {
          this.sauces = [];
          snapshot.forEach(doc => {
            this.sauces.push(doc.data());
          });
        });
    },
    filterSauces(subcategory) {
      return this.sauces.filter(s => s.subcategory === subcategory);
    },
    confirmTheseOrder() {
      this.confirmOrder();
      this.$router.push("/");
    }
  },
  created() {
    this.setProducts("Sauce");
    this.fetchSauceCategories();
    this.fetchSauce();
  },
  computed: {
    ...mapGetters([
      "fetchProducts",
      "fetchCart",
      "cartSize",
      "cartTotalAmount",
      "fetchProductQuantity"
    ])
  }
};
</script>

<style>
.sauceTitle {
  font-family: "Lobster", cursive !important;
  font-weight: bolder;
}
</style>

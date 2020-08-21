<template>
  <div>
    <div v-if="loading">Loading....</div>
    <div v-else>
      <div class="text-xs-center my-4">
        <h3 class="primary--text text--darken-2">Chicken Menu</h3>

        <h3
          class="primary--text text--darken-2"
          v-show="1!=1"
        >Selected Products: {{selectedProducts.unliItems}}</h3>
        <h3
          class="primary--text text--darken-2"
          v-show="1!=1"
        >Order Array: {{selectedProducts.orderUnliArr}}</h3>
      </div>

      <!-- unli here -->
      <v-card flat class="pa-3">
        <div v-for="product in fetchUnliChickens()" :key="product.id">
          <v-layout row wrap justify-center align-center class="ma-3">
            <v-flex xs2>
              <input
                :disabled="selectedProducts.items.length > 0"
                type="checkbox"
                class="product_checkbox"
                v-model="selectedProducts.unliItems"
                v-bind:value="product"
                @change="addProductFlavor"
                color="brown"
              />
            </v-flex>

            <v-flex xs4>
              <router-link :to="{name: 'userproduct' , params:{id:product.id}}">
                <img :src="product.image" class="product_img_large" alt="product image" />
              </router-link>
            </v-flex>

            <v-flex xs6>
              <router-link
                tag="div"
                :to="{name: 'userproduct' , params:{id:product.id}}"
                style="cursor:pointer"
              >
                <h3 class="font-weight-bold">{{product.name}}</h3>
              </router-link>
              <p>( {{product.subdetails}} )</p>
            </v-flex>
          </v-layout>

          <v-container>
            <v-layout row justify-space-around align-center v-if="check_id_inArray(product.id)">
              <v-flex xs4>
                <h3 class="my-2">Adult -- ₱ {{product.price}}</h3>
                <br />
                <h3 class="my-2">
                  Kid
                  <small>( 5-9 y/o )</small>
                  -- ₱ {{product.price_kid}}
                </h3>
              </v-flex>

              <v-flex>
                <v-layout class="justify-center align-center my-1">
                  <button
                    class="circleBtn"
                    :class="{ disabledBtn: !findSelectedProduct(product.id).adultQty || findSelectedProduct(product.id).adultQty < 1}"
                    :disabled="!findSelectedProduct(product.id).adultQty || findSelectedProduct(product.id).adultQty < 1"
                    @click="subAdultQty(product.id)"
                  >
                    <v-icon class="primary--text">remove</v-icon>
                  </button>
                  <h3>{{findSelectedProduct(product.id).adultQty ? findSelectedProduct(product.id).adultQty : 0}}</h3>
                  <button class="circleBtn" @click="addAdultQty(product.id)">
                    <v-icon class="primary--text">add</v-icon>
                  </button>
                </v-layout>

                <v-layout class="justify-center align-center my-1">
                  <button
                    class="circleBtn"
                    :class="{ disabledBtn: !findSelectedProduct(product.id).kidQty || findSelectedProduct(product.id).kidQty < 1}"
                    :disabled="!findSelectedProduct(product.id).kidQty || findSelectedProduct(product.id).kidQty < 1"
                    @click="subKidQty(product.id)"
                  >
                    <v-icon class="primary--text">remove</v-icon>
                  </button>

                  <h3
                    class
                  >{{findSelectedProduct(product.id).kidQty ? findSelectedProduct(product.id).kidQty : 0}}</h3>
                  <button class="circleBtn" @click="addKidQty(product.id)">
                    <v-icon class="primary--text">add</v-icon>
                  </button>
                </v-layout>
              </v-flex>

              <v-flex xs2>
                <h4 class v-if="check_id_inArray(product.id)">Total</h4>
                <v-chip class="primary white--text pa-2">
                  <h4 class="text-center">{{totalPrice_adultkid(product.id)}}</h4>
                </v-chip>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
        <div></div>
      </v-card>

      <br />
      <!-- <v-flex>
            <p class="card-text ma-3 brown--text">
              Adult
              <b>adu. {{product.price}}</b>
            </p>
          </v-flex>

          <v-flex>
            <v-layout class="justify-center align-center">
              <v-btn fab small class="stdBtn" @click="removeFromCart(product.id)">
                <v-icon>remove</v-icon>
              </v-btn>
              <h3
                class
              >{{fetchProductQuantity(product.id) ? fetchProductQuantity(product.id).quantity : '0'}}</h3>
              <v-btn small fab class="stdBtn" @click="addToCart({productId: product.id})">
                <v-icon>add</v-icon>
              </v-btn>
            </v-layout>
      </v-flex>-->

      <!-- Pick your sauce -->
      <v-layout
        justify-center
        v-if="selectedProducts.items.length > 0 || selectedProducts.unliItems.length > 0"
      >
        <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <template v-slot:activator="{ on }">
            <v-btn
              class="white--text stdBtn"
              v-on="on"
              style="position: fixed; bottom: 15%;right: 5%;"
            >
              <span class="secondary--text">Pick your Sauce</span>
            </v-btn>
          </template>


          <v-card style="padding-bottom: 25% !important">
            <v-card-title>
              <h5 class="text-center">
                You can choose:
                <v-chip class="pink white--text">
                  <h5
                    class="mt-1"
                  >{{selectedProducts.flavor == 0 ? 'unlimited' : selectedProducts.flavor}}</h5>
                </v-chip>flavors
              </h5>
            </v-card-title>

            <v-card-text style="">
              <v-card class="my-1" flat v-for="sauceCateg in sauceCategories" :key="sauceCateg.id">
                <h3
                  class="text-xs-center pt-3 sauceTitle"
                  v-bind:style="{ 'color':  sauceCateg.color  }"
                >
                  <small>****</small>
                  {{sauceCateg.name}}
                  <small>****</small>
                </h3>
                <br />
                <v-layout
                  flex
                  row
                  align-center
                  justify-space-around
                  v-for="sauce in filterSauces(sauceCateg.name)"
                  :key="sauce.id"
                  class="my-2"
                >
                  <!-- disabled if 0 -->
                  <v-flex >
                    <img :src="sauce.image" :alt="sauce.name" class="product_img d-block mx-auto" />
                
                
                    <h4 class="ml-3 sauce_title text-center" style="color:#261c1d !important;">{{sauce.name}}</h4>
                  </v-flex>

                  <v-flex xs4>
                    <p v-html="sauce.details" class="mt-3 "></p>
                  </v-flex>

                  <v-flex xs4>
                    <v-layout row justify-center align-center>
                      <button
                        class="circleBtn"
                        :class="{ disabledBtn: sauceNoQty(sauce.id) || checkSelectedSauceLength()}"
                        @click="removeSauce(sauce.id)"
                        :disabled="sauceNoQty(sauce.id)"
                      >
                        <v-icon class="primary--text">remove</v-icon>
                      </button>

                      <h3>{{fetchSauceQuantity(sauce.id) ? fetchSauceQuantity(sauce.id).quantity : '0'}}</h3>

                      <button
                        class="circleBtn"
                        :class="{ disabledBtn:  checkSelectedSauceLength()}"
                        :disabled="checkSelectedSauceLength()"
                        @click="addSauce(sauce.id)"
                      >
                        <v-icon class="primary--text">add</v-icon>
                      </button>
                    </v-layout>
                  </v-flex>
                </v-layout>

                
              </v-card>

                 
              
            </v-card-text>

            <v-card-actions>
              <v-btn fab fixed top right class="red white--text" text @click="dialog = false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-btn
                fixed
                bottom
                right
                style="margin-bottom: 15%"
                v-if="selectedProducts.flavor > 0"
                class="stdBtn secondary--text"
                @click="confirmChickenOrder()"
              >Confirm Order</v-btn>
              <v-btn
                v-else
                fixed
                bottom
                style="margin-bottom: 15%"
                right
                class="stdBtn secondary--text"
                @click="confirmUnliChickenOrder()"
              >Confirm Order</v-btn>
            </v-card-actions>
          
          </v-card>


            
        </v-dialog>

      </v-layout>

      <v-container v-if="1==1">
        <div v-for="product in fetchChickens()" :key="product.id">
          <v-layout row wrap flex justify-center align-center class="ma-3">
            <v-flex xs2>
              <input
                :disabled="selectedProducts.unliItems.length > 0"
                type="checkbox"
                class="product_checkbox"
                v-model="selectedProducts.items"
                v-bind:value="product"
                @change="addProductFlavor"
                color="brown"
              />
            </v-flex>

            <v-flex xs4>
              <router-link :to="{name: 'userproduct' , params:{id:product.id}}">
                <img :src="product.image" class="product_img_large" alt="product image" />
              </router-link>
            </v-flex>

            <v-flex xs4>
              <router-link
                tag="div"
                :to="{name: 'userproduct' , params:{id:product.id}}"
                style="cursor:pointer"
              >
                <h3 class="text--darken-2 font-weight-bold">{{product.name}}</h3>
              </router-link>
              <b class="pink--text">{{product.flavor}} Sauces</b>
            </v-flex>

            <v-flex xs2>
              <h5 class="font-weight-bold">₱ {{product.price}}</h5>
            </v-flex>

            <v-flex>
              <v-layout class="justify-center align-center">
                <!-- <v-btn
                fab
                small
                color="pink"
                :class="inCartQuantity ? 'btn-success' :  'btn-danger'"
                @click="removeFromCart(product.id)"
              >
                <v-icon>remove</v-icon>
              </v-btn>
              <h3
                class
              >{{fetchProductQuantity(product.id) ? fetchProductQuantity(product.id).quantity : '0'}}</h3>
              <v-btn small fab color="pink" @click="addToCart({productId: product.id})">
                <v-icon>add</v-icon>
                </v-btn>-->
              </v-layout>
            </v-flex>
          </v-layout>
          <hr />
        </div>
      </v-container>
    </div>

    <div
      class="fixed"
      v-if="selectedProducts.items.length > 0"
      style="background: #f2f2f2; border: 1px solid #cb7a43;padding: 0px 10px;width: 140px; height: 80px; position: fixed;  bottom: 16%;left: 5%; box-shadow: 0px 0px 7px #261c1d"
    >
      <v-radio-group v-model="selectedProducts.type">
        <v-flex>
          <v-radio label="Dine in" color="brown darken-3" value="Dine"></v-radio>
        </v-flex>
        <v-flex>
          <v-radio label="Take out" color="brown darken-3" value="Take"></v-radio>
        </v-flex>
      </v-radio-group>
      <br />
    </div>

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
import { fb, db } from "@/config/firebase";
import { mapState, mapGetters, mapActions } from "vuex";
import Swal from "sweetalert2";
import { uuid } from "vue-uuid";

export default {
  data() {
    return {
      loading: false,
      dialog: false,
      title: "Products",
      category: "",
      chickenProducts: [],
      unliChickenProducts: [],
      sauceCategories: [],
      sauces: [],
      unliItemsId: [],
      selectedProducts: {
        items: [],
        unliItems: [],
        orderUnliArr: [],
        flavor: null,
        sauces: [],
        type: "Dine",
        adult: {
          qty: 0,
          price: 0
        },
        kid: {
          qty: 0,
          price: 0
        }
      },

      maxFlavor: 0
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
    sauceNoQty(sauceId) {
      let sauceProduct = this.selectedProducts.sauces.find(
        sauce => sauce.id === sauceId
      );
      if (sauceProduct) {
        return false;
      } else {
        return true;
      }
    },
    totalPrice_adultkid(id) {
      if (this.findSelectedProduct(id)) {
        var adult_total_price = this.findSelectedProduct(id).total_price_adult
          ? this.findSelectedProduct(id).total_price_adult
          : 0;
        var kid_total_price = this.findSelectedProduct(id).total_price_kid
          ? this.findSelectedProduct(id).total_price_kid
          : 0;
        var total_price = adult_total_price + kid_total_price;
        return total_price;
      }
    },
    push_unli_items_ids() {
      //check unli product to see if it is added to selectedproducts.unliItem, if yes display its buttons
      // return false;
      this.unliItemsId = [];
      this.selectedProducts.unliItems.forEach(item => {
       
        this.unliItemsId.push(item.id);
      });
    },
    findSelectedProduct(id) {
      if (this.unliItemsId.includes(id)) {
        var items = this.selectedProducts.unliItems;
        var foundindex = items.findIndex(x => x.id === id);
        return this.selectedProducts.unliItems[foundindex];
      }
    },
    addAdultQty(id) {
      // increment quantity of adults individually
      var items = this.selectedProducts.unliItems;
      var foundindex = items.findIndex(x => x.id === id);

      var itemArr = items[foundindex];
      if ("adultQty" in itemArr) {
        this.selectedProducts.unliItems[foundindex].adultQty += 1;
      } else {
        this.selectedProducts.unliItems[foundindex].adultQty = 1;
      }

      // total of adult price
      this.selectedProducts.unliItems[foundindex].total_price_adult =
        this.selectedProducts.unliItems[foundindex].price *
        this.selectedProducts.unliItems[foundindex].adultQty;

      //update total price of these order
      if ("total_price_kid" in this.selectedProducts.unliItems[foundindex]) {
        this.selectedProducts.unliItems[foundindex].total_price =
          this.selectedProducts.unliItems[foundindex].total_price_adult +
          this.selectedProducts.unliItems[foundindex].total_price_kid;
      } else {
        this.selectedProducts.unliItems[
          foundindex
        ].total_price = this.selectedProducts.unliItems[
          foundindex
        ].total_price_adult;
      }

      //push to order unli, A HACK TO UPDATE THIS.SELECTEDPRODUCTS.UNLIITEMS
      this.selectedProducts.orderUnliArr.pop(
        this.selectedProducts.unliItems[foundindex]
      );
    },
    subAdultQty(id) {
      // increment quantity of adults individually
      var items = this.selectedProducts.unliItems;
      var foundindex = items.findIndex(x => x.id === id);

      var itemArr = items[foundindex];
      if ("adultQty" in itemArr) {
        if (itemArr.adultQty > 0) {
          this.selectedProducts.unliItems[foundindex].adultQty -= 1;
        }
      }

      this.selectedProducts.unliItems[foundindex].total_price_adult =
        this.selectedProducts.unliItems[foundindex].price *
        this.selectedProducts.unliItems[foundindex].adultQty;
      //push to order unli, A HACK TO UPDATE THIS.SELECTEDPRODUCTS.UNLIITEMS
      this.selectedProducts.orderUnliArr.pop(
        this.selectedProducts.unliItems[foundindex]
      );

      //update total price of these order
      if ("total_price_kid" in this.selectedProducts.unliItems[foundindex]) {
        this.selectedProducts.unliItems[foundindex].total_price =
          this.selectedProducts.unliItems[foundindex].total_price_adult +
          this.selectedProducts.unliItems[foundindex].total_price_kid;
      } else {
        this.selectedProducts.unliItems[
          foundindex
        ].total_price = this.selectedProducts.unliItems[
          foundindex
        ].total_price_adult;
      }
    },
    addKidQty(id) {
      // increment quantity of adults individually
      var items = this.selectedProducts.unliItems;
      var foundindex = items.findIndex(x => x.id === id);

      var itemArr = items[foundindex];
      if ("kidQty" in itemArr) {
        this.selectedProducts.unliItems[foundindex].kidQty += 1;
      } else {
        this.selectedProducts.unliItems[foundindex].kidQty = 1;
      }

      this.selectedProducts.unliItems[foundindex].total_price_kid =
        this.selectedProducts.unliItems[foundindex].price_kid *
        this.selectedProducts.unliItems[foundindex].kidQty;
      //push to order unli, A HACK TO UPDATE THIS.SELECTEDPRODUCTS.UNLIITEMS
      this.selectedProducts.orderUnliArr.pop(
        this.selectedProducts.unliItems[foundindex]
      );

      //update total price of these order
      if ("total_price_adult" in this.selectedProducts.unliItems[foundindex]) {
        this.selectedProducts.unliItems[foundindex].total_price =
          this.selectedProducts.unliItems[foundindex].total_price_adult +
          this.selectedProducts.unliItems[foundindex].total_price_kid;
      } else {
        this.selectedProducts.unliItems[
          foundindex
        ].total_price = this.selectedProducts.unliItems[
          foundindex
        ].total_price_kid;
      }
    },
    subKidQty(id) {
      // increment quantity of adults individually
      var items = this.selectedProducts.unliItems;
      var foundindex = items.findIndex(x => x.id === id);

      var itemArr = items[foundindex];
      if ("kidQty" in itemArr) {
        if (itemArr.kidQty > 0) {
          this.selectedProducts.unliItems[foundindex].kidQty -= 1;
        }
      }

      this.selectedProducts.unliItems[foundindex].total_price_kid =
        this.selectedProducts.unliItems[foundindex].price_kid *
        this.selectedProducts.unliItems[foundindex].kidQty;
      //push to order unli, A HACK TO UPDATE THIS.SELECTEDPRODUCTS.UNLIITEMS
      this.selectedProducts.orderUnliArr.pop(
        this.selectedProducts.unliItems[foundindex]
      );

      //update total price of these order
      if ("total_price_adult" in this.selectedProducts.unliItems[foundindex]) {
        this.selectedProducts.unliItems[foundindex].total_price =
          this.selectedProducts.unliItems[foundindex].total_price_adult +
          this.selectedProducts.unliItems[foundindex].total_price_kid;
      } else {
        this.selectedProducts.unliItems[
          foundindex
        ].total_price = this.selectedProducts.unliItems[
          foundindex
        ].total_price_kid;
      }
    },
    check_id_inArray(id) {
      return this.unliItemsId.includes(id);
    },
    addSauce(sauceId) {
      //find the sauce in the sauces list
      let sauce = this.sauces.find(sauce => sauce.id === sauceId);

      // //find the sauce in the selectedproduct.sauces
      let sauceProduct = this.selectedProducts.sauces.find(
        sauce => sauce.id === sauceId
      );

      if (sauceProduct) {
        //product already present in the cart. so increase the quantity
        sauceProduct.quantity++;
      } else {
        this.selectedProducts.sauces.push({
          // sauce newly added to selectedPrduc
          ...sauce,
          quantity: 1
        });
      }
    },
    removeSauce(sauceId) {
      let sauceProduct = this.selectedProducts.sauces.find(
        sauce => sauce.id === sauceId
      );

      if (sauceProduct.quantity && sauceProduct.quantity > 1) {
        sauceProduct.quantity--;
      } else if (sauceProduct.quantity && sauceProduct.quantity == 1) {
        let sauceProductIndex = this.selectedProducts.sauces.findIndex(
          sauce => sauce.id === sauceId
        );

        this.selectedProducts.sauces.splice(sauceProductIndex, 1);
      } else {
        return false;
      }
    },
    fetchSauceQuantity(id) {
      if (this.selectedProducts.sauces.find(sauce => sauce.id === id)) {
        return this.selectedProducts.sauces.find(sauce => sauce.id === id);
        // return "yes"
      }
    },
    fetchChickens() {
      return this.chickenProducts.filter(p => p.unli === false);
    },
    fetchUnliChickens() {
      return this.chickenProducts.filter(p => p.unli === true);
    },
    fetchSauceCategories() {
      db.collection("saucecategories")
        .where("status", "==", true)
        .onSnapshot(snapshot => {
          this.sauceCategories = [];
          snapshot.forEach(doc => {
            this.sauceCategories.push(doc.data());
          });
        });
    },
    fetchSauces() {
      db.collection("products")
        .where("category", "==", "Sauce")
        .where("status", "==", "available")
        .onSnapshot(snapshot => {
          this.sauces = [];
          snapshot.forEach(doc => {
            this.sauces.push(doc.data());
          });
        });
    },
    filterSauces(subcategory) {
      return this.sauces.filter(s => s.subcategory === subcategory);
      // return this.sauces;
    },
    checkSelectedSauceLength() {
      //no longer the length of selectedproducts but the quantity of each sauce in the selected products

      // check length of selectedProducts.flavor
      // loop through sauces and add their overall quantity
      // if flavor and overall quantity is equal , return true
      let flavorsLen = parseInt(this.selectedProducts.flavor);

      if (this.selectedProducts.sauces.length > 0) {
        let saucesArray = this.selectedProducts.sauces;

        let aqty = 0;
        saucesArray.forEach(s => {
          aqty += parseInt(s.quantity);
        });

        if (aqty == flavorsLen) {
          return true;
        } else {
          return false;
        }
      }
    },
    addProductFlavor() {
      let temp = 0;
      let flavors = this.selectedProducts.items.forEach(el => {
        temp += el.flavor;
      });
      this.selectedProducts.flavor = temp;
      this.push_unli_items_ids(); //pushed id of product to unli_items_ids -> for conditionally showing add and remove buttons
    },
    confirmUnliChickenOrder() {
      var order_num = new Date()
        .toISOString()
        .substr(0, 19)
        .replace("T", ":")
        .replace("-", ":")
        .replace("-", ":");

      let order = {};
      order.table_number = this.tableProfile.table_number;
      order.orders = [];
      order.chickens = this.selectedProducts.unliItems;
      order.sauces = this.selectedProducts.sauces;

      order.order_number = order_num;
      order.status = "pending";
      order.time = new Date();

      let totalPrice = null;

      let chickens = order.chickens;
      chickens.forEach(el => {
        totalPrice += el.total_price;
      });

      order.total_price = totalPrice; //getters.cartTotalAmount; // *

      let ref = db.collection("orders").doc();

      ref
        .set({
          id: ref.id,
          ...order
        })
        .then(() => {
          Swal.fire({
            type: "success",
            title: "Order Confirmed",
            showConfirmButton: false,
            timer: 1500
          });
          this.selectedProducts.unliItems = [];
          this.selectedProducts.flavor = null;
          this.selectedProducts.sauces = [];
          this.selectedProducts.type = "Dine";
          this.dialog = false;

          this.$router.push("/");
        });

      //push order number to user profile
      let userref = db.collection("users").doc(this.tableProfile.id);

      userref.get().then(doc => {
        var orders = doc.data().orders;
        var newOrder = [...orders, order.order_number];
        var user = doc.data();
        user.orders = newOrder;
        user.sauce = true;
        //update profile sauce status to true , if one of the product has category chicken

        // state.cart.forEach(res => {
        //   if (res.category == "Chicken") {
        //     user.sauce = true;
        //   }
        // });

        db.collection("users")
          .doc(this.tableProfile.id)
          .set({
            ...user
          });
      });
    },
    confirmChickenOrder() {
      // add to order the items,
      // new schema to order
      // new display schema to orders
      // order total price, items[] overall price
      /*
       order_id
      -ordernumber
      -ordertime
      -table_no
     
      - items [] 
       - type - dineine ? takeout?
       
       -sauces []
       -status = 
       - total cost

          let order = {};
    order.table_number = profile.table_number;
    order.orders = state.cart;
    order.order_number = uuid.v1();
    order.status = "pending";
    order.time = new Date();
    order.total_price = getters.cartTotalAmount;

      */

     var order_num = new Date()
        .toISOString()
        .substr(0, 19)
        .replace("T", ":")
        .replace("-", ":")
        .replace("-", ":");

      let order = {};
      order.table_number = this.tableProfile.table_number;
      order.orders = [];
      order.chickens = this.selectedProducts.items;
      order.sauces = this.selectedProducts.sauces;
      order.type = this.selectedProducts.type;
      order.order_number = order_num;
      order.status = "pending";
      order.time = new Date();

      let totalPrice = null;
      let chickens = order.chickens;
      chickens.forEach(el => {
        totalPrice += parseInt(el.price);
      });

      order.total_price = totalPrice; //getters.cartTotalAmount; // *

      let ref = db.collection("orders").doc();

      ref
        .set({
          id: ref.id,
          ...order
        })
        .then(() => {
          Swal.fire({
            type: "success",
            title: "Order Confirmed",
            showConfirmButton: false,
            timer: 1500
          });
          this.selectedProducts.items = [];
          this.selectedProducts.flavor = null;
          this.selectedProducts.sauces = [];
          this.selectedProducts.type = "Dine";
          this.dialog = false;

          this.$router.push("/");
        });

      //push order number to user profile
      let userref = db.collection("users").doc(this.tableProfile.id);

      userref.get().then(doc => {
        var orders = doc.data().orders;
        var newOrder = [...orders, order.order_number];
        var user = doc.data();
        user.orders = newOrder;
        user.sauce = true;
        //update profile sauce status to true , if one of the product has category chicken

        // state.cart.forEach(res => {
        //   if (res.category == "Chicken") {
        //     user.sauce = true;
        //   }
        // });

        db.collection("users")
          .doc(this.tableProfile.id)
          .set({
            ...user
          });
      });
    }
  },
  created() {
    db.collection("products")
      .where("category", "==", "Chicken")
      .where("status", "==", "available")
      .onSnapshot(snapshot => {
        this.chickenProducts = [];

        this.selectedProducts.items = [];
        this.selectedProducts.flavor = null;
        this.selectedProducts.sauces = [];
        this.selectedProducts.type = "Dine";
        this.dialog = false;

        snapshot.forEach(doc => {
          this.chickenProducts.push(doc.data());
        });
      });

    this.fetchSauceCategories();
    this.fetchSauces();
  },
  computed: {
    ...mapGetters([
      "fetchCart",
      "cartSize",
      "cartTotalAmount",
      "fetchProductQuantity",
      "tableProfile"
    ])
  }
};
</script>

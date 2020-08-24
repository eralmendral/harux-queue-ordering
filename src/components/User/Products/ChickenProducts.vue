<template>
  <div class="mt-100 mb-150">
    <div v-if="loading">Loading....</div>
    <div v-else>

      <div class="text-xs-center">
        <h2 class="primary--text text--darken-2">Chickens</h2>
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
     <v-container>
        <v-card flat class="bg-grey pa-5">
        <div v-for="product in fetchUnliChickens()" :key="product.id">
          <v-layout row wrap justify-center align-center>
            <v-flex>
              <input
                v-if="selectedProducts.items.length < 1"
                type="checkbox"
                class="product_checkbox"
                v-model="selectedProducts.unliItems"
                v-bind:value="product"
                @change="addProductFlavor"
                color="brown"
              />
            </v-flex>

            <v-flex>
              <router-link :to="{name: 'userproduct' , params:{id:product.id}}">
                <img :src="product.image ? product.image : '/haruxlogo.png'" class="product-table-image" :alt="product.name" />
              </router-link>
            </v-flex>

            <v-flex>
              <router-link
                tag="div"
                :to="{name: 'userproduct' , params:{id:product.id}}"
                style="cursor:pointer"
              >
                <h2>{{product.name}}</h2>
              </router-link>
              <b>( {{product.subdetails}} )</b>
            </v-flex>
          </v-layout>

          <v-container>
            <v-layout row align-center v-if="check_id_inArray(product.id)">
              <v-flex justify-end>
                <h2 class="my-2">Adult  ₱ {{product.price}}</h2>
                <h2 class="my-2">Kid<small>( 5-9 y/o )</small> ₱ {{product.price_kid}}</h2>
              </v-flex>

              <v-flex>
                <v-layout class="justify-center align-center my-1">
                  <h3 hidden='true'>Order Array: {{selectedProducts.orderUnliArr}}</h3>
                  <button
                    class="circleBtn secondary"
                    :class="{ disabledBtn: !findSelectedProduct(product.id).adultQty || findSelectedProduct(product.id).adultQty < 1}"
                    :disabled="!findSelectedProduct(product.id).adultQty || findSelectedProduct(product.id).adultQty < 1"
                    @click="subAdultQty(product.id)"
                  >
                    <v-icon class="primary--text">remove</v-icon>
                  </button>
                  <h2>{{findSelectedProduct(product.id).adultQty ? findSelectedProduct(product.id).adultQty : 0}}</h2>
                  <button class="circleBtn secondary" @click="addAdultQty(product.id)">
                    <v-icon class="primary--text">add</v-icon>
                  </button>
                </v-layout>

                <v-layout class="justify-center align-center my-1">
                  <button
                    class="circleBtn secondary"
                    :class="{ disabledBtn: !findSelectedProduct(product.id).kidQty || findSelectedProduct(product.id).kidQty < 1}"
                    :disabled="!findSelectedProduct(product.id).kidQty || findSelectedProduct(product.id).kidQty < 1"
                    @click="subKidQty(product.id)"
                  >
                    <v-icon class="primary--text">remove</v-icon>
                  </button>
                  <h2>{{findSelectedProduct(product.id).kidQty ? findSelectedProduct(product.id).kidQty : 0}}</h2>
                  <button class="circleBtn secondary" @click="addKidQty(product.id)">
                    <v-icon class="primary--text">add</v-icon>
                  </button>
                </v-layout>
              </v-flex>

              <v-flex>
                <h2 v-if="check_id_inArray(product.id)">Total</h2>
                <h2>₱ {{totalPrice_adultkid(product.id)}}</h2>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </v-card>
     </v-container>

      <br />
      <!-- Pick your sauce -->
      <v-layout
        justify-center
        v-if="selectedProducts.items.length > 0 || selectedProducts.unliItems.length > 0"
      >
        <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <template v-slot:activator="{ on }">
            <v-btn
              class="pick-sauce-button secondary"
              v-on="on"
            >
              <b class="font-custom primary--text">Pick your Sauce</b>
            </v-btn>
          </template>

          <v-card>
            <v-card-title>
              <h2 class="text-center">
                You can choose
                <b>{{selectedProducts.flavor == 0 ? 'unlimited' : selectedProducts.flavor}}</b> flavors
              </h2>
            </v-card-title>

            <v-card-text >
              <v-card class="bg-grey mb-100"
                flat
                v-for="sauceCateg in sauceCategories"
                :key="sauceCateg.id"
              >
                <h2 class="text-xs-center pt-3" v-bind:style="{ 'color':  sauceCateg.color  }">
                  <small>****</small>
                  {{sauceCateg.name}}
                  <small>****</small>
                </h2>
                <v-container>
                  <div
                    v-for="sauce in filterSauces(sauceCateg.name)"
                    :key="sauce.id"
                  >
                  <div class="row mb-4">
                    <div class="col-6  col-sm-3">
                      <img :src="sauce.image ? sauce.image : '/haruxlogo.png'" class="d-block mx-auto product-table-image" :alt="sauce.name" />
                    </div>
                    <div class="col-6 col-sm-3 d-flex align-center">
                      <router-link
                            tag="div"
                            :to="{name: 'userproduct' , params:{id:sauce.id}}"
                            style="cursor:pointer"
                          >
                            <h2 class="product-name product-sauce-name text-start">{{sauce.name}}</h2>
                          </router-link>
                    </div>

                    <div class="col-12 col-sm-3 d-flex align-center">
                        <p v-html="sauce.details" class="mt-3 "></p>
                    </div>

                    <div class="col-12 col-sm-3 d-flex align-center">
                      <v-layout class="align-center justify-content-center">
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
                    </div>
                  </div>
                  <v-divider></v-divider>
                  </div>
                </v-container>
              </v-card>
            </v-card-text>

            <v-card-actions>
              <v-btn fab fixed top right class="pink white--text" text @click="dialog = false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-btn
                fixed
                bottom
                right
                v-if="selectedProducts.flavor > 0"
                class="stdBtn primary--text confirmOrderBtn"
                @click="confirmChickenOrder()"
              ><b class="font-custom">
                Confirm Order
                </b></v-btn>
              <v-btn
                v-else
                fixed
                bottom
                style="margin-bottom: 15%"
                right
                class="stdBtn primary--text confirmOrderBtn"
                @click="confirmUnliChickenOrder()"
              ><b class="font-custom">
                Confirm Order
              </b></v-btn>
            </v-card-actions>

          </v-card>

        </v-dialog>

      </v-layout>

      <v-container>
        <v-card flat class="pa-5 bg-grey">
          <div v-for="product in fetchChickens()" :key="product.id">
          <v-layout row wrap flex justify-center align-center>
            <v-flex>
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

            <v-flex>
              <router-link :to="{name: 'userproduct' , params:{id:product.id}}">
                <img :src="product.image ? product.image : '/haruxlogo.png'" class="product-table-image" :alt="product.name" />
              </router-link>
            </v-flex>

            <v-flex>
              <router-link
                tag="div"
                :to="{name: 'userproduct' , params:{id:product.id}}"
                style="cursor:pointer"
              >
                <h3 class="text--darken-2 font-weight-bold">{{product.name}}</h3>
              </router-link>
              <b class="pink--text">{{product.flavor}} Sauces</b>
            </v-flex>

            <v-flex>
              <h5 class="font-weight-bold">₱ {{product.price}}</h5>
            </v-flex>
          </v-layout>
          <hr />
        </div>
        </v-card>
      </v-container>
    </div>

    <div
      class="fixed dine-in-button"
      v-if="selectedProducts.items.length > 0"
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
import { db } from '@/config/firebase'
import { mapGetters, mapActions } from 'vuex'
import Swal from 'sweetalert2'

export default {
  data () {
    return {
      loading: false,
      dialog: false,
      title: 'Products',
      category: '',
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
        type: 'Dine',
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
    }
  },
  methods: {
    ...mapActions([
      'setProducts',
      'addToCart',
      'removeFromCart',
      'deleteFromCart',
      'confirmOrder'
    ]),
    sauceNoQty (sauceId) {
      let sauceProduct = this.selectedProducts.sauces.find(
        sauce => sauce.id === sauceId
      )
      if (sauceProduct) {
        return false
      } else {
        return true
      }
    },
    totalPrice_adultkid (id) {
      if (this.findSelectedProduct(id)) {
        var adultTotalPrice = this.findSelectedProduct(id).total_price_adult
          ? this.findSelectedProduct(id).total_price_adult
          : 0
        var kidTotalPrice = this.findSelectedProduct(id).total_price_kid
          ? this.findSelectedProduct(id).total_price_kid
          : 0
        var totalPrice = adultTotalPrice + kidTotalPrice
        return totalPrice
      }
    },
    push_unli_items_ids () {
      // check unli product to see if it is added to selectedproducts.unliItem, if yes display its buttons
      // return false;
      this.unliItemsId = []
      this.selectedProducts.unliItems.forEach(item => {
        this.unliItemsId.push(item.id)
      })
    },
    findSelectedProduct (id) {
      if (this.unliItemsId.includes(id)) {
        var items = this.selectedProducts.unliItems
        var foundindex = items.findIndex(x => x.id === id)
        return this.selectedProducts.unliItems[foundindex]
      }
    },
    addAdultQty (id) {
      // increment quantity of adults individually
      var items = this.selectedProducts.unliItems
      var foundindex = items.findIndex(x => x.id === id)

      var itemArr = items[foundindex]
      if ('adultQty' in itemArr) {
        this.selectedProducts.unliItems[foundindex].adultQty += 1
      } else {
        this.selectedProducts.unliItems[foundindex].adultQty = 1
      }

      // total of adult price
      this.selectedProducts.unliItems[foundindex].total_price_adult =
        this.selectedProducts.unliItems[foundindex].price *
        this.selectedProducts.unliItems[foundindex].adultQty

      // update total price of these order
      if ('total_price_kid' in this.selectedProducts.unliItems[foundindex]) {
        this.selectedProducts.unliItems[foundindex].total_price =
          this.selectedProducts.unliItems[foundindex].total_price_adult +
          this.selectedProducts.unliItems[foundindex].total_price_kid
      } else {
        this.selectedProducts.unliItems[foundindex].total_price = this.selectedProducts.unliItems[foundindex].total_price_adult
      }

      // push to order unli, A HACK TO UPDATE THIS.SELECTEDPRODUCTS.UNLIITEMS
      this.selectedProducts.orderUnliArr.pop(
        this.selectedProducts.unliItems[foundindex]
      )
    },
    subAdultQty (id) {
      // increment quantity of adults individually
      var items = this.selectedProducts.unliItems
      var foundindex = items.findIndex(x => x.id === id)

      var itemArr = items[foundindex]
      if ('adultQty' in itemArr) {
        if (itemArr.adultQty > 0) {
          this.selectedProducts.unliItems[foundindex].adultQty -= 1
        }
      }

      this.selectedProducts.unliItems[foundindex].total_price_adult =
        this.selectedProducts.unliItems[foundindex].price *
        this.selectedProducts.unliItems[foundindex].adultQty
      // push to order unli, A HACK TO UPDATE THIS.SELECTEDPRODUCTS.UNLIITEMS
      this.selectedProducts.orderUnliArr.pop(
        this.selectedProducts.unliItems[foundindex]
      )

      // update total price of these order
      if ('total_price_kid' in this.selectedProducts.unliItems[foundindex]) {
        this.selectedProducts.unliItems[foundindex].total_price =
          this.selectedProducts.unliItems[foundindex].total_price_adult +
          this.selectedProducts.unliItems[foundindex].total_price_kid
      } else {
        this.selectedProducts.unliItems[ foundindex ].total_price = this.selectedProducts.unliItems[foundindex].total_price_adult
      }
    },
    addKidQty (id) {
      // increment quantity of adults individually
      var items = this.selectedProducts.unliItems
      var foundindex = items.findIndex(x => x.id === id)

      var itemArr = items[foundindex]
      if ('kidQty' in itemArr) {
        this.selectedProducts.unliItems[foundindex].kidQty += 1
      } else {
        this.selectedProducts.unliItems[foundindex].kidQty = 1
      }

      this.selectedProducts.unliItems[foundindex].total_price_kid =
        this.selectedProducts.unliItems[foundindex].price_kid *
        this.selectedProducts.unliItems[foundindex].kidQty
      // push to order unli, A HACK TO UPDATE THIS.SELECTEDPRODUCTS.UNLIITEMS
      this.selectedProducts.orderUnliArr.pop(
        this.selectedProducts.unliItems[foundindex]
      )

      // update total price of these order
      if ('total_price_adult' in this.selectedProducts.unliItems[foundindex]) {
        this.selectedProducts.unliItems[foundindex].total_price =
          this.selectedProducts.unliItems[foundindex].total_price_adult +
          this.selectedProducts.unliItems[foundindex].total_price_kid
      } else {
        this.selectedProducts.unliItems[foundindex].total_price = this.selectedProducts.unliItems[foundindex].total_price_kid
      }
    },
    subKidQty (id) {
      // increment quantity of adults individually
      var items = this.selectedProducts.unliItems
      var foundindex = items.findIndex(x => x.id === id)

      var itemArr = items[foundindex]
      if ('kidQty' in itemArr) {
        if (itemArr.kidQty > 0) {
          this.selectedProducts.unliItems[foundindex].kidQty -= 1
        }
      }

      this.selectedProducts.unliItems[foundindex].total_price_kid =
        this.selectedProducts.unliItems[foundindex].price_kid *
        this.selectedProducts.unliItems[foundindex].kidQty
      // push to order unli, A HACK TO UPDATE THIS.SELECTEDPRODUCTS.UNLIITEMS
      this.selectedProducts.orderUnliArr.pop(
        this.selectedProducts.unliItems[foundindex]
      )

      // update total price of these order
      if ('total_price_adult' in this.selectedProducts.unliItems[foundindex]) {
        this.selectedProducts.unliItems[foundindex].total_price =
          this.selectedProducts.unliItems[foundindex].total_price_adult +
          this.selectedProducts.unliItems[foundindex].total_price_kid
      } else {
        this.selectedProducts.unliItems[foundindex].total_price = this.selectedProducts.unliItems[foundindex].total_price_kid
      }
    },
    check_id_inArray (id) {
      return this.unliItemsId.includes(id)
    },
    addSauce (sauceId) {
      // find the sauce in the sauces list
      let sauce = this.sauces.find(sauce => sauce.id === sauceId)
      let sauceProduct = this.selectedProducts.sauces.find(
        sauce => sauce.id === sauceId
      )

      if (sauceProduct) {
        // product already present in the cart. so increase the quantity
        sauceProduct.quantity++
      } else {
        this.selectedProducts.sauces.push({
          // sauce newly added to selectedPrduc
          ...sauce,
          quantity: 1
        })
      }
    },
    removeSauce (sauceId) {
      let sauceProduct = this.selectedProducts.sauces.find(
        sauce => sauce.id === sauceId
      )

      if (sauceProduct.quantity && sauceProduct.quantity > 1) {
        sauceProduct.quantity--
      } else if (sauceProduct.quantity && sauceProduct.quantity === 1) {
        let sauceProductIndex = this.selectedProducts.sauces.findIndex(
          sauce => sauce.id === sauceId
        )

        this.selectedProducts.sauces.splice(sauceProductIndex, 1)
      } else {
        return false
      }
    },
    fetchSauceQuantity (id) {
      if (this.selectedProducts.sauces.find(sauce => sauce.id === id)) {
        return this.selectedProducts.sauces.find(sauce => sauce.id === id)
        // return "yes"
      }
    },
    fetchChickens () {
      return this.chickenProducts.filter(p => p.unli === false)
    },
    fetchUnliChickens () {
      return this.chickenProducts.filter(p => p.unli === true)
    },
    fetchSauceCategories () {
      db.collection('saucecategories')
        .where('status', '==', true)
        .onSnapshot(snapshot => {
          this.sauceCategories = []
          snapshot.forEach(doc => {
            this.sauceCategories.push(doc.data())
          })
        })
    },
    fetchSauces () {
      db.collection('products')
        .where('category', '==', 'Sauce')
        .where('status', '==', 'available')
        .onSnapshot(snapshot => {
          this.sauces = []
          snapshot.forEach(doc => {
            this.sauces.push(doc.data())
          })
        })
    },
    filterSauces (subcategory) {
      return this.sauces.filter(s => s.subcategory === subcategory)
      // return this.sauces;
    },
    checkSelectedSauceLength () {
      // no longer the length of selectedproducts but the quantity of each sauce in the selected products

      // check length of selectedProducts.flavor
      // loop through sauces and add their overall quantity
      // if flavor and overall quantity is equal , return true
      let flavorsLen = parseInt(this.selectedProducts.flavor)

      if (this.selectedProducts.sauces.length > 0) {
        let saucesArray = this.selectedProducts.sauces

        let aqty = 0
        saucesArray.forEach(s => {
          aqty += parseInt(s.quantity)
        })

        if (aqty === flavorsLen) {
          return true
        } else {
          return false
        }
      }
    },
    addProductFlavor () {
      let temp = 0
      this.selectedProducts.items.forEach(el => {
        temp += el.flavor
      })
      this.selectedProducts.flavor = temp
      this.push_unli_items_ids() // pushed id of product to unli_items_ids -> for conditionally showing add and remove buttons
    },
    confirmUnliChickenOrder () {
      var orderNumber = new Date()
        .toISOString()
        .substr(0, 19)
        .replace('T', ':')
        .replace('-', ':')
        .replace('-', ':')

      let order = {}
      order.table_number = this.tableProfile.table_number
      order.orders = []
      order.chickens = this.selectedProducts.unliItems
      order.sauces = this.selectedProducts.sauces

      order.order_number = orderNumber
      order.status = 'pending'
      order.time = new Date()

      let totalPrice = null

      let chickens = order.chickens
      chickens.forEach(el => {
        totalPrice += el.total_price
      })

      order.total_price = totalPrice // getters.cartTotalAmount; // *

      let ref = db.collection('orders').doc()

      ref
        .set({
          id: ref.id,
          ...order
        })
        .then(() => {
          Swal.fire({
            type: 'success',
            title: 'Order Confirmed',
            showConfirmButton: false,
            timer: 1500
          })
          this.selectedProducts.unliItems = []
          this.selectedProducts.flavor = null
          this.selectedProducts.sauces = []
          this.selectedProducts.type = 'Dine'
          this.dialog = false

          this.$router.push('/')
        })

      // push order number to user profile
      let userref = db.collection('users').doc(this.tableProfile.id)

      userref.get().then(doc => {
        var orders = doc.data().orders
        var newOrder = [...orders, order.order_number]
        var user = doc.data()
        user.orders = newOrder
        user.sauce = true
        // update profile sauce status to true , if one of the product has category chicken

        // state.cart.forEach(res => {
        //   if (res.category == "Chicken") {
        //     user.sauce = true;
        //   }
        // });

        db.collection('users')
          .doc(this.tableProfile.id)
          .set({
            ...user
          })
      })
    },
    confirmChickenOrder () {
      var orderNumber = new Date()
        .toISOString()
        .substr(0, 19)
        .replace('T', ':')
        .replace('-', ':')
        .replace('-', ':')

      let order = {}
      order.table_number = this.tableProfile.table_number
      order.orders = []
      order.chickens = this.selectedProducts.items
      order.sauces = this.selectedProducts.sauces
      order.type = this.selectedProducts.type
      order.order_number = orderNumber
      order.status = 'pending'
      order.time = new Date()

      let totalPrice = null
      let chickens = order.chickens
      chickens.forEach(el => {
        totalPrice += parseInt(el.price)
      })

      order.total_price = totalPrice // getters.cartTotalAmount; // *

      let ref = db.collection('orders').doc()

      ref
        .set({
          id: ref.id,
          ...order
        })
        .then(() => {
          Swal.fire({
            type: 'success',
            title: 'Order Confirmed',
            showConfirmButton: false,
            timer: 1500
          })
          this.selectedProducts.items = []
          this.selectedProducts.flavor = null
          this.selectedProducts.sauces = []
          this.selectedProducts.type = 'Dine'
          this.dialog = false

          this.$router.push('/')
        })

      // push order number to user profile
      let userref = db.collection('users').doc(this.tableProfile.id)

      userref.get().then(doc => {
        var orders = doc.data().orders
        var newOrder = [...orders, order.order_number]
        var user = doc.data()
        user.orders = newOrder
        user.sauce = true

        db.collection('users')
          .doc(this.tableProfile.id)
          .set({
            ...user
          })
      })
    }
  },
  created () {
    db.collection('products')
      .where('category', '==', 'Chicken')
      .where('status', '==', 'available')
      .onSnapshot(snapshot => {
        this.chickenProducts = []

        this.selectedProducts.items = []
        this.selectedProducts.flavor = null
        this.selectedProducts.sauces = []
        this.selectedProducts.type = 'Dine'
        this.dialog = false

        snapshot.forEach(doc => {
          this.chickenProducts.push(doc.data())
        })
      })

    this.fetchSauceCategories()
    this.fetchSauces()
  },
  computed: {
    ...mapGetters([
      'fetchCart',
      'cartSize',
      'cartTotalAmount',
      'fetchProductQuantity',
      'tableProfile'
    ])
  }
}
</script>

<style scoped>
.dine-in-button {
    position: fixed;
    background: #fffefe;
    border: 1px solid #261c1d;
    width: 130px;
    height: 80px;
    right: 250px;
    bottom: 115px;
    z-index: 9;
}

.pick-sauce-button {
  position: fixed;
  right: 30px;
  bottom: 21px;
  margin-bottom: 100px;
  z-index: 9;
  height: 70px;
}

.confirmOrderBtn {
  margin-bottom: 100px;
}

v-label {
  color: #fff !important;
}
@media only screen and (max-width: 662px){
  .dine-in-button {
    right: 190px;
  }
}

</style>

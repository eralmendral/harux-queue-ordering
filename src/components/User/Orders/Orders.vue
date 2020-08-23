<template>
  <v-container fluid class="mt-50">
    <h2 class="my-3 text-center primary--text">
      <small>****</small>My Orders
      <small>****</small>
    </h2>
    <v-card v-for="ordernum in tableProfile.orders" flat :key="ordernum">
      <v-card-text>
        <p>
          Order #:
          <b>{{ordernum}}</b>
        </p>
        <div v-for="orders in fetchMyOrders(ordernum)" :key="orders.id">
          <v-container fluid>
            <div class="row">
              <div class="col-xs-12 col-sm-6">
                <div class="order-details">
                  <h5>
                    <small>Order Status ........................</small>
                    <small>
                      <b>{{orders.status}}</b>
                    </small>
                  </h5>

                  <h5 v-if="orders.type">
                    <small>Order Type ........................</small>
                    <small>
                      <b>{{orders.type}}</b>
                    </small>
                  </h5>

                  <h5 v-if="orders.orders.length">
                    <small>Variety of Items ........................</small>
                    <small>
                      <b>{{orders.orders.length}}</b>
                    </small>
                  </h5>

                  <h5>
                    <small>Order Date ........................</small>
                    <small>
                      <b>{{orderDate(orders.time.toDate())}}</b>
                    </small>
                  </h5>
                  <h5>
                    <small>Order Time ........................</small>
                    <small>
                      <b>{{orderTime(orders.time.toDate())}}</b>
                    </small>
                  </h5>

                  <h5 class="my-2">
                    <small>Total Price ........................</small>
                    <small class="font-custom">
                      <b>₱ {{orders.total_price}}</b>
                    </small>.
                  </h5>
                </div>
              </div>

              <!-- Other Products -->
              <div v-if="orders.orders.length" class="col-12 col-sm-6">
                <div>
                  <v-card flat class="order-items-summary">
                    <v-container>
                      <v-layout justify-space-around v-for="item in orders.orders" :key="item.id">
                        <v-flex>
                          <router-link
                            class="cursor-pointer product-name text-center"
                            tag="h4"
                            :to="{name: 'userproduct' , params: { id: item.id }}"
                          >
                            <b class="font-custom">{{item.name}}</b>
                          </router-link>
                        </v-flex>
                        <v-flex>
                          <h4 class="product-qty">
                            <b class="font-custom">{{item.quantity}}</b>
                          </h4>
                        </v-flex>
                        <v-flex>
                          <h4 class="product-price" v-if="item.price">
                            <b class="font-custom">₱ {{item.price}}</b>
                          </h4>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </div>
              </div>

              <!-- Chickens -->
              <div v-if="orders.chickens" class="col-12 col-sm-6">
                <div>
                  <v-card flat class="bg-grey">
                    <v-container>
                      <v-layout
                        column
                        align-center
                        v-for="chicken in orders.chickens"
                        :key="chicken.id"
                      >
                        <v-flex>
                          <router-link
                            class="cursor-pointer product-name text-center"
                            tag="h4"
                            :to="{name: 'userproduct' , params: { id: chicken.id }}"
                          >
                            <b class="font-custom">{{chicken.name}}</b>
                          </router-link>
                        </v-flex>

                        <!-- Chicken Unli -->

                        <div class="row " v-if="chicken.unli">
                            <div class="col-sm-12 text-center">
                                <span
                                  class="text-center font-custom"
                                >Adults: {{chicken.adultQty ? chicken.adultQty : '0' }}
                                </span>
                              <span
                                  class="text-center font-custom"
                                >Kids: {{ chicken.kidQty ? chicken.kidQty : '0'}}
                                </span>
                            </div>
                            <div class="col-sm-12 text-center">
                                <span
                                  class="text-center font-custom"
                                >Total: <b>₱ {{chicken.total_price}}</b></span>
                            </div>
                        </div>
                      </v-layout>

                      <!-- Sauces -->
                      <div v-if="orders.sauces.length > 0">
                        <b>Sauces</b>
                        <div class="border pa-3">
                          <v-layout justify-center v-for="sauce in orders.sauces" :key="sauce.id">
                            <v-flex>
                              <h5>
                                <b>{{sauce.name}}</b>
                              </h5>
                            </v-flex>
                            <v-flex>
                              <p class="primary--text font-weight-bold">{{sauce.quantity}}</p>
                            </v-flex>
                          </v-layout>
                        </div>
                      </div>
                    </v-container>
                  </v-card>
                </div>
              </div>
            </div>
          </v-container>
        </div>
      </v-card-text>
      <v-divider></v-divider>
    </v-card>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
  </v-container>
</template>

<script>
import { db } from "@/config/firebase";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      allorders: [],
      myorders: [],
    };
  },
  computed: {
    ...mapGetters(["tableProfile"]),
  },
  methods: {
    orderDate(date) {
      return moment(date).format("MMM. DD YYYY");
    },
    orderTime(date) {
      return moment(date).format("h:mm:ss a");
    },
    fetchMyOrders: function (ordernum) {
      return this.allorders.filter((order) => order.order_number === ordernum);
    },
  },
  created() {
    db.collection("orders").onSnapshot((querySnapshot) => {
      this.allorders = [];
      querySnapshot.forEach((doc) => {
        this.allorders.push(doc.data());
      });
    });
  },
};
</script>

<style>
.product-name:hover {
  color: #cb7a43;
}

.bg-grey {
  background: rgb(243, 240, 238) !important;
}

@media only screen and (max-width: 660px) {
  .product-name, .product-qty, .product-price {
    font-size: 16px !important;
  }
}
</style>

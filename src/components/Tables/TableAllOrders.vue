<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-container fluid>
      <h3 class="text-center">Table {{table_num}}</h3>
      <v-btn
        large
        class="primary white--text"
        @click="billOut(table_num)"
        v-if="tableProfile.billingout"
      >Bill Out</v-btn>
      <v-card v-for="ordernum in tableProfile.orders" flat :key="ordernum" class="ma-3">
        <v-card-text>
          <h4>
            <small>Order No:</small>
            {{ordernum}}
          </h4>
          <div v-for="orders in fetchMyOrders(ordernum)" :key="orders">
            <v-container>
              <v-layout>
                <v-flex sm6>
                  <h5 class="my-2">
                    <small>Order Status ........................</small>
                    <v-chip
                      class="white--text"
                      :class="orders.status == 'pending' ? 'green' : 'brown'"
                    >{{orders.status}}</v-chip>
                  </h5>

                  <h5 class="my-2" v-if="orders.type">
                    <small>Order Type ........................</small>
                    <v-chip
                      class="white--text"
                      :class="orders.type == 'Dine' ? 'success' : 'primary'"
                    >{{orders.type}}</v-chip>
                  </h5>

                  <h5 class="my-2" v-if="orders.orders.length">
                    <small>Variety of Items ........................</small>
                    {{orders.orders.length}}
                  </h5>

                  <h5 class="my-2">
                    <small>Order Date ........................</small>
                    {{orderDate(orders.time.toDate())}}
                  </h5>
                  <h5 class="my-2">
                    <small>Order Time ........................</small>
                    {{orderTime(orders.time.toDate())}}
                  </h5>

                  <h5 class="my-2">
                    <small>Total Price ........................</small>
                    <v-chip class="pink white--text">₱ {{orders.total_price}}</v-chip>
                  </h5>
                </v-flex>

                <v-flex sm6>
                  <v-layout row justify-center>
                    <hr />
                    <v-flex xs12 v-if="orders.orders.length">
                      <h5 class="text-center my-3 font-weight-bold">Items</h5>
                      <v-card flat class="border border-warning">
                        <v-container>
                          <v-layout
                            row
                            justify-space-around
                            align-center
                            v-for="item in orders.orders"
                            :key="item.id"
                            class="mt-1"
                          >
                            <v-flex xs4>
                              <h5>{{item.name}}</h5>
                            </v-flex>
                            <v-flex xs1>
                              <h5>{{item.quantity}}</h5>
                            </v-flex>
                            <h5>₱ {{item.price}}</h5>
                          </v-layout>
                        </v-container>
                      </v-card>
                    </v-flex>

                    <v-flex xs12 v-if="orders.chickens">
                      <v-card flat class="border border-warning">
                        <v-container>
                          <v-layout
                            class="mb-2"
                            flex
                            row
                            justify-center
                            align-center
                            v-for="chicken in orders.chickens"
                            :key="chicken.id"
                          >
                            <v-flex xs12>
                              <h5 class="text-center">
                                <small class="font-weight-bold">{{chicken.name}}</small>
                              </h5>
                            </v-flex>

                            <!-- quantity -->

                            <v-layout class="pa-3" v-if="chicken.unli">
                              <v-flex>
                                <v-layout justify-center>
                                  <v-flex xs4>
                                    <p
                                      class="text-center"
                                    >Adults: {{chicken.adultQty ? chicken.adultQty : '0' }}</p>
                                  </v-flex>
                                  <v-flex xs4>
                                    <p
                                      class="text-center"
                                    >Kids: {{ chicken.kidQty ? chicken.kidQty : '0'}}</p>
                                  </v-flex>

                                  <v-flex xs4>
                                    <p class="text-center">Total: {{chicken.total_price}}</p>
                                  </v-flex>
                                </v-layout>
                              </v-flex>
                            </v-layout>
                          </v-layout>

                          <v-card class="border border-default pa-3">
                            <v-layout
                              flex
                              justify-center
                              row
                              v-for="sauce in orders.sauces"
                              :key="sauce.id"
                            >
                              <v-flex xs4>
                                <p>{{sauce.name}}</p>
                              </v-flex>
                              <v-flex xs1>
                                <p
                                  style="color: #cb7a43 "
                                  class="font-weight-bold"
                                >{{sauce.quantity}}</p>
                              </v-flex>
                            </v-layout>
                          </v-card>
                        </v-container>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
            <hr />
            <div v-if="orders.orders.length">
              <h5>Items</h5>
              <v-card flat v-for="item in orders.orders" :key="item.id">
                <v-container>
                  <v-layout row justify-space-around align-center>
                    <v-flex xs4>
                      <div class="text-center">
                        <img :src="item.image" width="100px" :alt="item.name" />
                      </div>
                    </v-flex>
                    <v-flex xs3>
                      <h5>{{item.name}}</h5>
                    </v-flex>
                    <v-flex xs2>
                      <h5>{{item.quantity}}</h5>
                    </v-flex>
                    <v-flex xs2>
                      <h5>₱ {{item.price}}</h5>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </div>
            <div v-if="orders.chickens">
              <h5>Chickens</h5>
              <v-card flat v-for="chicken in orders.chickens" :key="chicken.id">
                <v-container>
                  <v-layout row justify-space-around align-center>
                    <v-flex xs4>
                      <div class="text-center">
                        <img :src="chicken.image" width="100px" height="100px" :alt="chicken.name" />
                      </div>
                    </v-flex>
                    <v-flex xs4>
                      <h4>{{chicken.name}}</h4>
                    </v-flex>
                    <v-flex xs2>
                      <h4>₱ {{chicken.price}}</h4>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
              <hr />
              <h5>Sauces</h5>
              <v-card flat v-for="sauce in orders.sauces" :key="sauce.id">
                <v-container>
                  <v-layout flex row justify-space-around align-center>
                    <v-flex xs4>
                      <div class="text-center">
                        <img :src="sauce.image" width="100px" height="100px" :alt="sauce.name" />
                      </div>
                    </v-flex>
                    <v-flex xs4>
                      <h4>{{sauce.name}}</h4>
                    </v-flex>
                    <v-flex xs2>
                      <h4  class="font-weight-bold secondary--text">{{sauce.quantity}}</h4>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { fb, db } from "@/config/firebase";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import Swal from "sweetalert2";

export default {
  name: "TableAllOrders",
  data() {
    return {
      table_num: "",
      allorders: [],
      myorders: [],
      tableProfile: null,
      items: [
        {
          text: "Dashboard",
          disabled: false,
          to: "/dashboard/#"
        },
        {
          text: "Tables",
          disabled: false,
          to: "/dashboard/tables"
        },
        {
          text: "Order",
          disabled: true
        }
      ]
    };
  },
  methods: {
    orderDate(date) {
      return moment(date).format("MMMM Do YYYY");
    },
    orderTime(date) {
      return moment(date).format("h:mm:ss a");
    },
    fetchMyOrders: function(ordernum) {
      return this.allorders.filter(order => order.order_number == ordernum);
    },
    billOut(tablenum) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Billout!"
      }).then(result => {
        if (result.value) {
          db.collection("users")
            .where("table_number", "==", tablenum)
            .get()
            .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                console.log(doc.id, " => ", doc.data());

                // Build doc ref from doc.id
                db.collection("users")
                  .doc(doc.id)
                  .update({ billingout: false, orders: [], sauce: false });
              });
            });
          Swal.fire({
            type: "success",
            title: "Table Billed Out",
            showConfirmButton: false,
            timer: 1500
          });

          this.$router.push("/dashboard/tables");
        }
      });
    }
  },
  created() {
    this.table_num = this.$route.params.table_num;

    db.collection("orders").onSnapshot(querySnapshot => {
      this.allorders = [];
      querySnapshot.forEach(doc => {
        this.allorders.push(doc.data());
      });
    });

    db.collection("users")
      .where("table_number", "==", this.table_num)
      .onSnapshot(querySnapshot => {
        this.users = {};
        querySnapshot.forEach(doc => {
          this.tableProfile = doc.data();
        });
      });
  }
};
</script>

<style>
</style>

<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-container fluid>
      <h2 class="text-center">Table {{table_num}}</h2>
      <v-btn
        class="primary white--text"
        @click="billOut(table_num)"
        v-if="tableProfile.billingout"
      >Bill Out</v-btn>
      <v-card v-for="ordernum in tableProfile.orders" flat :key="ordernum" class="ma-3">
        <v-card-text>
            <small>Order No:</small>
            {{ordernum}}
          <div v-for="orders in fetchMyOrders(ordernum)" :key="orders">
            <v-container>
              <v-layout>
                <v-flex sm6>
                 <div class="order-details">
                    <h5>
                    <small>Order Status ........................</small>
                    <small><b>{{orders.status}}</b></small>
                  </h5>

                  <h5 v-if="orders.type">
                    <small>Order Type ........................</small>
                    <v-chip
                      class="white--text"
                      :class="orders.type == 'Dine' ? 'success' : 'primary'"
                    >{{orders.type}}</v-chip>
                  </h5>

                  <h5 v-if="orders.orders.length">
                    <small>Variety of Items ........................</small>
                    <small><b>{{orders.orders.length}}</b></small>
                  </h5>

                  <h5>
                    <small>Order Date ........................</small>
                    <small><b>{{orderDate(orders.time.toDate())}}</b></small>
                  </h5>
                  <h5>
                    <small>Order Time ........................</small>
                    <small><b>{{orderTime(orders.time.toDate())}}</b></small>
                  </h5>

                  <h5 class="my-2">
                    <small>Total Price ........................</small>
                    <small class="font-custom"><b>₱ {{orders.total_price}}</b></small>.
                  </h5>
                 </div>
                </v-flex>

                <v-flex sm6>
                  <v-layout>
                    <hr />
                    <v-flex xs12 v-if="orders.orders.length">
                      <v-card flat class="ml-2 order-items-summary">
                        <v-container>
                            <v-layout
                              justify-space-around
                              v-for="item in orders.orders"
                              :key="item.id"
                            >
                              <v-flex>
                                <p><b class="font-custom">{{item.name}}</b></p>
                              </v-flex>
                              <v-flex>
                              <p><b class="font-custom">{{item.quantity}}</b></p>
                              </v-flex>
                              <v-flex>
                                <p v-if="item.price"><b class="font-custom">₱ {{item.price}}</b></p>
                              </v-flex>
                            </v-layout>
                        </v-container>
                      </v-card>
                    </v-flex>

                <!-- Chickens -->
              <v-flex xs12 v-if="orders.chickens">
                <v-card flat class="ml-2">
                  <v-container>
                    <v-layout
                      align-center
                      row
                      v-for="chicken in orders.chickens"
                      :key="chicken.id"
                    >
                      <v-flex xs12>
                        <h5 class="text-center">
                          <small class="font-weight-bold font-custom">{{chicken.name}}</small>
                        </h5>
                      </v-flex>

                      <v-layout class="pa-3" v-if="chicken.unli">
                        <v-flex>
                          <v-layout>
                            <v-flex>
                              <span
                                class="text-center font-custom"
                              >Adults: {{chicken.adultQty ? chicken.adultQty : '0' }}</span>
                            </v-flex>
                            <v-flex>
                              <span
                                class="text-center font-custom"
                              >Kids: {{ chicken.kidQty ? chicken.kidQty : '0'}}</span>
                            </v-flex>

                            <v-flex>
                              <span class="text-center font-custom">Total: ₱ {{chicken.total_price}}</span>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-layout>

                    <small>Sauces</small>
                    <div class="border pa-3">
                      <v-layout
                        justify-center
                        v-for="sauce in orders.sauces"
                        :key="sauce.id"
                      >
                        <v-flex xs4>
                          <small>{{sauce.name}}</small>
                        </v-flex>
                        <v-flex xs1>
                          <p class="primary--text font-weight-bold">{{sauce.quantity}}</p>
                        </v-flex>
                      </v-layout>
                    </div>
                  </v-container>
                </v-card>
              </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
            <hr />

            <div v-if="orders.orders.length">
              <h2>Order Items</h2>
              <v-card flat v-for="item in orders.orders" :key="item.id">
                <v-container>
                  <v-layout row justify-space-around align-center>
                    <v-flex xs4>
                      <div class="text-center">
                        <img :src="item.image ? item.image : '/haruxlogo.png'" class="product-table-image" :alt="item.name" />
                      </div>
                    </v-flex>
                    <v-flex xs3>
                      <h4 class="font-custom">{{item.name}}</h4>
                    </v-flex>
                    <v-flex xs2>
                      <h4><b>{{item.quantity}}</b></h4>
                    </v-flex>
                     <v-flex xs2>
                      <h4><b v-if="item.price">₱ {{item.price}}</b></h4>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </div>
            <div v-if="orders.chickens">
              <h2>Chickens</h2>
              <v-card flat v-for="chicken in orders.chickens" :key="chicken.id">
                <v-container>
                  <v-layout row justify-space-around align-center>
                    <v-flex xs4>
                      <div class="text-center">
                        <img :src="chicken.image ? chicken.image : '/haruxlogo.png'" class="product-table-image" :alt="chicken.name" />
                      </div>
                    </v-flex>
                    <v-flex xs4>
                      <h4 class="font-custom">{{chicken.name}}</h4>
                    </v-flex>
                    <v-flex xs2>
                      <h4><b v-if="chicken.price">₱ {{chicken.price}}</b></h4>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
              <hr />
              <h2>Sauces</h2>
              <v-card flat v-for="sauce in orders.sauces" :key="sauce.id">
                <v-container>
                  <v-layout flex row justify-space-around align-center>
                    <v-flex xs4>
                      <div class="text-center">
                        <img :src="sauce.image ? sauce.image : '/haruxlogo.png'" class="product-table-image" :alt="sauce.name" />
                      </div>
                    </v-flex>
                    <v-flex xs4>
                      <h4 class="font-custom">{{sauce.name}}</h4>
                    </v-flex>
                    <v-flex xs2>
                      <h4 class="font-weight-bold secondary--text">{{sauce.quantity}}</h4>
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
import { db } from '@/config/firebase'
import moment from 'moment'
import Swal from 'sweetalert2'

export default {
  name: 'TableAllOrders',
  data () {
    return {
      table_num: '',
      allorders: [],
      myorders: [],
      tableProfile: null,
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/dashboard/#'
        },
        {
          text: 'Tables',
          disabled: false,
          to: '/dashboard/tables'
        },
        {
          text: 'Order',
          disabled: true
        }
      ]
    }
  },
  methods: {
    orderDate (date) {
      return moment(date).format('MMM. DD YYYY')
    },
    orderTime (date) {
      return moment(date).format('h:mm:ss a')
    },
    fetchMyOrders: function (ordernum) {
      return this.allorders.filter(order => order.order_number === ordernum)
    },
    billOut (tablenum) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Billout!'
      }).then(result => {
        if (result.value) {
          db.collection('users')
            .where('table_number', '==', tablenum)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                // Build doc ref from doc.id
                db.collection('users')
                  .doc(doc.id)
                  .update({ billingout: false, orders: [], sauce: false })
              })
            })
          Swal.fire({
            type: 'success',
            title: 'Table Billed Out',
            showConfirmButton: false,
            timer: 1500
          })

          this.$router.push('/dashboard/tables')
        }
      })
    }
  },
  created () {
    this.table_num = this.$route.params.table_num

    db.collection('orders').onSnapshot(querySnapshot => {
      this.allorders = []
      querySnapshot.forEach(doc => {
        this.allorders.push(doc.data())
      })
    })

    db.collection('users')
      .where('table_number', '==', this.table_num)
      .onSnapshot(querySnapshot => {
        this.users = {}
        querySnapshot.forEach(doc => {
          this.tableProfile = doc.data()
        })
      })
  }
}
</script>

<style>
.order-items-summary {
  background: rgb(243, 240, 238) !important;
  min-height: 210px;
}
</style>

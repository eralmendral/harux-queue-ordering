<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-container>
      <h1 class="text-center">Order Details</h1>
      <hr />
      <div class="mt-4">
        <v-layout class="my-2 align-center">
          <v-flex xs6>
            <h5>Table Number: {{order.table_number}}</h5>
            <h5 class="my-2">
              <small>Order No:</small>
              {{order.order_number}}
            </h5>
            <h5 class="my-2">
              <small>Order Status ........................</small>
              <v-chip class="success white--text my-2">{{order.status}}</v-chip>
            </h5>

            <h5 class="my-2" v-if="order.type">
              <small>Order Type ........................</small>
              <v-chip
                class="white--text"
                :class="order.type == 'Dine' ? 'success' : 'primary'"
              >{{order.type}}</v-chip>
            </h5>

            <h5 class="my-2">
              <small>Order Date ........................</small>
              {{orderDate(order.time.toDate())}}
            </h5>
            <h5 class="my-2">
              <small>Order Time ........................</small>
              {{orderTime(order.time.toDate())}}
            </h5>

            <h5 class="my-2" v-if="order.orders.length">
              <small>Variety of Items ........................</small>
              {{order.orders.length}}
            </h5>

            <h5 class="mt-2">
              <small>Total Price ........................</small>
              <span>
                <small>₱</small>.
                <v-chip class="pink white--text font-weight-bold">{{order.total_price}}</v-chip>
              </span>
            </h5>
          </v-flex>

          <v-flex sm6>
            <v-layout row justify-center>
              <hr />
              <v-flex xs12 v-if="order.orders.length">
                <h5 class="text-center my-3 font-weight-bold">Items</h5>
                <v-card flat class="border border-warning">
                  <v-container>
                    <v-layout
                      row
                      justify-space-around
                      align-center
                      v-for="item in order.orders"
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

              <v-flex xs12 v-if="order.chickens">
                <v-card flat class="border border-warning">
                  <v-container>
                    <v-layout
                      class="mb-2"
                      flex
                      row
                      justify-center
                      align-center
                      v-for="chicken in order.chickens"
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
                        v-for="sauce in order.sauces"
                        :key="sauce.id"
                      >
                        <v-flex xs4>
                          <p>{{sauce.name}}</p>
                        </v-flex>
                        <v-flex xs1>
                          <p style="color: #cb7a43 " class="font-weight-bold">{{sauce.quantity}}</p>
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-container>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>

        <br />
        <br />
        <br />
        <br />
        <br />
      </div>

      <v-layout row justify-center>
        <hr />
        <v-flex xs12 v-if="order.orders.length">
          <h5>Items:</h5>
          <v-card flat v-for="item in order.orders" :key="item.id">
            <v-container>
              <v-layout row justify-space-around align-center>
                <v-flex xs4 >
                 <div class="text-center">
                    <img :src="item.image" width="px" height="80px" :alt="item.name" />
                 </div>
                </v-flex>
                <v-flex xs3 >
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
        </v-flex>

        <v-flex xs12 v-if="order.chickens">
          <v-card flat v-for="chicken in order.chickens" :key="chicken.id">
            <v-container>
              <v-layout flex row justify-space-around align-center>
                <v-flex xs1></v-flex>
                <v-flex xs3>
                  <img :src="chicken.image" width="80px" height="80px" :alt="chicken.name" />
                </v-flex>
                <v-flex xs3>
                  <h5 class="font-weight-bold">{{chicken.name}}</h5>
                </v-flex>
                <v-flex>
                  <h5 v-if="!chicken.kidQty">₱ {{chicken.price}}</h5>
                </v-flex>
              </v-layout>

              <v-layout class="my-1 pa-3" v-if="chicken.adultQty || chicken.kidQty">
                <v-flex>
                  <v-layout class="my-2" justify-center v-if="chicken.adultQty > 0">
                    <v-flex xs4>
                      <h5>Adults: {{chicken.adultQty}}</h5>
                    </v-flex>
                    <v-flex xs4>
                      <h5>Price: ₱ {{chicken.price}}</h5>
                    </v-flex>
                    <v-flex xs4>
                      <h5>Total Adult Price: ₱ {{chicken.total_price_adult}}</h5>
                    </v-flex>
                  </v-layout>

                  <v-layout justify-center v-if="chicken.kidQty > 0">
                    <v-flex xs4>
                      <h5>Kids: {{chicken.kidQty}}</h5>
                    </v-flex>
                    <v-flex xs4>
                      <h5>Price: {{chicken.price_kid}}</h5>
                    </v-flex>
                    <v-flex xs4>
                      <h5>Total Kid Price: ₱{{chicken.total_price_kid}}</h5>
                    </v-flex>
                  </v-layout>

                  <v-layout class="mt-4">
                    <v-flex>
                      <h5>
                        Total Price:
                        <span class="font-weight-bold">₱ {{chicken.total_price}}</span>
                      </h5>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
          <hr />

          <v-card flat>
            <v-container>
              <h5 class="text-center font-weight-bold mb-4">Sauces</h5>
              <v-layout
                flex
                row
                justify-center
                align-center
                v-for="sauce in order.sauces"
                :key="sauce.id"
              >
                <v-flex xs4>
                  <img :src="sauce.image" width="80px" height="80px" :alt="sauce.name" />
                </v-flex>
                <v-flex xs4>
                  <h5>{{sauce.name}}</h5>
                </v-flex>
                <v-flex xs2>
                  <h5 style="color: #cb7a43 " class="font-weight-bold">{{sauce.quantity}}</h5>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container>
      <div class="my-5 ba-3">
        <h3 class="my-3">
          Update Order Status :
          <strong class="text-success">{{order.status}}</strong>
        </h3>
        <v-btn
          large
          flat
          class="success white--text"
          @click="updateOrderPending(order.order_number)"
        >
          <span>Pending</span>
        </v-btn>
        <v-btn
          large
          flat
          class="pink white--text"
          @click="updateOrderCancelled(order.order_number)"
        >
          <span>Cancelled</span>
        </v-btn>
        <v-btn
          large
          flat
          class="brown white--text"
          @click="updateOrderFinished(order.order_number)"
        >
          <span>Finished</span>
        </v-btn>
      </div>
    </v-container>
    <div class="mt-3">
      <v-btn depressed fab color="red lighten--4" to="/dashboard/">
        <v-icon color="white">arrow_back</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { db } from '@/config/firebase'
import Swal from 'sweetalert2'
import moment from 'moment'

export default {
  name: 'OrderDetails',
  data () {
    return {
      order: {},
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/dashboard/#'
        },
        {
          text: 'Orders',
          disabled: false,
          to: '/dashboard/new-orders'
        },
        {
          text: 'Details',
          disabled: true
        }
      ]
    }
  },

  methods: {
    orderDate (date) {
      return moment(date).format('MMMM Do YYYY')
    },
    orderTime (date) {
      return moment(date).format('h:mm:ss a')
    },
    updateOrderPending (orderNumber) {
      // find and update
      db.collection('orders')
        .where('order_number', '==', orderNumber)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // console.log(doc.id, " => ", doc.data());

            // Build doc ref from doc.id
            db.collection('orders')
              .doc(doc.id)
              .update({ status: 'pending' })
          })
        })

      Swal.fire({
        type: 'success',
        title: 'Order Updated to Pending',
        showConfirmButton: false,
        timer: 1500
      })
    },
    updateOrderCancelled (orderNumber) {
      // find and update
      db.collection('orders')
        .where('order_number', '==', orderNumber)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // Build doc ref from doc.id
            db.collection('orders')
              .doc(doc.id)
              .update({ status: 'cancelled' })
          })
        })
      Swal.fire({
        type: 'success',
        title: 'Order Updated to Cancelled',
        showConfirmButton: false,
        timer: 1500
      })
    },
    updateOrderFinished (orderNumber) {
      this.order.status = 'finished'

      // find and update
      db.collection('orders')
        .where('order_number', '==', orderNumber)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // Build doc ref from doc.id
            db.collection('orders')
              .doc(doc.id)
              .update({ status: 'finished' })
          })
        })
      Swal.fire({
        type: 'success',
        title: 'Order Updated to Finished',
        showConfirmButton: false,
        timer: 1500
      })
    }
  },
  created () {
    let orderNumber = this.$route.params.order_number
    db.collection('orders')
      .where('order_number', '==', orderNumber)
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          this.order = doc.data()
        })
      })
  }
}
</script>

<style>
</style>

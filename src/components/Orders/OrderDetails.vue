<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-container>
      <h1 class="text-center">Order Details</h1>
      <v-divider></v-divider>
      <div>
        <v-layout class="my-2">
          <v-flex sm6>
            <h2>Table Number: <span class="primary--text">{{order.table_number}}</span></h2>
            <div class="order-details">
              <h5>
              <small>Order No - </small>
              <small>{{order.order_number}}</small>
            </h5>
            <h5>
              <small>Order Status ........................  </small>
             <small><b>{{order.status}}</b></small>
            </h5>

            <h5 v-if="order.type">
              <small>Order Type ........................  </small>
              <small><b>{{order.type}}</b></small>
            </h5>

            <h5>
              <small>Order Date ........................  </small>
              <small><b>{{orderDate(order.time.toDate())}}</b></small>
            </h5>
            <h5>
              <small>Order Time ........................  </small>
              <small><b>{{orderTime(order.time.toDate())}}</b></small>
            </h5>

            <h5 v-if="order.orders.length">
              <small>Variety of Items ........................  </small>
              <small><b>{{order.orders.length}}</b></small>
            </h5>

            <h5 v-if="order.total_price" class="">
              <small>Total Price ........................</small>
              <small class="font-custom"><b>₱ {{order.total_price}}</b></small>.
            </h5>
            </div>
          </v-flex>

          <v-flex sm6>
            <v-layout>
              <v-flex xs12 v-if="order.orders.length">
                <v-card flat class="ml-2 mt-5">
                  <v-container>
                    <v-layout
                      justify-space-around
                      v-for="item in order.orders"
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
              <v-flex xs12 v-if="order.chickens">
                <v-card flat class="ml-2 mt-5">
                  <v-container>
                    <v-layout
                      align-center
                      row
                      v-for="chicken in order.chickens"
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
                        v-for="sauce in order.sauces"
                        :key="sauce.id"
                      >
                        <v-flex xs4>
                          <p>{{sauce.name}}</p>
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
      </div>

      <v-layout class="mt-5" row justify-center>
        <v-flex xs12 v-if="order.orders.length">
          <h2>Order Items</h2>
          <v-card flat v-for="item in order.orders" :key="item.id">
            <v-container>
              <v-layout row justify-space-around align-center>
                <v-flex xs4 >
                 <div class="text-center">
                    <img :src="item.image ? item.image : '/haruxlogo.png'" class="product-table-image" :alt="item.name" />
                 </div>
                </v-flex>
                <v-flex xs3 >
                  <h4>{{item.name}}</h4>
                </v-flex>
                <v-flex xs2>
                  <h4><b>{{item.quantity}}</b></h4>
                </v-flex>
                <v-flex xs2>
                  <b class="font-custom" v-if="item.price">₱ {{item.price}}</b>
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
                  <img :src="chicken.image ? chicken.image : '/haruxlogo.png'" class="product-table-image" :alt="chicken.name" />
                </v-flex>
                <v-flex xs3>
                  <h5 class="font-weight-bold">{{chicken.name}}</h5>
                </v-flex>
                <v-flex>
                  <h5 v-if="!chicken.kidQty && chicken.price"><b>₱ {{chicken.price}}</b></h5>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
          <v-divider ></v-divider>
          <v-card flat>
          <v-container>
              <v-layout
                flat
                align-center
                v-for="sauce in order.sauces"
                :key="sauce.id"
              >
              <v-flex xs1></v-flex>
                <v-flex xs3>
                  <img :src="sauce.image ? sauce.image : '/haruxlogo.png'" class="product-table-image" :alt="sauce.name" />
                </v-flex>
                <v-flex xs3>
                  <h5>{{sauce.name}}</h5>
                </v-flex>
                <v-flex xs3>
                  <h5 style="color: #cb7a43 " class="font-weight-bold">{{sauce.quantity}}</h5>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
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
      return moment(date).format('MMM. DD YYYY')
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
.order-details {
 background: rgb(235, 223, 205);
 padding: 20px;
}

.order-details h5 {
  line-height: 25px;
}

</style>

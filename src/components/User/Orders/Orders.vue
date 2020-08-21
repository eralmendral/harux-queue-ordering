<template>
  <v-container fluid>
    <br>
    <h3 class=" text-center primary--text">
      <small>****</small> My Orders
      <small>****</small>
    </h3>
    <br>
    <v-card
      v-for="ordernum in tableProfile.orders"
      flat
      :key="ordernum"
      class="border border-warning  pa-3 mb-5"
      style="background: #fff"
    >
      <v-card-text>
        <p>
          <small>Order No.:</small>
          {{ordernum}}
        </p>
        <div v-for="orders in fetchMyOrders(ordernum)" :key="orders">
          <h5 class="my-2">
            <small>
              Order Status ........................
              <v-chip
                class="white--text"
                :class="orders.status == 'pending' ? 'green' : 'brown'"
              >{{orders.status}}</v-chip>
            </small>
          </h5>

          <h5 class="my-2" v-if="orders.type">
            <small>
              Order Type ........................
              <v-chip
                class="white--text"
                :class="orders.type == 'Dine' ? 'success' : 'primary'"
              >{{orders.type}}</v-chip>
            </small>
          </h5>

          <h5 class="my-2" v-if="orders.orders.length">
            <small>
              Variety of Items ........................
              {{orders.orders.length}}
            </small>
          </h5>

          <h5 class="my-2">
            <small>
              Order Date ........................
              {{orderDate(orders.time.toDate())}}
            </small>
          </h5>
          <h5 class="my-2">
            <small>
              Order Time ........................
              {{orderTime(orders.time.toDate())}}
            </small>
          </h5>

          <h5 class="my-2">
            <small>
              Total Price ........................
              ₱
              <v-chip class="pink white--text font-weight-bold">{{orders.total_price}}</v-chip>
            </small>
          </h5>
          <hr />
          <div v-if="orders.orders.length">
            <h6>Items</h6>
            <v-card flat v-for="item in orders.orders" :key="item.id">
              <v-container>
                <v-layout row justify-space-around align-center>
                  <v-flex xs4>
                    <div class="text-center">
                      <img :src="item.image" width="80px" height="80px" :alt="item.name" />
                    </div>
                  </v-flex>

                  <v-flex xs4>
                    <h5>{{item.name}}</h5>
                  </v-flex>
                  <v-flex xs1>
                    <h5>{{item.quantity}}</h5>
                  </v-flex>
                  <v-flex xs1>
                    <h5>₱ {{item.price}}</h5>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </div>
          <div v-else>
            <h6>Chickens</h6>
            <v-card flat v-for="chicken in orders.chickens" :key="chicken.id">
              <v-container>
                <v-layout row justify-space-around align-center>
                  <v-flex xs4>
                    <div class="text-center">
                      <img :src="chicken.image" width="80px" height="80px" :alt="chicken.name" />
                    </div>
                  </v-flex>
                  <v-flex xs6>
                    <h5 class="text-center">{{chicken.name}}</h5>
                  </v-flex>
                  <v-flex xs2>
                    <h5 v-if="!chicken.unli">₱ {{chicken.price}}</h5>
                  </v-flex>
                </v-layout>

                <v-layout class="my-1 pa-3" v-if="chicken.adultQty || chicken.kidQty">
                  <v-flex>
                    <v-layout justify-center v-if="chicken.adultQty > 0">
                      <v-flex xs4>
                        <h5>Adults: <b>{{chicken.adultQty}}</b></h5>
                      </v-flex>

                      <v-flex xs4>
                        <h5 class="pink--text">₱ {{chicken.total_price_adult}}</h5>
                      </v-flex>
                    </v-layout>

                    <v-layout justify-center v-if="chicken.kidQty > 0">
                      <v-flex xs4>
                        <h5>Kids: <b>{{chicken.kidQty}}</b></h5>
                      </v-flex>

                      <v-flex xs4>
                        <h5 class="pink--text">₱ {{chicken.total_price_kid}}</h5>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>

            <h6>Sauces</h6>
            <v-card flat v-for="sauce in orders.sauces" :key="sauce.id">
              <v-container>
                <v-layout row justify-space-around align-center>
                  <v-flex xs4>
                    <div class="text-center">
                      <img :src="sauce.image" width="80px" height="80px" :alt="sauce.name" />
                    </div>
                  </v-flex>
                  <v-flex xs4>
                    <h5>{{sauce.name}}</h5>
                  </v-flex>
                  <v-flex xs2>
                    <h5 class="pink--text font-weight-bold">{{sauce.quantity}}</h5>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </div>
        </div>
      </v-card-text>
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
import { db } from '@/config/firebase'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  data () {
    return {
      allorders: [],
      myorders: []
    }
  },
  computed: {
    ...mapGetters(['tableProfile'])
  },
  methods: {
    orderDate (date) {
      return moment(date).format('MMMM Do YYYY')
    },
    orderTime (date) {
      return moment(date).format('h:mm:ss a')
    },
    fetchMyOrders: function (ordernum) {
      return this.allorders.filter(order => order.order_number === ordernum)
    }
  },
  created () {
    db.collection('orders').onSnapshot(querySnapshot => {
      this.allorders = []
      querySnapshot.forEach(doc => {
        this.allorders.push(doc.data())
      })
    })
  }
}
</script>

<style>
</style>

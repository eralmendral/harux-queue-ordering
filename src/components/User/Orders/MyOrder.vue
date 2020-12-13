<template>
  <v-container
    fluid
    class="mt-50"
  >
    <h2 class="my-3 text-center primary--text">
      <small>**** </small>Order Detail<small> ****</small>
    </h2>
    <br />

    <v-card flat>
      <v-card-text>
        <p>
          <small>Order No.:</small>
          {{order.order_number}}
        </p>
        <div>
          <h5>
            <small>Order Status ........................</small>
            <small><b>{{order.status}}</b></small>
          </h5>

          <h5 v-if="order.type">
            <small>Order Type ........................</small>
            <small><b> {{order.type}}</b></small>
          </h5>

          <h5 v-if="order.orders">
            <small>Variety of Items ........................</small>
            <small><b>{{order.orders.length ? order.orders.length : ''}}</b></small>
          </h5>

          <h5>
            <small>Order Date ........................</small>
            <small><b>{{order.time ? orderDate(order.time.toDate()) : '' }}</b></small>
          </h5>
          <h5>
            <small>Order Time ........................</small>
            <small><b>{{order.time ? orderTime(order.time.toDate()) : '' }}</b></small>
          </h5>

          <h5 class="my-2">
            <small>Total Price ........................</small>
            <small class="font-custom"><b>₱ {{order.total_price}}</b></small>.
          </h5>
        </div>
        <hr />

        <div v-if="order.orders && order.orders.length">
          <h2>Order Items</h2>
          <v-card
            flat
            v-for="item in order.orders"
            :key="item.id"
          >
            <v-container fluid>
              <v-layout
                row
                justify-space-around
                align-center
              >
                <v-flex xs4>
                  <div class="text-center">
                    <img
                      :src="item.image ? item.image : '/haruxlogo.png'"
                      class="product-table-image myorder-item-image"
                      :alt="item.name"
                    />
                  </div>
                </v-flex>
                <v-flex xs3>
                  <h4 class="font-custom product-name">{{item.name}}</h4>
                </v-flex>
                <v-flex xs2>
                  <h4 clas="product-qty"><b>{{item.quantity}}</b></h4>
                </v-flex>
                <v-flex xs2>
                  <h4 class="product-price"><b v-if="item.price">₱ {{item.price}}</b></h4>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </div>
        <div v-if="order.chickens">
          <h2>Chickens</h2>
          <v-card
            flat
            v-for="chicken in order.chickens"
            :key="chicken.id"
          >
            <v-container fluid>
              <v-layout
                row
                justify-space-around
                align-center
              >
                <v-flex xs4>
                  <div class="text-center">
                    <img
                      :src="chicken.image ? chicken.image : '/haruxlogo.png'"
                      class="product-table-image myorder-item-image"
                      :alt="chicken.name"
                    />
                  </div>
                </v-flex>
                <v-flex xs4>
                  <h4 class="font-custom  product-name">{{chicken.name}}</h4>
                </v-flex>
                <v-flex xs2>
                  <h4 class="product-price"><b v-if="chicken.price">₱ {{chicken.price}}</b></h4>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
          <div v-if="order.sauces.length > 0">
            <hr />
            <h2>Sauces</h2>
            <v-card
              flat
              v-for="sauce in order.sauces"
              :key="sauce.id"
            >
              <v-container fluid>
                <v-layout
                  flex
                  row
                  justify-space-around
                  align-center
                >
                  <v-flex xs4>
                    <div class="text-center">
                      <img
                        :src="sauce.image ? sauce.image : '/haruxlogo.png'"
                        class="product-table-image myorder-item-image"
                        :alt="sauce.name"
                      />
                    </div>
                  </v-flex>
                  <v-flex xs4>
                    <h4 class="font-custom product-name">{{sauce.name}}</h4>
                  </v-flex>
                  <v-flex xs2>
                    <h4 class="font-weight-bold secondary--text product-qty">{{sauce.quantity}}</h4>
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
import { db } from "@/config/firebase";
import moment from "moment";

export default {
  name: "MyOrder",
  data() {
    return {
      order: {},
    };
  },
  methods: {
    orderDate(date) {
      return moment(date).format("MMM. DD YYYY");
    },
    orderTime(date) {
      return moment(date).format("h:mm:ss a");
    },
    fetchOrder() {
      db.collection("orders")
        .where("order_number", "==", this.$route.params.order_number)
        .onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            this.order = doc.data();
          });
        });
    },
  },
  created() {
    this.fetchOrder();
  },
  watch: {
    "$route.params.order_number": function (orderNumber) {
      this.fetchOrder();
    },
  },
};
</script>

<style>
@media only screen and (max-width: 660px) {
  .myorder-item-image {
    width: 80px !important;
    height: 60px !important;
  }
}
</style>

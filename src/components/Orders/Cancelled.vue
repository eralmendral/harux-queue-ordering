<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-layout>
      <v-flex>
        <v-card flat class="pink darken--2">
          <v-card-title>
            <!-- <v-btn depressed color="pink" class="white--text" to="/dashboard/add-order">
              <span>Add New Order</span>
              <v-icon right>add</v-icon>
            </v-btn>-->
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>

          <v-data-table :headers="headers" :items="orders" :search="search">
            <template v-slot:items="props">
              <td class="text-xs-center">{{ props.item.order_number }}</td>
              <td class="text-xs-center">{{ orderDate(props.item.time.toDate()) }}</td>
              <td class="text-xs-center">{{ orderTime(props.item.time.toDate()) }}</td>

              <td class="text-xs-center">
                <v-btn fab depressed color="primary" class="white--text">{{ props.item.table_number }}</v-btn>
              </td>
              <td class="text-xs-center">Php.{{ props.item.total_price }}</td>

              <!-- action buttons -->
              <td class="text-xs-center">
                <v-btn
                  depressed
                  
                  color="success lighten--4"
                  :to="{name:'order_details',params:{order_number: props.item.order_number}}"
                >
                  <span class="mr-1 white--text">View</span>
                  <v-icon small color="white">visibility</v-icon>
                </v-btn>

                <v-btn
                  depressed
                 
                  color="red lighten--4"
                  @click="deleteOrder(props.item.order_number)"
                >
                  <span class="mr-1 white--text">Delete</span>
                  <v-icon small color="white">delete</v-icon>
                </v-btn>
              </td>
            </template>

            <template v-slot:no-results>
              <v-alert
                :value="true"
                color="error"
                icon="warning"
              >Your search for "{{ search }}" found no results.</v-alert>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout></v-layout>
  </div>
</template>

<script>
import { fb, db } from "@/config/firebase";
import Swal from "sweetalert2";
import moment from "moment";
export default {
  data() {
    return {
      orders: [],
      status: "pending",

      search: "",
      headers: [
        { text: "Order No.", value: "order_number", align: "center" },
        { text: "Order Date", value: "time", align: "center" },
        { text: "Order Time", value: "time", align: "center" },
        { text: "Table", value: "table_number", align: "center" },
        { text: "Cost", value: "total_price", align: "center" },

        { text: "Action", value: "", align: "center" }
      ],
      items: [
        {
          text: "Dashboard",
          disabled: false,
          to: "/dashboard/#"
        },
        {
          text: "Cancelled Orders",
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
    deleteOrder(order_number) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        if (result.value) {
          db.collection("orders")
            .where("order_number", "==", order_number)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                doc.ref.delete();
                Swal.fire("Deleted!", "Order Deleted", "success");
              });
            })
            .catch(err => console.log(err));
        }
      });
    },
    fetchNewOrders() {
      db.collection("orders")
        .where("status", "==", "cancelled")
        .onSnapshot(querySnapshot => {
          this.orders = [];
          querySnapshot.forEach(doc => {
            this.orders.push(doc.data());
          });
        });
    }
  },
  created() {
    this.fetchNewOrders();
  }
};
</script>

<style>
</style>

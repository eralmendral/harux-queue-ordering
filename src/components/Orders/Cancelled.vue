<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
    <h2>Cancelled Orders</h2>
    <v-layout>
      <v-flex>
        <v-card flat class="border">
          <v-card-title>
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

              <td class="text-xs-center primary--text">
                <b>{{ props.item.table_number }}</b>
              </td>
              <td class="text-xs-center"><span v-if="props.item.total_price">₱ {{ props.item.total_price }}</span></td>

              <!-- action buttons -->
              <td class="text-xs-center">
                <v-btn
                  color="primary"
                  :to="{name:'order_details',params:{order_number: props.item.order_number}}"
                >
                  <span class="mr-1 white--text">View</span>
                </v-btn>

                <v-btn
                  color="red"
                  @click="deleteOrder(props.item.order_number)"
                >
                  <span class="mr-1 white--text">Delete</span>
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
import { db } from '@/config/firebase'
import Swal from 'sweetalert2'
import moment from 'moment'
export default {
  data () {
    return {
      orders: [],
      status: 'pending',

      search: '',
      headers: [
        { text: 'Order No.', value: 'order_number', align: 'center' },
        { text: 'Order Date', value: 'time', align: 'center' },
        { text: 'Order Time', value: 'time', align: 'center' },
        { text: 'Table', value: 'table_number', align: 'center' },
        { text: 'Cost', value: 'total_price', align: 'center' },

        { text: 'Action', value: '', align: 'center' }
      ],
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/dashboard/#'
        },
        {
          text: 'Cancelled Orders',
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
    deleteOrder (orderNumber) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(result => {
        if (result.value) {
          db.collection('orders')
            .where('order_number', '==', orderNumber)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                doc.ref.delete()
                Swal.fire('Deleted!', 'Order Deleted', 'success')
              })
            })
        }
      })
    },
    fetchNewOrders () {
      db.collection('orders')
        .where('status', '==', 'cancelled')
        .onSnapshot(querySnapshot => {
          this.orders = []
          querySnapshot.forEach(doc => {
            this.orders.push(doc.data())
          })
        })
    }
  },
  created () {
    this.fetchNewOrders()
  }
}
</script>

<style>
</style>

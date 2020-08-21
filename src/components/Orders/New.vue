<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-layout>

      <v-flex>
        <h2>New Orders</h2>
         <v-card flat>
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
          <v-data-table :headers="headers" :items="orders" :search="search"  :items-per-page="25">
            <template v-slot:items="props">
              <td class="text-xs-center">{{ props.item.order_number }}</td>
              <td class="text-xs-center">{{ orderTime(props.item.time.toDate()) }}</td>
              <td class="text-xs-center">
                <h3 class="primary--text">{{ props.item.table_number }}</h3>
              </td>
              <td class="text-xs-center">₱ {{ props.item.total_price }}</td>
              <td class="text-xs-center">
                <v-select
                  style="width: 100px; display: block; margin: 0 auto"
                  :items="updates"
                  class="mt-3 primary--text"
                  label="Status"
                  v-model="status"
                  @change="updateOrder(props.item.order_number)"
                ></v-select>
              </td>
              <!-- action buttons -->
              <td class="text-xs-center">
                <v-btn
                  color="primary"
                  :to="{name:'order_details',params:{order_number: props.item.order_number}}"
                >
                  <span class="mr-1 white--text">View</span>
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
      search: '',
      status: 'test',
      updates: ['pending', 'finished', 'cancelled'],
      headers: [
        { text: 'Order Number', value: 'order_number', sortable: false, align: 'center' },
        { text: 'Order Time', value: 'time', align: 'center' },
        { text: 'Table', value: 'table_number', align: 'center' },
        { text: 'Cost', value: 'total_price', align: 'center' },
        { text: 'Update', value: '', align: 'center' },
        { text: 'Action', value: '', align: 'center', sortable: false }
      ],
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/dashboard/#'
        },
        {
          text: 'New Orders',
          disabled: true
        }
      ]
    }
  },
  methods: {
    orderTime (date) {
      return moment(date).format('h:mm:ss a')
    },
    fetchNewOrders () {
      db.collection('orders')
        .where('status', '==', 'pending')
        .onSnapshot(querySnapshot => {
          this.orders = []
          querySnapshot.forEach(doc => {
            this.orders.push(doc.data())
          })
        })
    },
    updateOrder (orderNumber) {
      let stat = this.status
      db.collection('orders')
        .where('order_number', '==', orderNumber)

      db.collection('orders')
        .where('order_number', '==', orderNumber)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            db.collection('orders')
              .doc(doc.id)
              .update({ status: stat })
          })
        })

      Swal.fire({
        type: 'success',
        title: 'Order Updated',
        showConfirmButton: false,
        timer: 1500
      })

      this.status = ''
    }
  },
  created () {
    this.fetchNewOrders()
  }
}
</script>

<style>
</style>

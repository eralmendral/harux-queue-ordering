<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
    <h2>Tables</h2>
    <v-layout row>
      <v-flex>
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

          <v-data-table
            :headers="headers"
            :items="users"
            :search="search"
            :hide-default-footer="true"
            disable-pagination
          >
            <template v-slot:items="props">
              <td class="text-xs-center">{{ props.item.table_number }}</td>

              <td class="text-xs-center">
                <v-chip v-if="props.item.orders.length > 1" large class="primary white--text">Yes</v-chip>
              </td>

              <td class="text-xs-center">
                <v-chip
                  v-if="props.item.orders.length && props.item.billingout"
                  large
                  class="pink darken-1 white--text"
                >Yes</v-chip>
              </td>

              <td class>
                <v-btn
                  class="info white--text"
                  :to="{name: 'tablemessages', params: {table_num: props.item.table_number}}"
                >
                  <span>Message</span>
                </v-btn>

                <v-btn
                  color="primary"
                  v-if="props.item.orders.length"
                  :to="{name:'tableallorders', params:{table_num:props.item.table_number}}"
                >
                  <span class="mr-1">Orders</span>
                </v-btn>

                <v-btn
                  v-if="props.item.orders.length"
                  @click="billOut(props.item.table_number)"
                  class="pink white--text"
                >
                  <span>Bill Out</span>
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
  </div>
</template>

<script>
import { db } from '@/config/firebase'
import Swal from 'sweetalert2'

export default {
  name: 'Users',
  data () {
    return {
      search: '',
      message: '',
      headers: [
        { text: 'Table', value: 'table_number', align: 'center' },
        { text: 'Occupied', value: 'orders', align: 'center', sortable: false },
        {
          text: 'Billing Out',
          value: 'billingout',
          align: 'center',
          sortable: false
        }
      ],
      users: [],
      loading: false,
      dialog: false,
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/dashboard/#'
        },
        {
          text: 'Tables',
          disabled: true
        }
      ]
    }
  },
  computed: {},
  methods: {
    sendMessage (tablenum) {
      let ref = db.collection('messages').doc()
      ref
        .set({
          id: ref.id,
          table_number: tablenum,
          message: this.message,
          created_at: new Date()
        })
        .then(() => {
          Swal.fire({
            type: 'success',
            title: 'Message Sent',
            showConfirmButton: false,
            timer: 1500
          })
        })
        .catch((err) => err)

      this.dialog = false
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
      }).then((result) => {
        if (result.value) {
          db.collection('users')
            .where('table_number', '==', tablenum)
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
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
        }
      })
    },
    getUsers () {
      db.collection('users')
        .orderBy('table_number', 'asc')
        .onSnapshot((querySnapshot) => {
          this.users = []
          querySnapshot.forEach((doc) => {
            this.users.push(doc.data())
          })
        })
    }
  },
  created () {
    this.getUsers()
  }
}
</script>

<style >
</style>

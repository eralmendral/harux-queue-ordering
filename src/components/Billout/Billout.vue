<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
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

          <v-data-table :headers="headers" :items="users" :search="search">
            <template v-slot:items="props">
              <td class="text-xs-center">{{ props.item.table_number }}</td>

              <td class="text-xs-center">
                <v-btn
                  depressed
                  color="info lighten--4"
                  v-if="props.item.orders.length"
                  :to="{name:'tableallorders', params:{table_num:props.item.table_number}}"
                >
                  <span>Orders</span>
                  <v-icon color="white">visibility</v-icon>
                </v-btn>

                <v-dialog v-model="dialog" width="500">
                  <template v-slot:activator="{ on }">
                    <v-btn color="red darken-2" dark v-on="on">Send MEssage</v-btn>
                  </template>

                  <v-card>
                    <v-card-text>
                      <v-form>
                        <label for="message">Message to Table {{props.item.table_number}}</label>
                        <v-text-field label="message" prepend-icon="chat" v-model="message"></v-text-field>
                      </v-form>
                    </v-card-text>

                    <v-card-actions>
                      <v-btn class="success large" @click="sendMessage(props.item.table_number)">
                        <span>Send</span>
                        <v-icon>send</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

                <v-btn
                  v-if="props.item.billingout"
                  @click="billOut(props.item.table_number)"
                  depressed
                  class="success white--text"
                >
                  <span>Bill Out</span>
                  <v-icon color="white" right>check</v-icon>
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
      headers: [{ text: 'Table', value: 'table_number', align: 'center' }],
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
          text: 'Billout',
          disabled: true
        }
      ]
    }
  },
  computed: {},
  methods: {
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
        .catch(err => err)

      this.dialog = false
    },
    getUsers () {
      db.collection('users')
        .where('billingout', '==', true)
        .onSnapshot(querySnapshot => {
          this.users = []
          querySnapshot.forEach(doc => {
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

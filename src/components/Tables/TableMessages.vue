<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-container>
      <p>Message table #: <b class="primary--text">{{table_num}}</b></p>
      <v-form ref="messageForm">
        <v-text-field prepend-icon="chat" v-model="message" label="type a message"></v-text-field>
        <v-btn color="primary" class="white--text" @click="sendMessage">Send</v-btn>
      </v-form>
      <br />
      <v-card>
        <v-card-title>
         <small><b>messages</b></small>
        </v-card-title>

        <v-card-text>
          <v-data-table :headers="headers" :items="messages" :search="search">
            <template v-slot:items="props">
              <td class="text-xs-center">{{orderDate(props.item.created_at.toDate())}}</td>
              <td class="text-xs-center">{{orderTime(props.item.created_at.toDate())}}</td>
              <td class="text-xs-center">{{ props.item.message }}</td>

              <!-- action buttons -->
              <td class="text-xs-center">
                <v-btn color="red" @click="deleteMessage(props.item.id)">
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
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { db } from '@/config/firebase'
import Swal from 'sweetalert2'
import moment from 'moment'
export default {
  data () {
    return {
      messages: [],
      message: '',
      search: '',
      table_num: '',
      headers: [
        { text: 'Date', value: 'created_at', align: 'center' },
        { text: 'Time', value: 'created_at', align: 'center' },
        { text: 'Message', value: 'message', align: 'center', sortable: false },
        { text: 'Action', value: '', align: 'center', sortable: false }
      ],
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/dashboard/#'
        },
        {
          text: 'Table Messages',
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
    sendMessage () {
      let messageForm = this.$refs.messageForm

      let ref = db.collection('messages').doc()

      ref
        .set({
          id: ref.id,
          table_number: this.table_num,
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
          messageForm.reset()
        })
        .catch(err => err)
    },
    deleteMessage (id) {
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
          db.collection('messages')
            .doc(id)
            .delete()
            .then(() => {
              Swal.fire('Deleted!', 'Message Deleted.', 'success')
            })
        }
      })
    }
  },
  created () {
    this.table_num = this.$route.params.table_num
    db.collection('messages')
      .where('table_number', '==', this.table_num)
      .onSnapshot(querySnapshot => {
        this.messages = []
        querySnapshot.forEach(doc => {
          this.messages.push(doc.data())
        })
      })
  }
}
</script>

<style>
</style>

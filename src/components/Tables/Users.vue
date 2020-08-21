<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
    <h2>Users</h2>
    <v-layout row>
      <v-flex>
        <v-card flat>
          <v-card-title>
            <v-btn class="primary white--text" to="/dashboard/adduser">
              <span>User</span>
              <v-icon>add</v-icon>
            </v-btn>

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
              <td class="text-xs-center">{{ props.item.email }}</td>
              <td class="text-xs-center">
                <v-btn
                  color="info"
                  :to="{name: 'edituser', params: {userid: props.item.id}}"
                >
                  <span class="mr-1">Edit</span>
                </v-btn>

                <v-btn color="red" @click="deleteUser(props.item.id)">
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
  </div>
</template>

<script>
import { db } from '@/config/firebase'
import Swal from 'sweetalert2'
import axios from 'axios'
export default {
  name: 'Users',
  data () {
    return {
      search: '',
      headers: [
        { text: 'Table', value: 'table_number', align: 'center' },
        { text: 'Email', value: 'status', align: 'center', sortable: false }
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
          text: 'Users',
          disabled: true
        }
      ]
    }
  },
  computed: {},
  methods: {
    getUsers () {
      db.collection('users')
        .where('role', '==', 'user')
        .orderBy('table_number', 'asc')
        .onSnapshot(querySnapshot => {
          this.users = []
          querySnapshot.forEach(doc => {
            this.users.push(doc.data())
          })
        })
    },
    deleteUser (id) {
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
          axios
            .post(process.env.VUE_APP_API_URL + '/deleteUser', {
              userid: id
            })
            .then(res => {
              Swal.fire({
                type: 'success',
                title: 'User Deleted',
                showConfirmButton: false,
                timer: 1000
              })
            })
        }
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

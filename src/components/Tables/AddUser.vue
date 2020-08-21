<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-layout row wrap>
      <v-flex>
        <v-card flat>
          <v-card-title>
            <h1>Add New User</h1>
          </v-card-title>
          <v-card-text>
            <v-form ref="userform">
              <v-text-field
                prepend-icon="drag_indicator"
                v-model="table.number"
                :rules="numberRules"
                required
                label="Table No."
                @input="checkTable"
              ></v-text-field>
              <p v-if="tableExists" class="primary--text">Table No. Already Exists</p>
              <v-text-field
                prepend-icon="drag_indicator"
                v-model="table.email"
                :rules="emailRules"
                label="Email"
              ></v-text-field>
              <v-text-field
                prepend-icon="drag_indicator"
                v-model="table.password"
                label="Password"
                :rules="inputRules"
              ></v-text-field>

              <v-btn
                large
                class="primary white--text"
                :disabled="disabled || tableExists"
                @click="addUser"
              >
                <span>Add User</span>
                <v-icon right>add</v-icon>
              </v-btn>
            </v-form>

            <p v-if="error !== ''" class="text-xs-center pink white--text pa-2">{{error}}</p>
          </v-card-text>
        </v-card>

        <div class="mt-3">
          <v-btn depressed fab color="red lighten--4" to="/dashboard/users">
            <v-icon color="white">arrow_back</v-icon>
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { db } from '@/config/firebase'
import Swal from 'sweetalert2'
import axios from 'axios'

export default {
  data () {
    return {
      disabled: false,
      tableExists: false,
      table: {
        number: '',
        email: '',
        password: '',
        orders: [],
        billingout: false,
        role: 'user'
      },
      error: '',
      numberRules: [v => /^[0-9]?[0-9]$/.test(v) || 'Invalid Table Number'],
      inputRules: [v => v.length >= 6 || 'Fill at least 6 Characters'],
      emailRules: [
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          'E-mail must be valid'
      ],
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/dashboard/#'
        },
        {
          text: 'Users',
          disabled: false,
          to: '/dashboard/users'
        },
        {
          text: 'Add ',
          disabled: true
        }
      ]
    }
  },
  methods: {
    checkTable () {
      var tableNumber = this.table.number
      tableNumber = String(tableNumber)
      // let categRef = .doc("7DCM24Z8hu0VDLZG85i7");
      db.collection('users')
        .where('table_number', '==', tableNumber)
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            this.tableExists = false
          } else {
            this.tableExists = true
          }
        })
    },
    addUser () {
      this.disabled = true
      var form = this.$refs.userform
      if (form.validate() && !this.tableExists) {
        var tableNumber = this.table.number
        var email = String(this.table.email)
        var password = String(this.table.password)

        axios
          .post('https://haru-6bed6.firebaseapp.com/addUser', {
            email: email,
            password: password
          })
          .then(res => {
            const ref = db.collection('users').doc(res.data.id)

            const table = {
              table_number: tableNumber,
              email: email,
              password: password,
              orders: [],
              billingout: false,
              role: 'user'
            }

            ref.set({
              id: res.data.id,
              ...table
            })

            Swal.fire({
              type: 'success',
              title: 'User Added',
              showConfirmButton: false,
              timer: 1000
            })

            this.$router.push('/dashboard/users')
            this.error = ''
          })
          .catch(() => {
            this.error = 'Error Adding User: email maybe already taken'
          })

        this.disabled = false
        form.reset()
      }
    }
  }
}
</script>

<style>
</style>

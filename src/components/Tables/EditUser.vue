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
            <h1>Edit User</h1>
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
                @click="updateUser"
              >
                <span>Update User</span>
                <v-icon right>check</v-icon>
              </v-btn>
            </v-form>

            <p v-if="error !== ''" class="text-xs-center primary white--text pa-2">{{error}}</p>
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
        id: '',
        number: '',
        email: '',
        password: '',
        orders: [],
        billingout: false
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
          text: 'Edit',
          disabled: true
        }
      ]
    }
  },
  beforeRouteEnter (to, from, next) {
    db.collection('users')
      .where('id', '==', to.params.userid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            vm.table.id = doc.data().id
            vm.table.number = doc.data().table_number
            vm.table.email = doc.data().email
            vm.table.password = doc.data().password
            vm.table.orders = doc.data().orders
            vm.table.billingout = doc.data().billingout
          })
        })
      })
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
    updateUser () {
      this.disabled = true

      const user = {
        id: this.table.id,
        table_number: this.table.number,
        email: this.table.email,
        password: this.table.password,
        orders: this.table.orders,
        billingout: this.table.billingout,
        role: 'user'
      }

      axios
        .post('https://haru-6bed6.firebaseapp.com/updateUser', {
          userid: user.id,
          email: user.email,
          password: user.password
        })
        .then(res => {
          console.log('Response Data Id', res.data.id)
          //
          db.collection('users')
            .doc(user.id)
            .set({
              ...user
            })

          Swal.fire({
            type: 'success',
            title: 'User Updated',
            showConfirmButton: false,
            timer: 1000
          })

          this.$router.push('/dashboard/users')
          this.disabled = false
        })
        .catch(err => {
          console.log('Error', err)
          this.error = 'Error Updating User: email maybe already taken'
        })
    }
  }
}
</script>

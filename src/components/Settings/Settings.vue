<template>
  <v-container>
    <h1>Settings</h1>

    <hr />
    <!-- start of comment section -->
    <br />
    <br />
    <h3 class="text-center secondary--text mb-2">Comment Section</h3>
    <form ref="commentForm" id="commentForm">
      <v-layout class="my-3" row>
        <v-flex xs2></v-flex>
        <v-flex xs4>
          <div class="form-group">
            <label for="bgcolor">Background Color</label>
            <br />

            <input
              type="color"
              v-model="comment.background"
              id="bgcolor"
              v-bind:style="{ 'background': comment.background  }"
              style="height: 50px; width: 50px font-size: 10px"
            />
          </div>

          <div class="form-group">
            <label for="textcolor">Text Color</label>
            <br />

            <div style="height: 70px; width: 70px;border-radius: 50%">
              <input
                type="color"
                v-model="comment.textColor"
                style="height: 50px; width: 50px font-size: 10px"
                id="textcolor"
                v-bind:style="{ 'background': comment.textColor  }"
              />
            </div>
          </div>

          <div class="form-group">
            <v-text-field label="Sample Text" v-model="comment.sampleText"></v-text-field>
          </div>

          <div class="form-group">
            <v-layout>
              <v-btn
                @click="commentFormReset"
                class="stdBtn primary secondary--text"
                style="height: 50px !important"
              >
                <span>Clear</span>
              </v-btn>
              <v-btn
                @click="saveCommentSettings"
                class="stdBtn secondary"
                style="height: 50px !important"
              >
                <span>Save</span>
              </v-btn>
            </v-layout>
          </div>
        </v-flex>

        <v-flex>
          <h3>Preview</h3>
          <div
            height="250px"
            width="250px"
            v-bind:style="{ 'background': comment.background  }"
            style="padding: 20px"
          >
            <h3
              class="text-center"
              v-bind:style="{ 'color': comment.textColor  }"
              style=" font-family: 'Montserrat', cursive !important;
  font-weight: bolder;"
            >{{comment.sampleText}}</h3>
          </div>
        </v-flex>
      </v-layout>
    </form>
    <!-- end of comment section -->

    <hr />
    <br />
    <br />

    <!-- start of account setting section -->
    <h3 class="text-center secondary--text mb-5">Account Setting</h3>
    <form ref="commentForm" id="accountForm">
      <v-layout class="my-3" justify-center align-center row>
        <v-flex xs12 sm3 mx-3>
          <v-text-field label="Table No." v-model="userData.table_number" @input="checkTable"></v-text-field>
          <p v-if="tableExists" class="pink--text">Table No. Already Exists</p>
        </v-flex>
        <v-flex xs6 sm3 mx-3>
          <v-text-field label="Email" v-model="userData.email"></v-text-field>
        </v-flex>
        <v-flex xs6 sm3 mx-3>
          <v-text-field label="Password" v-model="userData.password"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout justify-center>
        <v-flex xs3>
          <v-btn
            @click="saveAccountSettings"
            class="stdBtn secondary"
            style="height: 50px !important; width: 150px"
            :disabled="tableExists"
          >
            <span>Save</span>
          </v-btn>
        </v-flex>
      </v-layout>

      <v-layout justify-center>
        <p v-if="error !== ''" class="text-xs-center  pink--text pa-2">{{error}}</p>
      </v-layout>
    </form>
    <!-- end of account setting section -->
  </v-container>
</template>

<script>
import { fb, db } from '@/config/firebase'
import Swal from 'sweetalert2'
import axios from 'axios'

export default {
  data () {
    return {
      comment: {
        background: '',
        textColor: '',
        sampleText: 'Lorem Ipsum'
      },
      userAuth: {},
      userData: {
        table_number: '',
        email: '',
        password: ''
      },
      tableExists: false,
      error: ''
    }
  },
  created () {
    // fetch comments
    db.collection('settings')
      .where('name', '==', 'comment')
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          this.comment.background = doc.data().backgroundColor
          this.comment.textColor = doc.data().textColor
        })
      })

    // fetch current auth user
    var user = fb.auth().currentUser
    this.user = user
    // fetch user data in the database
    db.collection('users')
      .doc(this.user.uid)
      .onSnapshot(doc => {
        this.userData = doc.data()
      })
  },
  methods: {
    checkTable () {
      var tableNumber = this.userData.table_number
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
    saveCommentSettings () {
      db.collection('settings')
        .where('name', '==', 'comment')
        .get()
        .then(q => {
          q.forEach(doc => {
            db.collection('settings')
              .doc(doc.id)
              .update({
                backgroundColor: this.comment.background,
                textColor: this.comment.textColor
              })
          })
        })

      Swal.fire({
        type: 'success',
        title: 'Comment Settings Updated',
        showConfirmButton: false,
        timer: 1500
      })
    },
    commentFormReset () {
      this.$refs.commentForm.reset()
    },
    saveAccountSettings () {
      this.disabled = true

      const user = {
        id: this.userData.id,
        table_number: this.userData.table_number,
        email: this.userData.email,
        password: this.userData.password,
        orders: this.userData.orders,
        billingout: this.userData.billingout,
        role: 'admin'
      }

      axios
        .post('https://haru-6bed6.firebaseapp.com/updateUser', {
          userid: user.id,
          email: user.email,
          password: user.password
        })
        .then(res => {
          console.log('Response Data Id', res.data.id)

          if (typeof res.data.id !== 'undefined') {
            db.collection('users')
              .doc(res.data.id)
              .set({
                ...user
              })

            Swal.fire({
              type: 'success',
              title: 'User Updated',
              showConfirmButton: false,
              timer: 1000
            })

            this.disabled = false
            this.error = ''
          } else {
            console.log('Error')
            this.error = 'Error Updating User: email maybe already taken'
          }
        })
        .catch(err => {
          console.log('Error', err)
          this.error = 'Error Updating User: email maybe already taken'
        })
    }
  }
}
</script>

<style>
</style>

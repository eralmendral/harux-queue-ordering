<template>
  <v-content class='login-page'>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm10 md6>
          <v-card class='pa-3 login-form-wrapper'>
            <v-card-title>
              <v-toolbar flat style='margin-top: -50px; background:transparent'>
                <v-toolbar-title>
                  <div class='text-xs-center mx-auto'>
                    <img
                      src='/haruxlogo.png'
                      alt
                      width='120px'
                      class='logo'
                    />
                  </div>
                </v-toolbar-title>
              </v-toolbar>
            </v-card-title>

            <v-card-text>
              <v-form>
                <v-text-field
                  prepend-icon='person'
                  v-model='email'
                  name='email'
                  label='User'
                  type='text'
                  class='pa-3'
                  autocomplete='false'
                ></v-text-field>
                <v-text-field
                  prepend-icon='lock'
                  v-model='password'
                  name='password'
                  label='Password'
                  id='password'
                  type='password'
                  class='pa-3'
                  autocomplete='false'
                ></v-text-field>
              </v-form>
            </v-card-text>
            <div class='text-xs-center'>
              <v-btn class='stdBtn login-submit-btn'  @click='login'>
                <span>Login</span>
                <v-icon right>input</v-icon>
              </v-btn>
            </div>
            <p class='pink--text text-center mt-2' v-if='this.error'>{{this.error}}</p>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { fb, db } from '@/config/firebase'

export default {
  name: 'Login',
  data () {
    return {
      error: '',
      email: 'tb1@haru.ph',
      password: 'password'
    }
  },
  methods: {
    login () {
      if (this.email && this.password) {
        fb.auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(user => {
            this.$router.push('/')
          })
          .catch(err => {
            this.error = err
          })

        this.error = null
      } else {
        this.error = 'Please fill in all fields'
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    fb.auth().onAuthStateChanged(user => {
      if (user) {
        let userid = fb.auth().currentUser.uid
        db.collection('users')
          .doc(userid)
          .get()
          .then(doc => {
            if (doc.data().role === 'admin') {
              next({ name: 'dashboard' })
            } else {
              next({ name: 'user' })
            }
          })
      } else {
        next()
      }
    })
  }
}
</script>

<style>

.login-page {
  font-family: 'Raleway';
  height:100vh;
  background:url('/img/loginbackground.jpg');
  background-size: cover;
}

.logo {
  display: block;
  margin: 0 auto 10% auto;
  width: 25%;
  min-width: 150px !important;
}

.login-form-wrapper {
  background-image: linear-gradient(to right, #c1c161 0%, #c1c161 0%, #d4d4b1 100%);
  color: #fff;
  border-radius: 1px;
}

.login-submit-btn {
  height: 60px;
  width: 250px;
  font-size: 24px;
  border: 1px solid #261c1d !important
}

@media only screen and (max-width:600px) {
   .login-submit-btn {
      height: 50px;
      width: 150px;
      font-size: 16px;
  }
}

</style>

<template>
  <div>
    <Order />
     <v-divider></v-divider>
    <Billout />
  </div>
</template>

<script>
import { fb, db } from '@/config/firebase'
import Order from './Order'
import Billout from './Billout'
export default {
  components: {
    Order,
    Billout
  },
  beforeRouteEnter (to, from, next) {
    fb.auth().onAuthStateChanged(user => {
      if (user) {
        let userid = fb.auth().currentUser.uid
        db.collection('users').doc(userid).get().then((doc) => {
          if (doc.data().role !== 'admin') {
            next({ name: 'user' })
          } else {
            next()
          }
        })
      } else {
        next({ name: 'login' })
      }
    })
  }
}
</script>

<style>
</style>

<template>
    <div>
      <Slideshow />
      <Comments />
      <Categories :categories="fetchFeaturedCategories" />
      <Billout v-if="tableProfile.orders.length > 0" />
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
    </div>
</template>

<script>
import { fb, db } from '@/config/firebase'
import Slideshow from '@/components/User/Home/Slideshow'
import Comments from '@/components/User/Home/Comments'
import Categories from '@/components/User/Home/Categories'
import Billout from '@/components/User/Home/Billout'

import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Slideshow,
    Categories,
    Billout,
    Comments
  },
  methods: {
    ...mapActions(['setTableProfile', 'setCategories'])
  },
  created () {
    let userid = fb.auth().currentUser.uid
    db.collection('users')
      .doc(userid)
      .onSnapshot(doc => {
        this.setTableProfile(doc.data())
      })
  },
  computed: {
    ...mapGetters([
      'tableProfile',
      'occupied',
      'billingOut',
      'fetchFeaturedCategories',
      'fetchProducts'
    ])
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

<template>
  <h3>
    <v-btn @click="logout">Logout</v-btn>
  </h3>
</template>

<script>
import { fb } from '@/config/firebase'
export default {
  methods: {
    logout () {
      fb.auth()
        .signOut()
        .then(() => {
          this.$router.push('/login')
        })
        .catch(err => console.log(err))
    }
  }
}
</script>

<style>
</style>

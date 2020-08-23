<template>
  <v-app class="grey lighten-4" >
      <router-view></router-view>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      app: true
    }
  },
  components: {
  }
}
</script>

<style>

</style>

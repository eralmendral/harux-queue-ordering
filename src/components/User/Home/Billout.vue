<template>
  <v-layout column wrap justify-center class="mb-5">
    <div class="text-center">
      <v-btn :disabled="tableProfile.billingout == true" @click="billout" class="billout-btn">
        <h3>BILLOUT</h3>
      </v-btn>

    </div>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      billingOut: []
    }
  },
  methods: {
    ...mapActions(['billout']),
    notif (tableNumber) {
    }
  },
  computed: {
    ...mapGetters(['tableProfile'])
  }
}
</script>

<style>
.billout-btn {
  margin-bottom: 30px;
  width: 150px;
  height: 70px;
  background: #261c1d !important;
  color: #cb7a43 !important;
}
</style>

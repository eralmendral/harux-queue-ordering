<template>
  <v-layout wrap justify-center>
    <div class="billout text-center">
      <v-btn class="billout-btn" disabled="tableProfile.billingout == true" @click="billout">
        <h3 class="billout-text">Billout</h3>
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

.billout-text {
  font-weight: bold;
  text-transform: none;
  letter-spacing: 3px;
}

.line-through {
  text-decoration: line-through;
}

.billout-btn[disabled], .billout-btn:disabled {
  background: #6e6c6c !important;
  color: #cb7a43 !important;
}
</style>

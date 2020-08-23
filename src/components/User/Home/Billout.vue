<template>
  <v-layout wrap justify-center>
      <v-btn class="billout-btn bg-danger" disabled="tableProfile.billingout == true" @click="billout">
        <h3 class="billout-text">Billout</h3>
      </v-btn>
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

@media only screen and (max-width: 660px) {
  .billout-btn {
    width: 100px;
    height: 70px;
  }

  .billout-text {
    font-size: 21px !important;
  }
}
</style>

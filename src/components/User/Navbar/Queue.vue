<template>
      <v-layout flex class="ordersQueueBar">
      <v-btn
        v-for="(order,index) in orderQueue"
        :key="order.id"
        class="mx-3 qtableBox"
        :class="[order.table_number == tableProfile.table_number? 'primary' : 'secondary', tableProfile.table_number == order.table_number ? `index--${index}` : '']"
      >
        <router-link
          :to="{name: 'userorder', params: {order_number: order.order_number}}"
          v-if="order.table_number == tableProfile.table_number"
          style="width: 100%; height: 100%; background-color:'red'; z-index: 999"
        >
          <h2 class="qtableNumber secondary--text"><span>{{order.table_number}}</span></h2>
        </router-link>
        <div v-else>
          <h2 class="qtableNumber primary--text">
            <span>{{order.table_number}}</span>
          </h2>
        </div>
      </v-btn>
    </v-layout>
</template>

<script>
import { db } from '@/config/firebase'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      unShowQueue: 0,
      showQueue: true,
      orderQueue: []
    }
  },
  methods: {
    myTable (orderTableNumber) {
      return 'background: #26b578 !important; width: 100px'
    }
  },
  created () {
    db.collection('orders')
      .orderBy('time', 'asc')
      .where('status', '==', 'pending')
      .onSnapshot(querySnapshot => {
        this.orderQueue = []
        querySnapshot.forEach(doc => {
          this.orderQueue.push(doc.data())
        })
      })
  },
  computed: {
    ...mapGetters(['tableProfile'])
  }
}
</script>

<style>
.qtableBox {
  outline: none !important;
  height: 75px;
}

.qtableNumber {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  margin-top: 5px;
}

.ordersQueueBar {
  position: fixed;
  bottom: -10px;
  background: #180e03;
  border: 1px solid #ddae6a;
  width: 100%;
  height: 100px;
  overflow-x: scroll;
  overflow-y: hidden;
  z-index: 999;
}
</style>

<template>
      <v-layout flex class="ordersQueueBar">
      <v-btn
        v-for="(order,index) in orderQueue"
        :key="order.id"
        class="mx-3 qtableBox"
        :class="[order.table_number == tableProfile.table_number? 'myTable' : 'notmyTable', tableProfile.table_number == order.table_number ? `index--${index}` : '']"
      >
        <router-link
          :to="{name: 'userorder', params: {order_number: order.order_number}}"
          v-if="order.table_number == tableProfile.table_number"
        >
          <h3 class="white--text">{{order.table_number}}</h3>
        </router-link>
        <div v-else>
          <h3 class="white--text">
            <span class="white--text">{{order.table_number}}</span>
          </h3>
        </div>
      </v-btn>
    </v-layout>
</template>

<script>
import { fb, db } from "@/config/firebase";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      unShowQueue: 0,
      showQueue: true,
      orderQueue: []
    };
  },
  methods: {
    myTable(orderTableNumber) {
      return "background: #26b578 !important; width: 100px";
    }
  },
  created() {
    db.collection("orders")
      .orderBy("time", "asc")
      .where("status", "==", "pending")
      .onSnapshot(querySnapshot => {
        this.orderQueue = [];
        querySnapshot.forEach(doc => {
          this.orderQueue.push(doc.data());
        });
      });
  },
  computed: {
    ...mapGetters(["tableProfile"])
  }
};
</script>

<style>
.myTable {
  background: #8db600 !important;
}
.notmyTable {
  background: #5a5c5b !important;
}
.qtableBox {

   
  height: 75px;
  color: rgb(223, 220, 202);
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

@keyframes blink {
    from{background: rgb(182, 182, 172)}
    to{background: red}
}


.index--0{
  animation: blink;
  animation-duration: .4s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease-in-out;
}


</style>

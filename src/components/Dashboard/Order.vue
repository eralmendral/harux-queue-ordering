<template>
  <div>
    <h1>Orders Que</h1>
    <v-layout align-center class="ordersQueueDashboard">
      <v-btn v-for="(order) in orderQueue" :key="order.id" class="mx-3 pa-3 tableBox">
        <div>
          <h1 class="white--text">{{order.table_number}}</h1>
          <v-btn
            small
            fab
            color="info"
            :to="{name:'order_details',params:{order_number: order.order_number}}"
          >
            <v-icon class="white--text">visibility</v-icon>
          </v-btn>

          <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{ on }">
              <v-btn small color="success darken-2" fab dark v-on="on">
                <v-icon class="white--text">chat</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-card-text>
                <v-form>
                  <label for="message">Message to Table {{order.table_number}}</label>
                  <v-text-field label="message" prepend-icon="chat" v-model="message"></v-text-field>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-btn class="success large" @click="sendMessage(order.table_number)">
                  <v-icon >send</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-btn small fab color="primary">
            <v-icon class="white--text" @click="updateOrderFinished(order.order_number)">check</v-icon>
          </v-btn>
        </div>
      </v-btn>
    </v-layout>
  </div>
</template>

<script>
import { fb, db } from "@/config/firebase";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      billingout: 0,
      orderQueue: [],
      dialog: false,
      message: ""
    };
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
  methods: {
    sendMessage(tablenum) {
      let ref = db.collection("messages").doc();
      ref
        .set({
          id: ref.id,
          table_number: tablenum,
          message: this.message,
          created_at: new Date()
        })
        .then(() => {
          Swal.fire({
            type: "success",
            title: "Message Sent",
            showConfirmButton: false,
            timer: 1500
          });
        })
        .catch(err => err);

      this.dialog = false;
    },
    updateOrderFinished(order_num) {
      
      //find and update
      db.collection("orders")
        .where("order_number", "==", order_num)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {

           // Build doc ref from doc.id
            db.collection("orders")
              .doc(doc.id)
              .update({ status: "finished" });
          });
        });
      Swal.fire({
        type: "success",
        title: "Order Updated to Finished",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
};
</script>

<style>
.tableBox {
  width: 160px;
  height: 160px;
  border-radius: 10px;
  background: #2c302e !important;
  color: #05b345 !important;
}

.ordersQueueDashboard {
  border: 1px solid #f2f2f2;
  margin: 10px;
  width: 100%;
  height: 250px;
  padding: 10px;
  overflow-y: hidden;
  overflow-x: scroll;
}
</style>
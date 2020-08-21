<template>
  <div>
    <h1>Billing Out</h1>
    <v-layout align-center class="billoutDashboard">
      <v-btn v-for="table in billingOut" :key="table.id" class="mx-3 billout-box">
        <div>
          <br />
          <h1 class="white--text">{{table.table_number}}</h1>

          <v-btn small fab color="info" :to="{name:'tableallorders', params:{table_num:table.table_number}}">
            <v-icon class="white--text">visibility</v-icon>
          </v-btn>

          <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{ on }"> 
              <v-btn small color="success darken-2" fab dark v-on="on" >
                <v-icon class="white--text">chat</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-card-text>
                <v-form>
                  <label for="message">Message to Table {{table.table_number}}</label>
                  <v-text-field label="message" prepend-icon="chat" v-model="message"></v-text-field>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-btn class="success large" @click="sendMessage(table.table_number)">
                  <v-icon small >send</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-btn small fab color="pink">
            <v-icon class="white--text" @click="billOut(table.table_number)">check</v-icon>
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
      billingOut: [],
      dialog: false,
      message: ""
    };
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
    billOut(tablenum) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Billout!"
      }).then(result => {
        if(result.value){
           db.collection("users")
          .where("table_number", "==", tablenum)
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
           
              // Build doc ref from doc.id
              db.collection("users")
                .doc(doc.id)
                .update({ billingout: false, orders:[], sauce: false });
            });
          });
        Swal.fire({
          type: "success",
          title: "Table Billed Out",
          showConfirmButton: false,
          timer: 1500
        });
        }
      });

    }
  },
  created() {
    db.collection("users")
      .where("billingout", "==", true)
      .onSnapshot(querySnapshot => {
        this.billingOut = [];
        querySnapshot.forEach(doc => {
          this.billingOut.push(doc.data());
        });
      });
  }
};
</script>

<style >
.billout-box {
  width: 160px;
  height: 160px;
  border-radius: 10px;
  background: #ad104c !important;
  color: #05b345 !important;
}
.billoutDashboard {
  border: 1px solid #f2f2f2;
  margin: 10px;
  width: 100%;
  height: 200px;
  padding: 10px;
  overflow-y: hidden;
  overflow-x: scroll;
}
.billingout {
  background: red;
  animation: example ease-in 0.5s infinite;
}

@-webkit-keyframes example {
  from {
    background-color: red;
  }
  to {
    background-color: yellow;
  }
}

/* Standard syntax */
@keyframes example {
  from {
    background-color: red;
  }
  to {
    background-color: yellow;
  }
}
</style>

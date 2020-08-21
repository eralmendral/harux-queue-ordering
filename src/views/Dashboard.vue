<template>
  <v-container fluid>
    <Navbar></Navbar>
    <router-view></router-view>
    <notifications group="billed-out" v-once position="top right" classes="my-style"/>
  </v-container>
</template>

<script>
import Navbar from '@/components/Navbar'
import { db } from '@/config/firebase'
import Vue from 'vue'
export default {
  name: 'Dashboard',
  components: {
    Navbar
  },
  created () {
    db.collection('billout').onSnapshot(function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        if (change.type === 'added') {
        }
        if (change.type === 'modified') {
          Vue.notify({
            group: 'billed-out',
            title: 'New Table Billing Out !',
            duration: 1000,
            speed: 1000
          })
        }
        if (change.type === 'removed') {
        }
      })
    })
  }
}
</script>

<style lang="scss">
a:hover {
  text-decoration: none !important;
}

label {
 font-family: 'Raleway';
 font-weight: 600;
}

table.v-table thead th {
  font-size: 18px !important;
  font-weight: bold;
  font-family: 'Raleway';
}

table.v-table tbody td {
  font-size: 18px !important;
  font-family: 'Raleway';
}

h1, h2{
  font-family: "Do Hyeon", sans-serif !important;
}

.font-custom {
  font-family: "Do Hyeon", sans-serif !important;
}

h3, h4,h5 ,h6 , p {
    font-family: "Raleway";
}

img {
  border-radius: 5px;
  margin: 5px;
}

.product-table-image {
  width: 120px;
  height: 100px;
  border-radius: 1px;
  filter: saturate(2)
}

/* scrollbar */
::-webkit-scrollbar {
  width: 3px;
}

/* Track */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: grey;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #cb7a43;
}

/* Buttons */
.stdBtn {
  background: #261c1d !important;
  color: #cb7a43 !important;
  border: none !important;
  height: 70px;
}

.circleBtn {
  display: block;
  background: #261c1d !important;

  width: 60px !important;
  height: 60px !important;
  border-radius: 50%;
  margin: 0px 5px;
}
.circleBtn {
  display: block;
  background: #ddae6a !important;
  width: 60px !important;
  height: 60px !important;
  border-radius: 50%;
  margin: 0px 5px;
}

.disabledBtn {
  background: #959494 !important;
}

.product_img {
  width: 70px;
  height: 70px;
  border: 1px dotted #cb7a43;
}

.product_img_large {
  width: 90px;
  height: 90px;
}

.product_title {
}

.product_title_large {
  /* primary--text text--darken-2 font-weight-bold text-center */
}

.product_checkbox {
}

input[type="checkbox"] {
  transform: scale(3);
}

/* VUE NOTIFICATION */

.my-style {
  // Style of the notification itself
  padding: 10px;
  margin: 0 5px 5px;
  margin-top: 10px;
  font-size: 14px;
  font-family: "Roboto";
  color: #ffffff;
  background: rgb(218, 49, 133) !important;
  border-left: 5px solid rgb(195, 20, 87);
  .notification-title {
    // Style for title line
  }

  .notification-content {
    // Style for content
  }

  &.my-type {
    /*
    Style for specific type of notification, will be applied when you
    call notification with "type" parameter:
    this.$notify({ type: 'my-type', message: 'Foo' })
    */
  }
}

/* color:rgb(243, 143, 35) TEXT COLOR OF ADMIN NAVBAR, ORANGE */

// media screen

/* Portrait */
@media only screen and (max-width: 420px) {
  .sauce_title {
    font-size: 14px;
    font-weight: bold;
  }

  .circleBtn {
    width: 40px !important;
    height: 40px !important;
  }

  .stdBtn {
    height: 50px;
  }

  .product_img {
  width: 50px;
  height: 50px;

}

}
</style>

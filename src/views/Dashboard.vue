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

.mt-50 {
  margin-top: 50px !important;
}

.mt-100 {
  margin-top: 100px !important;
}

.mb-100 {
  margin-bottom: 100px !important;
}

.mb-150 {
  margin-bottom: 150px !important;
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

h3, h4,h5 ,h6 , p {
    font-family: "Raleway";
}

.cursor-pointer {
  cursor: pointer;
}

.font-custom {
  font-family: "Do Hyeon", sans-serif !important;
}

button {
  outline: none !important;
}

.confirm-button {
  margin-bottom: 100px;
  padding: 32px;
  font-size: 21px;
  z-index:999
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

.product-preview-image {
  width: 180px;
  height: 150px;
  border-radius: 1px;
  filter: saturate(2)
}

.product-view-image {
  width: 360px;
  height: 300px;
  border-radius: 1px;
  filter: saturate(2)
}

/* scrollbar */
::-webkit-scrollbar {
  height: 4px;              /* height of horizontal scrollbar ← You're missing this */
  width: 4px;               /* width of vertical scrollbar */
}

/* Track */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(161, 108, 84);
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
  width: 40px !important;
  height: 40px !important;
  border-radius: 50%;
  margin: 5px 15px;
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
}

/* color:rgb(243, 143, 35) TEXT COLOR OF ADMIN NAVBAR, ORANGE */

// media screen

/* Portrait */
@media only screen and (max-width: 660px) {
  .product-table-image {
    width: 90px;
    height: 70px;
  }

  h2 {
    font-size: 21px;
  }
}
</style>

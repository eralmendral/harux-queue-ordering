<template>
  <div>
    <h1 class="text-xs-center">Add Order</h1>
    <v-layout row>
      <v-flex>
        <v-form>
          <v-select :items="tables" label="Table No" v-model="order.table"></v-select>
        </v-form>

        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="products" :search="search">
            <template v-slot:items="props">
              <td class="text-xs-center">{{ props.item.name }}</td>
              <td class="text-xs-center">{{ props.item.category }}</td>
              <td class="text-xs-center">
                <img :src="props.item.images[0]" width="80px" class="pa-2" :alt="props.item.name" />
              </td>
              <td class="text-xs-center">
                <v-chip
                  small
                  :color="props.item.status == true || props.item.status == 'available' ? 'green' : 'pink'"
                >{{props.item.status == true || props.item.status == 'available' ? 'Available' : 'Unavailable'}}</v-chip>
              </td>
              <td class="text-xs-center">{{ props.item.price }}</td>
              <td class="text-xs-center">{{ props.item.quantity }}</td>
              <!-- action buttons -->
              <td class="text-xs-center">
                <div v-if="props.item.status == true || props.item.status == 'available'">
                  <v-btn
                    small
                    depressed
                    fab
                    color="green lighten--4"
                    @click="viewProduct(props.item.id)"
                  >
                    <v-icon color="white">remove</v-icon>
                  </v-btn>

                  <v-btn small depressed fab color="red lighten--4">
                    <v-icon color="white">add</v-icon>
                  </v-btn>
                </div>
                
              </td>
              
              <td class="text-xs-center">
                <h1 v-if="props.item.status == true || props.item.status == 'available'">{{qty}}</h1>
              </td>
            </template>

            <template v-slot:no-results>
              <v-alert
                :value="true"
                color="error"
                icon="warning"
              >Your search for "{{ search }}" found no results.</v-alert>
            </template>
          </v-data-table>
        </v-card>

      
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { fb, db } from "@/config/firebase";
import { setTimeout } from "timers";
import Swal from "sweetalert2";
import { VueEditor, Quill } from "vue2-editor";
import { uuid } from "vue-uuid";

export default {
  data() {
    return {
      qty: 0,
      products: [],
      search: "",
      order: {
        no: "",
        date: "",
        time: "",
        table: "",
        cost: "",
        items: [],
        created_at: ""
      },
      headers: [
        { text: "Name", value: "name", align: "center" },
        { text: "Category", value: "category", align: "center" },
        { text: "Image", value: "image", align: "center" },
        { text: "Status", value: "status", align: "center" },
        { text: "Quantity", value: "quantity", align: "center" },
        { text: "Price", value: "price", align: "center" }
      ],
      tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      loading: false,
      dialog: false
    };
  },
  props: {},
  methods: {
    fetchProducts() {
      db.collection("products")
        .orderBy("created_at", "desc")
        .onSnapshot(querySnapshot => {
          this.products = [];
          querySnapshot.forEach(doc => {
            this.products.push(doc.data());
          });
        });
    }
  },
  created() {
    this.fetchProducts();
  }
};
</script>

<style>
</style>

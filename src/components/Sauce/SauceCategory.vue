<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-layout>
      <v-flex>
        <v-card flat>
          <v-card-title>
            <v-btn
              to="/dashboard/sauces/category/add"
              class="primary white--text my-2"
              large
              depressed
            >
              <span>Add Sauce Category</span>
              <v-icon right>add</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>

          <v-data-table :headers="headers" :items="saucecategories" :search="search">
            <template v-slot:items="props">
              <td class="text-xs-center">
                <img :src="props.item.image" width="80px" :alt="props.item.name" />
              </td>
              <td class="text-xs-center">{{ props.item.name }}</td>

              <td class="text-xs-center">
                <div class="colorbox" v-bind:style="{ 'background-color':  props.item.color }"></div>
              </td>
              <td class="text-xs-center">
                <v-chip
                  small
                  :color="props.item.status == true || props.item.status == 'available' ? 'green' : 'primary'"
                >{{props.item.status == true || props.item.status == 'available' ? 'Available' : 'Unavailable'}}</v-chip>
              </td>
              <!-- action buttons -->
              <td>
                <v-btn
                  :to="{name: 'editsaucecategory', params: {id: props.item.id}}"
                  depressed
                  
                  color="info lighten--4"
                >
                  <span class="mr-1">Edit</span>
                  <v-icon small>edit</v-icon>
                </v-btn>

                <v-btn
                  depressed
                
                  color="red lighten--4"
                  @click="deleteSauceCategory(props.item.id)"
                >
                  <span class="mr-1 white--text">Delete</span>
                  <v-icon small color="white">delete</v-icon>
                </v-btn>
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
import Swal from "sweetalert2";

export default {
  name: "SauceCategory",
  data() {
    return {
      saucecategories: [],
      search: "",
      headers: [
        { text: "Image", value: "image", align: "center" },
        { text: "Name", value: "name", align: "center" },
        { text: "Color", value: "status", align: "center" },
        { text: "Status", value: "status", align: "center" }
      ],
      items: [
        {
          text: "Dashboard",
          disabled: false,
          to: "/dashboard/#"
        },
        {
          text: "Sauce Categories",
          disabled: true
        }
      ]
    };
  },
  computed: {},
  methods: {
    fetchSauceCategories() {
      db.collection("saucecategories").onSnapshot(querySnapshot => {
        this.saucecategories = [];
        querySnapshot.forEach(doc => {
          this.saucecategories.push(doc.data());
        });
      });
    },
    deleteSauceCategory(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        if (result.value) {
          db.collection("saucecategories")
            .doc(id)
            .delete()
            .then(() => {
             
            Swal.fire({
              type: "success",
              title: "Sauce Category Deleted",
              showConfirmButton: false,
              timer: 1000
            });
            })
            .catch(err => console.log(err));
        }
      });
    }
  },
  created() {
    this.fetchSauceCategories();
  }
};
</script>

<style>
.colorbox{
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
}
</style>

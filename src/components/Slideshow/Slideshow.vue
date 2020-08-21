<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-layout row>
      <v-flex>
        <v-card flat>
          <v-card-title>
            <v-btn to="/dashboard/add-slideshow" class="primary white--text my-2" large depressed>
              <span>Add Slide</span>
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

          <v-data-table :headers="headers" :items="slides" :search="search">
            <template v-slot:items="props">
              <td class="text-xs-center">
                <img :src="props.item.image" width="80px" :alt="props.item.name" />
              </td>
              <td class="text-xs-center" ><span v-html="props.item.title"></span></td>

              <td class="text-xs-center">
                <v-chip
                  small
                  :color="props.item.show  ? 'green' : 'primary'"
                >{{props.item.show ? 'Active' : 'Inactive'}}</v-chip>
              </td>

              <td>
              

                <v-btn
                  :to="{name: 'editslideshow', params: {slide_id: props.item.id}}"
                  depressed
                  small
                  color="info lighten--4"
                >
                  <span class="mr-1">Edit</span>
                  <v-icon small>edit</v-icon>
                </v-btn>
                <v-btn depressed color="red lighten--4" @click="deleteSlide(props.item.id)">
                  <span class="mr-1 white--text">Delete</span>
                  <v-icon color="white">delete</v-icon>
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
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { fb, db } from "@/config/firebase";
import Swal from "sweetalert2";
export default {
  name: "Category",
  data() {
    return {
      search: "",
      headers: [
        { text: "Image", value: "image", align: "center" },
        { text: "Title", value: "title", align: "center" },
        { text: "Status", value: "show", align: "center" },
        { text: "Action", value: "", align: "center", sortable: false }
      ],
      slides: [],
      items: [
        {
          text: "Dashboard",
          disabled: false,
          to: "/dashboard/#"
        },
        {
          text: "Slides",
          disabled: true
        }
      ]
    };
  },
  computed: {},
  methods: {
    getSlides() {
      db.collection("slideshows").onSnapshot(querySnapshot => {
        this.slides = [];
        querySnapshot.forEach(doc => {
          this.slides.push(doc.data());
        });
      });
    },
    deleteSlide(id) {
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
          db.collection("slideshows")
            .doc(id)
            .delete()
            .then(() => {
              Swal.fire("Deleted!", "Your Slide has been deleted.", "success");
            })
            .catch(err => console.log(err));
        }
      });
    }
  },
  created() {
    this.getSlides();
  }
};
</script>

<style >
</style>

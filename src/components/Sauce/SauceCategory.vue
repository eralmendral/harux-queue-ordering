<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
   <h2>Sauce Categories</h2>
    <v-layout>
      <v-flex>
        <v-card flat>
          <v-card-title>
            <v-btn
              to="/dashboard/sauces/category/add"
              class="primary white--text my-2"
            >
              <span>Sauce Category</span>
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
                <img :src="props.item.image ? props.item.image : '/haruxlogo.png'" class="product-table-image" :alt="props.item.name" />
              </td>
              <td class="text-xs-center">{{ props.item.name }}</td>

              <td class="text-xs-center">
                <div class="colorbox" v-bind:style="{ 'background-color':  props.item.color }"></div>
              </td>
              <td class="text-xs-center">
                <v-chip
                  class="white--text"
                  small
                  :color="props.item.status == true || props.item.status == 'available' ? 'green' : 'primary'"
                >{{props.item.status == true || props.item.status == 'available' ? 'Available' : 'Unavailable'}}</v-chip>
              </td>
              <!-- action buttons -->
              <td>
                <v-btn
                  :to="{name: 'editsaucecategory', params: {id: props.item.id}}"
                  color="info"
                >
                  <span class="mr-1">Edit</span>
                </v-btn>

                <v-btn
                  color="red"
                  @click="deleteSauceCategory(props.item.id)"
                >
                  <span class="mr-1 white--text">Delete</span>
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
import { db } from '@/config/firebase'
import Swal from 'sweetalert2'

export default {
  name: 'SauceCategory',
  data () {
    return {
      saucecategories: [],
      search: '',
      headers: [
        { text: 'Image', value: 'image', align: 'center', sortable: false },
        { text: 'Name', value: 'name', align: 'center' },
        { text: 'Color', value: 'status', align: 'center', sortable: false },
        { text: 'Status', value: 'status', align: 'center' }
      ],
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/dashboard/#'
        },
        {
          text: 'Sauce Categories',
          disabled: true
        }
      ]
    }
  },
  computed: {},
  methods: {
    fetchSauceCategories () {
      db.collection('saucecategories').onSnapshot(querySnapshot => {
        this.saucecategories = []
        querySnapshot.forEach(doc => {
          this.saucecategories.push(doc.data())
        })
      })
    },
    deleteSauceCategory (id) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(result => {
        if (result.value) {
          db.collection('saucecategories')
            .doc(id)
            .delete()
            .then(() => {
              Swal.fire({
                type: 'success',
                title: 'Sauce Category Deleted',
                showConfirmButton: false,
                timer: 1000
              })
            })
        }
      })
    }
  },
  created () {
    this.fetchSauceCategories()
  }
}
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

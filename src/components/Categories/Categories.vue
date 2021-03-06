<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
    <h2>All Categories</h2>
    <v-layout row>
      <v-flex>
        <v-card flat>
          <v-card-title>
            <v-btn to="/dashboard/addcategory" class="primary white--text my-2">
              <span>Category</span>
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

          <v-data-table :headers="headers" :items="categories" :search="search">
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
                  small
                  class="white--text"
                  :color="props.item.status == true || props.item.status == 'available' ? 'green' : 'primary'"
                >{{props.item.status == true || props.item.status == 'available' ? 'Active' : 'Inactive'}}</v-chip>
              </td>

              <td class="text-xs-center">
                <v-chip
                  small
                  class="white--text"
                  :color="props.item.featured == true  ? 'green' : 'primary'"
                >{{props.item.featured == true ? 'Yes' : 'No'}}</v-chip>
              </td>

              <td class="text-xs-center">
                <v-btn
                  color="info"
                  :to="{name: 'editcategory', params: {category_id: props.item.id}}"
                >
                  <span class="mr-1">Edit</span>
                </v-btn>

                <v-btn color="red" @click="deleteCategory(props.item.id)">
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
  name: 'Category',
  data () {
    return {
      search: '',
      headers: [
        { text: 'Image', value: 'image', align: 'center', sortable: false },
        { text: 'Name', value: 'name', align: 'center' },
        { text: 'Color', value: 'color', align: 'center', sortable: false },
        { text: 'Status', value: 'status', align: 'center' },
        { text: 'Featured', value: 'featured', align: 'center' }
      ],
      categories: [],
      category: {
        image: '',
        name: ''
      },
      loading: false,
      dialog: false,
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/dashboard/#'
        },
        {
          text: 'Category',
          disabled: true,
          to: '/dashboard/categories'
        }
      ]
    }
  },
  computed: {},
  methods: {
    getCategories () {
      this.watcher()
    },
    watcher () {
      db.collection('categories')
        .orderBy('name')
        .onSnapshot(querySnapshot => {
          this.categories = []
          querySnapshot.forEach(doc => {
            this.categories.push(doc.data())
          })
        })
    },
    deleteCategory (id) {
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
          db.collection('categories')
            .doc(id)
            .delete()
            .then(() => {
              Swal.fire({
                type: 'success',
                title: 'Category Deleted',
                showConfirmButton: false,
                timer: 1000
              })
            })
        }
      })
    }
  },
  created () {
    this.getCategories()
  }
}
</script>

<style >
</style>

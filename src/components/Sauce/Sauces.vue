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
            <v-btn to="/dashboard/sauces/add" class="primary white--text my-2" large depressed>
              <span>Add Sauce</span>
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

          <v-data-table :headers="headers" :items="sauces" :search="search">
            <template v-slot:items="props">
              <td class="text-xs-center">
                <img :src="props.item.image" width="80px" :alt="props.item.name" />
              </td>
              <td class="text-xs-center">{{ props.item.name }}</td>
              <td class="text-xs-center">{{ props.item.subcategory }}</td>

              <td class="text-xs-center">
                <v-chip
                  small
                  :color="props.item.status == true || props.item.status == 'available' ? 'green' : 'primary'"
                >{{props.item.status == true || props.item.status == 'available' ? 'Active' : 'Inactive'}}</v-chip>
              </td>

              <td class="text-xs-center">{{ props.item.price }}</td>

              <td class="text-xs-center">
                <v-btn
                  :to="{name: 'viewproduct', params: {product_id: props.item.id}}"
                  depressed
                  small
                  color="success lighten--4"
                >
                  <span class="mr-1">View</span>
                  <v-icon small>visibility</v-icon>
                </v-btn>
                <v-btn
                  depressed
                  color="info lighten--4"
                  :to="{name: 'editsauce', params: {id: props.item.id}}"
                >
                  <span class="mr-1">Edit</span>
                  <v-icon color="white">edit</v-icon>
                </v-btn>

                <v-btn depressed color="red lighten--4" @click="deleteSauce(props.item.id)">
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
import { db } from '@/config/firebase'
import Swal from 'sweetalert2'

export default {
  name: 'Category',
  data () {
    return {
      search: '',
      headers: [
        { text: 'Image', value: 'image', align: 'center' },
        { text: 'Name', value: 'name', align: 'center' },
        { text: 'Category', value: 'subcategory', align: 'center' },
        { text: 'Status', value: 'status', align: 'center' },
        { text: 'Price', value: 'price', align: 'center' }
      ],
      sauces: [],
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
          text: 'Sauces',
          disabled: true
        }
      ]
    }
  },

  computed: {},
  methods: {
    watcher () {
      db.collection('products')
        .orderBy('name')
        .where('category', '==', 'Sauce')
        .onSnapshot(querySnapshot => {
          this.sauces = []
          querySnapshot.forEach(doc => {
            this.sauces.push(doc.data())
          })
        })
    },
    deleteSauce (id) {
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
          db.collection('products')
            .doc(id)
            .delete()
            .then(() => {
              Swal.fire({
                type: 'success',
                title: 'Sauce Deleted',
                showConfirmButton: false,
                timer: 1000
              })
            })
        }
      })
    }
  },
  created () {
    this.watcher()
  }
}
</script>

<style >
</style>

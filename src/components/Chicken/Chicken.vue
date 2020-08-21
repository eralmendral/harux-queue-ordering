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
            <v-btn to="/dashboard/chickens/add" class="primary white--text my-2" large depressed>
              <span>Add Chicken</span>
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

          <v-data-table :headers="headers" :items="chickens" :search="search">
            <template v-slot:items="props">
              <td class="text-xs-center">
                <img :src="props.item.image" width="80px" :alt="props.item.name" />
              </td>
              <td class="text-xs-center">{{ props.item.name }}</td>

              <td class="text-xs-center">
                <v-chip
                  small
                  class="white--text"
                  :color="props.item.status == true || props.item.status == 'available' ? 'green' : 'primary'"
                >{{props.item.status == true || props.item.status == 'available' ? 'Active' : 'Inactive'}}</v-chip>
              </td>

   <td class="text-xs-center">{{ props.item.price }}</td>
   <td class="text-xs-center">{{ props.item.price_kid ? props.item.price_kid : "Na"}}</td>

                   <td class="text-xs-center"><v-chip  class="white--text" :color="props.item.unli ?  'green' : 'primary'">
                     {{ props.item.unli ? 'yes' : 'no'}}
                     </v-chip></td>

                        <td class="text-xs-center">{{ props.item.flavor != -1 ? props.item.flavor : 'unlimited' }}</td>

              <td class="text-xs-center">
                  <v-btn
                  depressed
                  color="success lighten--4"
                     :to="{name: 'viewproduct', params: {product_id: props.item.id}}"
                >
                  <span class="mr-1 white--text">View</span>
                  <v-icon color="white">visibility</v-icon>
                </v-btn>

                <v-btn
                  depressed
                  color="info lighten--4"
                  :to="{name: 'chickensedit', params: {id: props.item.id}}"
                >
                  <span class="mr-1 white--text">Edit</span>
                  <v-icon color="white">edit</v-icon>
                </v-btn>

                <v-btn depressed color="red lighten--4" @click="deleteProduct(props.item.id)">
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
        { text: 'Status', value: 'status', align: 'center' },
        { text: 'Price', value: 'price', align: 'center' },
        { text: 'Price(kids)', value: 'price_kid', align: 'center' },
        { text: 'Unli', value: 'unli', align: 'center' },
        { text: 'Flavors', value: 'flavor', align: 'center' }
      ],
      chickens: [],
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
          text: 'Chickens',
          disabled: true,
          to: '/dashboard/categories'
        }
      ]
    }
  },
  computed: {},
  methods: {
    watcher () {
      db.collection('products')
        .where('category', '==', 'Chicken')
        .onSnapshot(querySnapshot => {
          this.chickens = []
          querySnapshot.forEach(doc => {
            this.chickens.push(doc.data())
          })
        })
    },
    deleteProduct (id) {
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
              Swal.fire('Deleted!', 'Your product has been deleted.', 'success')
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

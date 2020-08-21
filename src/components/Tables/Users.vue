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
            <v-btn class="primary white--text" to="/dashboard/adduser" depressed large>
              <span>Add User</span>
              <v-icon>add</v-icon>
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

          <v-data-table :headers="headers" :items="users" :search="search">
            <template v-slot:items="props">
              <td class="text-xs-center">{{ props.item.table_number }}</td>

              <td class="text-xs-center">{{ props.item.email }}</td>

              <td class="text-xs-center">
                <v-btn
                  depressed
                  color="info lighten--4"
                  :to="{name: 'edituser', params: {userid: props.item.id}}"
                >
                  <span class="mr-1">Edit</span>
                  <v-icon color="white">edit</v-icon>
                </v-btn>

                <v-btn depressed color="red lighten--4" @click="deleteUser(props.item.id)">
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
import Add from "./Add";
import { fb, db } from "@/config/firebase";
import Swal from "sweetalert2";
import axios from "axios";
export default {
  name: "Users",
  data() {
    return {
      search: "",
      headers: [
        { text: "Table", value: "table_number", align: "center" },
        { text: "Email", value: "status", align: "center" }
      ],
      users: [],
      loading: false,
      dialog: false,
      items: [
        {
          text: "Dashboard",
          disabled: false,
          to: "/dashboard/#"
        },
        {
          text: "Users",
          disabled: true
        }
      ]
    };
  },
  computed: {},
  methods: {
    getUsers() {
      db.collection("users")
        .where("role", "==", "user")
        .orderBy("table_number", "asc")
        .onSnapshot(querySnapshot => {
          this.users = [];
          querySnapshot.forEach(doc => {
            this.users.push(doc.data());
          });
        });
    },
    deleteUser(id) {
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
          const url = `https://haru-6bed6.firebaseapp.com/deleteUser`;
          axios
            .post(url, {
              userid: id
            })
            .then(res => {
              console.log("Success", res);
              Swal.fire({
                type: "success",
                title: "User Deleted",
                showConfirmButton: false,
                timer: 1000
              });
            })
            .catch(err => {
              console.log("Error", err);
            });
        }
      });
    }
  },
  created() {
    this.getUsers();
  }
};
</script>

<style >
</style>

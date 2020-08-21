<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-layout row wrap>
      <v-flex>
        <v-form ref="productform">
          <v-card flat>
            <v-card-title>
              <h1>Add New Chicken Product</h1>
            </v-card-title>
            <v-card-text>
              <v-text-field
                prepend-icon="drag_indicator"
                v-model="product.name"
                label="Name"
                @input="checkProduct"
                :rules="inputRules"
              ></v-text-field>
              <p v-if="productExists" class="red--text">Product Already Exists</p>

              <v-switch v-model="product.unli" label="Unlimited" color="primary"></v-switch>

              <v-text-field
                v-if="!product.unli"
                prepend-icon="drag_indicator"
                v-model="product.flavor"
                label="Flavors"
              ></v-text-field>

              <v-text-field
                prepend-icon="drag_indicator"
                v-model="product.price"
                label="Price"
                prefix="₱"
              ></v-text-field>

              <v-text-field
               v-if="product.unli"
                prepend-icon="drag_indicator"
                v-model="product.price_kid"
                label="Price for Kids"
                prefix="₱"
              ></v-text-field>

              <v-text-field
                v-if="product.unli"
                prepend-icon="chat"
                v-model="product.subdetails"
                label="Sub Desciption"
              ></v-text-field>

              <v-switch v-model="product.status" label="Status" color="primary"></v-switch>

              <vue-editor v-model="product.details"></vue-editor>

              <div class="my-2">
                <input type="file" @change="uploadProductImage" ref="file" />
                <div class="my-2">
                  <span>Preview:</span>
                  <br />
                  <img :src="product.image" alt width="200px" />
                </div>
              </div>

              <v-btn
                :disabled="disabled || productExists == true"
                depressed
                class="primary white--text"
                large
                @click="addProduct"
              >
                <span>Add</span>
                <v-icon right>add</v-icon>
              </v-btn>
            </v-card-text>
          </v-card>
        </v-form>

        <div class="mt-3">
          <v-btn depressed fab color="red lighten--4" to="/dashboard/categories">
            <v-icon color="white">arrow_back</v-icon>
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { fb, db } from "@/config/firebase";
import { setTimeout } from "timers";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      disabled: false,
      productExists: false,
      uploadProgress: 0,
      product: {
        image: "",
        name: "",
        price: "",
        price_kid: "",
        subdetails: "",
        status: false,
        details: "",
        unli: false,
        flavor: null
      },
      inputRules: [v => v.length >= 3 || "Fill at least 3 Characters"],
      items: [
        {
          text: "Dashboard",
          disabled: false,
          to: "/dashboard/#"
        },
        {
          text: "Chickens",
          disabled: false,
          to: "/dashboard/chickens"
        },
        {
          text: "Add",
          disabled: true
        }
      ]
    };
  },
  methods: {
    checkProduct() {
      var productname = String(this.product.name);

      // let categRef = .doc("7DCM24Z8hu0VDLZG85i7");
      db.collection("chickens")
        .where("name", "==", productname)
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            this.productExists = false;
          } else {
            this.productExists = true;
          }
        });
    },
    addProduct() {
      this.disabled = true;
      let form = this.$refs.productForm;
      this.loading = true;

      var status = this.product.status ? "available" : "unavailable";

      const product = {
        image: this.product.image,
        name: this.product.name,
        category: "Chicken",
        price: this.product.price,
        details: this.product.details,
        status: status,
        created_at: new Date()
      };

      product.unli = this.product.unli;

      if (product.unli == true) {
        product.flavor = -1;
        product.price_kid = this.product.price_kid;
        product.subdetails = this.product.subdetails;
      } else {
        product.flavor = parseInt(this.product.flavor);
      }

      const ref = db.collection("products").doc();
      ref
        .set({
          id: ref.id,
          ...product
        }) // sets the contents of the doc using the id
        .then(() => {
          Swal.fire({
            type: "success",
            title: "Product Added",
            showConfirmButton: false,
            timer: 1500
          });
        });

      this.$router.push("/dashboard/chickens");
      this.loading = false;

      form.reset();
    },
    uploadProductImage(e) {
      this.disabled = true;
      let image = e.target.files[0];

      var storageRef = fb.storage().ref("chickens/" + image.name);

      let uploadTask = storageRef.put(image);

      uploadTask.on(
        "state_changed",
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploadprogress = progress;

          console.log("upload progress is: " + progress);
          switch (snapshot.state) {
            case fb.storage.TaskState.PAUSED: // or 'paused'
              console.log("Upload is paused");
              break;
            case fb.storage.TaskState.RUNNING: // or 'running'
              console.log("Upload is running");
              break;
          }
        },
        error => {},
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            if ((this.product.image = downloadURL)) {
              this.disabled = false;
            }
            // console.log("File available at: ", downloadURL);
          });
        }
      );
    }
  },
  created() {}
};
</script>

<style>
</style>

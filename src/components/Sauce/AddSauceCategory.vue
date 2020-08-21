<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-layout row wrap>
      <v-flex>
        <v-form ref="categoryForm">
          <v-card flat>
            <v-card-title>
              <h1>Add Sauce Category</h1>
            </v-card-title>
            <v-card-text>
              <v-text-field
                prepend-icon="drag_indicator"
                v-model="saucecategory.name"
                label="Name"
                @input="checkCategory"
              ></v-text-field>
              <p v-if="categoryExists" class="red--text">Category Exists</p>

              <v-switch v-model="saucecategory.status" label="Status" color="primary"></v-switch>

              <div class="form-group">
                <label for="categoryColor">Sauce Category Color:</label>

                <br />
                <input type="color" id="categoryColor" />
              </div>

              <div class="my-2">
                <input type="file" @change="uploadCategoryImage" :disabled="saucecategory.image != ''" ref="file" required />
                <br />
                <div class="my-2">
                  <span>Preview:</span>
                  <br />
                  <img :src="saucecategory.image" alt width="200px" />

                  <v-btn
                    fab
                    style="margin-bottom: 150px"
                    v-if="saucecategory.image"
                    small
                    title="remove image"
                    color="primary"
                    @click="deleteImage(saucecategory.image)"
                  >
                    <v-icon class="white--text" small>close</v-icon>
                  </v-btn>
                </div>
              </div>

              <v-btn
                :disabled="disabled || categoryExists == true"
                depressed
                class="primary white--text"
                large
                @click="addCategory"
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
import { uuid } from "vue-uuid";

export default {
  data() {
    return {
      disabled: false,
      categoryExists: false,
      uploadProgress: 0,
      saucecategory: {
        image: "",
        name: "",
        status: false,
        featured: false
      },
      inputRules: [v => v.length >= 3 || "Fill at least 3 Characters"],
      items: [
        {
          text: "Dashboard",
          disabled: false,
          to: "/dashboard/#"
        },
        {
          text: "Sauce Category",
          disabled: false,
          to: "/dashboard/sauces/categories"
        },
        {
          text: "Add",
          disabled: true
        }
      ]
    };
  },
  methods: {
    deleteImage(img) {
      let image = fb.storage().refFromURL(img);
      this.saucecategory.image = "";
      image
        .delete()
        .then(() => {
          console.log("Image Deleted");
        })
        .catch(err => console.log(err));
    },
    checkCategory() {
      var category = String(this.saucecategory.name);
      var category = category.charAt(0).toUpperCase() + category.slice(1);

      console.log(category);
      console.log(typeof category);

      // let categRef = .doc("7DCM24Z8hu0VDLZG85i7");
      db.collection("saucecategories")
        .where("name", "==", category)
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            this.categoryExists = false;
          } else {
            this.categoryExists = true;
          }
        });
    },
    addCategory() {
      this.disabled = true;
      let form = this.$refs.categoryForm;
      this.loading = true;

      if (form.validate()) {
        var name = this.saucecategory.name;
        var name = name.charAt(0).toUpperCase() + name.slice(1);

        var color = document.getElementById("categoryColor").value;

        const saucecategory = {
          image: this.saucecategory.image,
          name: name,
          status: this.saucecategory.status,
          color: color,
          created_at: new Date()
        };

        const ref = db.collection("saucecategories").doc();
        ref
          .set({
            id: ref.id,
            ...saucecategory
          }) // sets the contents of the doc using the id
          .then(() => {
            Swal.fire({
              type: "success",
              title: "Sauce Category Added",
              showConfirmButton: false,
              timer: 1500
            });
          });
      }
      this.$router.push("/dashboard/sauces/categories");
      this.loading = false;
      form.reset();
    },
    uploadCategoryImage(e) {
      this.disabled = true;
      let image = e.target.files[0];

      var storageRef = fb.storage().ref("saucecategory/"+ uuid.v1() + image.name);

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
            if ((this.saucecategory.image = downloadURL)) {
              this.disabled = false;
            }
            console.log("File available at: ", downloadURL);
          });
        }
      );

      console.log(e.target.files[0]);
    }
  }
};
</script>

<style>
</style>

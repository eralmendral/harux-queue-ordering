<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-layout row wrap>
      <v-flex>
        <v-form ref="slideform">
          <v-card flat>
            <v-card-title>
              <h1>Edit Slide</h1>
            </v-card-title>
            <v-card-text>
              <div class="mb-3">
                <label for="slideimage">Image</label>
                <br />
                <input type="file" id="slideimage" @change="uploadSlideImage" />
                <div v-if="slide.image" class="ma-3">
                  <span>Preview:</span>
                  <br />
                  <img :src="slide.image" width="250px" />
                </div>
              </div>
            <label for="title">Title</label>
            <vue-editor id="title" v-model="slide.title"></vue-editor>

            <label for="details">Details</label>
            <vue-editor id="details" v-model="slide.details"></vue-editor>


              <v-switch v-model="slide.show" label="Show" color="primary"></v-switch>

              <v-btn large class="primary white--text" :disabled="disabled" @click="updateSlide">
                <span>Update Slide</span>
                <v-icon right>check</v-icon>
              </v-btn>

              <div class="mt-3">
                <v-btn depressed fab color="red lighten--4" to="/dashboard/slideshow">
                  <v-icon color="white">arrow_back</v-icon>
                </v-btn>
                <v-btn depressed fab color="red lighten--4" @click="deleteSlide(slide.id)">
                  <v-icon color="white">delete</v-icon>
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-form>
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
      loading: false,
      uploadProgress: 0,
      slide: {
        id: "",
        image: "",
        title: "",
        details: "",
        show: true
      },
      inputRules: [v => v.length >= 3 || "Fill at least 3 Characters"],
      items: [
        {
          text: "Dashboard",
          disabled: false,
          to: "/dashboard/#"
        },
        {
          text: "Slide",
          disabled: false,
          to: "/dashboard/slideshow"
        },
        {
          text: "Edit",
          disabled: true
        }
      ]
    };
  },
  beforeRouteEnter(to, from, next) {
    db.collection("slideshows")
      .where("id", "==", to.params.slide_id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            (vm.slide.id = doc.data().id),
              (vm.slide.image = doc.data().image),
              (vm.slide.title = doc.data().title),
              (vm.slide.details = doc.data().details),
              (vm.slide.show = doc.data().show);
          });
        });
      });

 
  },
  methods: {
    updateSlide() {
      let form = this.$refs.slideform;
      this.loading = true;

      if (form.validate()) {
        const slide = {
          id: this.slide.id,
          image: this.slide.image,
          title: this.slide.title,
          details: this.slide.details,
          show: this.slide.show
        };

        const ref = db.collection("slideshows").doc(slide.id);
        ref
          .set({
            ...slide
          }) // sets the contents of the doc using the id
          .then(() => {
            Swal.fire({
              type: "success",
              title: "Slide Updated",
              showConfirmButton: false,
              timer: 1500
            });
          });
      }
      this.$router.push("/dashboard/slideshow");
      this.loading = false;
      this.dialog = false;
      form.reset();
    },
    uploadSlideImage(e) {
      this.disabled = true;
      let image = e.target.files[0];
      let imagename = uuid.v1() + image.name;
      var storageRef = fb.storage().ref("slideshow/" + imagename);

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
            if ((this.slide.image = downloadURL)) {
              this.disabled = false;
            }
            console.log("File available at: ", downloadURL);
          });
        }
      );
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
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            })
            .catch(err => console.log(err));
        }
      });
    }
  }
};
</script>

<style>
</style>

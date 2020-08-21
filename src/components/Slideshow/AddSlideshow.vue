  <template>
  <div>
    <v-layout>
      <v-breadcrumbs :items="items">
        <template v-slot:divider>
          <v-icon>chevron_right</v-icon>
        </template>
      </v-breadcrumbs>
    </v-layout>
    <v-card flat>
      <v-card-title>
        <h1>Add New Slide</h1>
      </v-card-title>
      <v-card-text>
        <v-card-text>
          <v-form ref="slideform">
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

            <v-btn large class="primary white--text" :disabled="disabled" @click="addSlide">
              <span>Add Slide</span>
              <v-icon right>add</v-icon>
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { fb, db } from "@/config/firebase";
import { setTimeout } from "timers";
import Swal from "sweetalert2";
import { uuid } from "vue-uuid";
export default {
  data: () => ({
    disabled: false,
    uploadprogress: "",
    slide: {
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
        text: "Slideshow",
        disabled: false,
        to: "/dashboard/slideshow"
      },
      {
        text: "Add ",
        disabled: true,
        to: "/dashboard/add-slideshow"
      }
    ]
  }),
  methods: {
    addSlide() {
      this.disabled = true;
      let form = this.$refs.slideform;

      const slide = {
        image: this.slide.image,
        title: this.slide.title,
        details: this.slide.details,
        show: this.slide.show,
        created_at: new Date()
      };

      const ref = db.collection("slideshows").doc();
      ref
        .set({
          id: ref.id,
          ...slide
        }) // sets the contents of the doc using the id
        .then(() => {
          Swal.fire({
            type: "success",
            title: "Slide Added",
            showConfirmButton: false,
            timer: 1500
          });
        });

      this.$router.push("/dashboard/slideshow");
      this.disabled = false;
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
    }
  }
};
</script>

<style>
</style>

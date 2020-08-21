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
              <h1>Edit Sauce Category</h1>
            </v-card-title>
            <v-card-text>
              <v-text-field
                prepend-icon="drag_indicator"
                v-model="saucecategory.name"
                label="Name"
                @input="checkCategory"
              ></v-text-field>
              <p v-if="categoryExists" class="red--text">Sauce Category Exists</p>

              <v-switch v-model="saucecategory.status" label="Status" color="primary"></v-switch>

              <div class="form-group">
                <label for="color">Category Color</label>
                <br />
                <input type="color" id="categoryColor" v-model="saucecategory.color" />
              </div>

            <div class="my-2">
                <input type="file" @change="uploadCategoryImage" ref="file" />
                <div class="my-2">
                  <span>Preview:</span>
                  <br />
                  <v-layout row>
                    <v-flex xs3>
                      <p v-if="saucecategory.newImage">Old Image:</p>
                      <img :src="saucecategory.image" alt width="200px" />
                    </v-flex>
                    <v-flex xs3 v-if="saucecategory.newImage">
                      <p>New Image:</p>
                      <img :src="saucecategory.newImage" alt width="200px" />
                      <v-btn
                        fab
                        style="margin-bottom: 150px"
                        v-if="saucecategory.newImage"
                        small
                        title="remove image"
                        color="primary"
                        @click="deleteImage(saucecategory.newImage)"
                      >
                        <v-icon class="white--text" small>close</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </div>
              </div>

              <v-btn
                :disabled="disabled || categoryExists == true"
                depressed
                class="primary white--text"
                large
                @click="updateCategory"
              >
                <span>Update</span>
                <v-icon right>check</v-icon>
              </v-btn>

              <div class="mt-3">
                <v-btn depressed fab color="red lighten--4" to="/dashboard/sauces/categories">
                  <v-icon color="white">arrow_back</v-icon>
                </v-btn>
                <v-btn
                  depressed
                  fab
                  color="red lighten--4"
                  @click="deleteCategory(saucecategory.id)"
                >
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
import { fb, db } from '@/config/firebase'
import Swal from 'sweetalert2'
import { uuid } from 'vue-uuid'
export default {
  data () {
    return {
      disabled: false,
      categoryExists: false,
      uploadProgress: 0,
      saucecategory: {
        id: '',
        image: '',
        newImage: '',
        name: '',
        color: '',
        status: false
      },
      inputRules: [v => v.length >= 3 || 'Fill at least 3 Characters'],
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/dashboard/#'
        },
        {
          text: 'Sauce Category',
          disabled: false,
          to: '/dashboard/categories'
        },
        {
          text: 'Edit',
          disabled: true
        }
      ]
    }
  },
  beforeRouteEnter (to, from, next) {
    db.collection('saucecategories')
      .where('id', '==', to.params.id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            vm.saucecategory.id = doc.data().id
            vm.saucecategory.name = doc.data().name
            vm.saucecategory.image = doc.data().image
            vm.saucecategory.status = doc.data().status
            vm.saucecategory.color = doc.data().color
          })
        })
      })
  },
  methods: {
    checkCategory () {
      var category = String(this.saucecategory.name)
      category = category.charAt(0).toUpperCase() + category.slice(1)

      db.collection('saucecategories')
        .where('name', '==', category)
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            this.categoryExists = false
          } else {
            this.categoryExists = true
          }
        })
    },
    updateCategory () {
      let form = this.$refs.categoryForm
      this.loading = true

      // check if newimage is not empty . then assign image to new image, else retain old this.image
      let updateImage = this.saucecategory.newImage !== '' ? this.saucecategory.newImage : this.saucecategory.image

      // if newimage is not empty, means there is an upload, remove old image
      if (this.saucecategory.newImage !== '') {
        if (this.saucecategory.image !== '') {
          let image = fb.storage().refFromURL(this.saucecategory.image)
          this.saucecategory.image = ''
          image
            .delete()
            .then(() => {
              console.log('Image Deleted')
            })
            .catch(err => console.log(err))
        }
      }

      if (form.validate()) {
        var name = this.saucecategory.name
        name = name.charAt(0).toUpperCase() + name.slice(1)
        var color = document.getElementById('categoryColor').value
        const saucecategory = {
          id: this.saucecategory.id,
          image: updateImage,
          name: name,
          status: this.saucecategory.status,
          color: color,
          created_at: new Date()
        }

        const ref = db.collection('saucecategories').doc(saucecategory.id)
        ref
          .set({
            ...saucecategory
          }) // sets the contents of the doc using the id
          .then(() => {
            Swal.fire({
              type: 'success',
              title: 'Sauce Category Updated',
              showConfirmButton: false,
              timer: 1500
            })
          })
      }
      this.$router.push('/dashboard/sauces/categories')
      this.loading = false
      this.dialog = false
      form.reset()
    },
    uploadCategoryImage (e) {
      let image = e.target.files[0]

      var storageRef = fb.storage().ref('saucecategory/' + uuid.v1() + image.name)

      let uploadTask = storageRef.put(image)

      uploadTask.on(
        'state_changed',
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          this.uploadprogress = progress

          console.log('upload progress is: ' + progress)
          switch (snapshot.state) {
            case fb.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused')
              break
            case fb.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running')
              break
          }
        },
        () => {
          this.disabled = true
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.saucecategory.newImage = downloadURL
            this.disabled = false
            console.log('File available at: ', downloadURL)
          })
        }
      )

      console.log(e.target.files[0])
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
          db.collection('saucecategories')
            .doc(id)
            .delete()
            .then(() => {
              Swal.fire('Deleted!', 'Your file has been deleted.', 'success')

              this.$router.push('/dashboard/saucescategories')
            })
            .catch(err => console.log(err))
        }
      })
    }
  }
}
</script>

<style>
</style>

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
                <p>Image</p>
                <input type="file" @change="uploadCategoryImage" ref="file" />
                <div class="my-2 ml-2" v-if="saucecategory.newImage || saucecategory.image">
                  <span>Preview:</span>
                  <br />
                  <v-layout row>
                    <v-flex xs3>
                      <p v-if="saucecategory.newImage">Old Image:</p>
                      <img :src="saucecategory.image" class="product-preview-image" />
                    </v-flex>
                    <v-flex xs3 v-if="saucecategory.newImage">
                      <p>New Image:</p>
                      <img :src="saucecategory.newImage" class="product-preview-image" />
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
              <br/>
              <v-btn
                :disabled="disabled || categoryExists == true"
                class="primary white--text"
                @click="updateCategory"
              >
                <span>Update</span>
              </v-btn>
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
          image.delete()
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
        },
        (err) => {
          console.log(err)
        },
        () => {
          this.disabled = true
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.saucecategory.newImage = downloadURL
            this.disabled = false
          })
        }
      )
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
        }
      })
    }
  }
}
</script>

<style>
</style>

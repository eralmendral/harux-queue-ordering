<template>
  <v-container>
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
                <h1>Add New Category</h1>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  prepend-icon="drag_indicator"
                  v-model="category.name"
                  label="Name"
                  @input="checkCategory"
                ></v-text-field>
                <p v-if="categoryExists" class="red--text">Category Exists</p>

                <v-switch v-model="category.status" label="Status" color="primary"></v-switch>

                <v-switch v-model="category.featured" label="Featured" color="primary"></v-switch>

                <div class="form-group">
                  <label for="color">Category Color</label>
                  <br />
                  <input type="color" id="categoryColor" />
                </div>

                <div class="my-2">
                  <input type="file" @change="uploadCategoryImage" ref="file" required />

                  <br />
                  <div class="my-2">
                    <span>Preview:</span> <br>
                    <img :src="category.image" alt width="200px" />

                    <v-btn
                      fab
                      style="margin-bottom: 150px"
                      v-if="category.image"
                      small
                      title="remove image"
                      color="primary"
                      @click="deleteImage(category.image)"
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
  </v-container>
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
      category: {
        image: '',
        name: '',
        status: false,
        featured: false
      },
      inputRules: [v => v.length >= 3 || 'Fill at least 3 Characters'],
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/dashboard/#'
        },
        {
          text: 'Category',
          disabled: false,
          to: '/dashboard/categories'
        },
        {
          text: 'Add Category',
          disabled: true,
          to: '/dashboard/addcategory'
        }
      ]
    }
  },
  methods: {
    checkCategory () {
      var category = String(this.category.name)
      category = category.charAt(0).toUpperCase() + category.slice(1)
      db.collection('categories')
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
    addCategory () {
      this.disabled = true
      let form = this.$refs.categoryForm
      this.loading = true

      if (form.validate()) {
        var name = this.category.name
        name = name.charAt(0).toUpperCase() + name.slice(1)
        var color = document.getElementById('categoryColor').value
        const category = {
          image: this.category.image,
          name: name,
          status: this.category.status,
          featured: this.category.featured,
          color: color,
          created_at: new Date()
        }

        const ref = db.collection('categories').doc()
        ref
          .set({
            id: ref.id,
            ...category
          })
          .then(() => {
            Swal.fire({
              type: 'success',
              title: 'Category Added',
              showConfirmButton: false,
              timer: 1500
            })
          })
      }
      this.$router.push('/dashboard/categories')
      this.loading = false
      form.reset()
    },
    uploadCategoryImage (e) {
      this.disabled = true
      let image = e.target.files[0]

      var storageRef = fb.storage().ref('category/' + uuid.v1() + image.name)

      let uploadTask = storageRef.put(image)

      uploadTask.on(
        'state_changed',
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          this.uploadprogress = progress
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            if ((this.category.image = downloadURL)) {
              this.disabled = false
            }
          })
        }
      )
    },
    deleteImage (img) {
      let image = fb.storage().refFromURL(img)
      this.category.image = ''
      image
        .delete()
        .then(() => {
          console.log('Image Deleted')
        })
        .catch(err => console.log(err))
    }
  }
}
</script>

<style>
</style>

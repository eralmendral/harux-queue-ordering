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
              <h1>Edit Category</h1>
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
                <input type="color" id="categoryColor" v-model="category.color" />
              </div>

              <div>
                 <input
                type="file"
                @change="uploadCategoryImage"
                ref="file"
                :disabled="this.category.newImage != ''"
              />
              </div>
              <div v-if="category.image || category.newImage" class="my-2 ml-3">
                <small>Preview</small>
                <br />
                <v-layout row>
                  <v-flex>
                    <p v-if="category.newImage">Old Image:</p>
                    <img :src="category.image" class="product-preview-image"/>
                  </v-flex>
                  <v-flex v-if="category.newImage">
                    <p>New Image:</p>
                    <img :src="category.newImage" class="product-preview-image"/>
                    <v-btn
                      fab
                      style="margin-bottom: 150px"
                      v-if="category.newImage"
                      small
                      title="remove image"
                      color="primary"
                      @click="deleteImage(category.newImage)"
                    >
                      <v-icon class="white--text" small>close</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </div>
              <br>
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
      category: {
        id: '',
        image: '',
        newImage: '',
        name: '',
        color: '',
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
          text: 'Edit Category',
          disabled: true
        }
      ]
    }
  },
  beforeRouteEnter (to, from, next) {
    db.collection('categories')
      .where('id', '==', to.params.category_id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            vm.category.id = doc.data().id
            vm.category.name = doc.data().name
            vm.category.image = doc.data().image
            vm.category.status = doc.data().status
            vm.category.featured = doc.data().featured
            vm.category.color = doc.data().color
          })
        })
      })
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
    deleteImage (img) {
      let image = fb.storage().refFromURL(img)
      this.category.newImage = ''
      image.delete()
    },
    updateCategory () {
      let form = this.$refs.categoryForm
      this.loading = true

      // check if newimage is not empty . then assign image to new image, else retain old this.image
      let updateImage =
        this.category.newImage !== ''
          ? this.category.newImage
          : this.category.image

      // if newimage is not empty, means there is an upload, remove old image
      if (this.category.newImage !== '') {
        if (this.category.image !== '') {
          let image = fb.storage().refFromURL(this.category.image)
          this.category.image = ''
          image.delete()
        }
      }

      if (form.validate()) {
        var name = this.category.name
        name = name.charAt(0).toUpperCase() + name.slice(1)
        var color = document.getElementById('categoryColor').value
        const category = {
          id: this.category.id,
          image: updateImage,
          name: name,
          status: this.category.status,
          color: color,
          featured: this.category.featured,
          created_at: new Date()
        }

        const ref = db.collection('categories').doc(category.id)
        ref
          .set({
            ...category
          }) // Sets the contents of the doc using the id
          .then(() => {
            Swal.fire({
              type: 'success',
              title: 'Category Updated',
              showConfirmButton: false,
              timer: 1500
            })
          })
      }
      this.$router.push('/dashboard/categories')
      this.loading = false
      this.dialog = false
      form.reset()
    },
    uploadCategoryImage (e) {
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
        (err) => {
          console.log(err)
        },
        () => {
          this.disabled = true
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.category.newImage = downloadURL
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
          db.collection('categories')
            .doc(id)
            .delete()
            .then(() => {
              Swal.fire('Deleted!', 'Your file has been deleted.', 'success')

              this.$router.push('/dashboard/categories')
            })
        }
      })
    }
  }
}
</script>

<style>
</style>

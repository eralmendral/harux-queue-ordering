<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-layout row wrap>
      <v-flex>
        <v-form ref="sauceForm">
          <v-card flat>
            <v-card-title>
              <h1>Edit Sauce</h1>
            </v-card-title>
            <v-card-text>
              <v-select
                prepend-icon="drag_indicator"
                :items="saucecategories"
                label="Sauce Category"
                v-model="sauce.subcategory"
                item-text="name"
                item-value="name"
              ></v-select>

              <v-text-field
                prepend-icon="drag_indicator"
                v-model="sauce.name"
                label="Name"
                @input="checkSauce"
                :rules="inputRules"
              ></v-text-field>
              <p v-if="sauceExists" class="red--text">Sauce Already Exists</p>

              <v-text-field
                prepend-icon="drag_indicator"
                v-model="sauce.price"
                label="Price"
                prefix="₱"
              ></v-text-field>

              <v-switch v-model="sauce.status" label="Status" color="primary"></v-switch>

              <vue-editor v-model="sauce.details"></vue-editor>

              <div class="my-2">
                <input type="file" @change="uploadProductImage" ref="file" />
                <div class="my-2">
                  <span>Preview:</span>
                  <br />
                  <v-layout row>
                    <v-flex xs3>
                      <p v-if="sauce.newImage">Old Image:</p>
                      <img :src="sauce.image" alt width="200px" />
                    </v-flex>
                    <v-flex xs3 v-if="sauce.newImage">
                      <p>New Image:</p>
                      <img :src="sauce.newImage" alt width="200px" />
                      <v-btn
                        fab
                        style="margin-bottom: 150px"
                        v-if="sauce.newImage"
                        small
                        title="remove image"
                        color="primary"
                        @click="deleteImage(sauce.newImage)"
                      >
                        <v-icon class="white--text" small>close</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </div>
              </div>

              <v-btn
                :disabled="disabled || sauceExists == true"
                depressed
                class="primary white--text"
                large
                @click="updateSauce"
              >
                <span>Update</span>
                <v-icon right>check</v-icon>
              </v-btn>

              <div class="mt-3">
                <v-btn depressed fab color="red lighten--4" to="/dashboard/sauces">
                  <v-icon color="white">arrow_back</v-icon>
                </v-btn>
                <v-btn depressed fab color="red lighten--4" @click="deleteSauce(sauce.id)">
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
      saucecategories: [],
      disabled: false,
      sauceExists: false,
      uploadProgress: 0,
      sauce: {
        id: '',
        image: '',
        newImage: '',
        name: '',
        price: '',
        status: false,
        subcategory: '',
        category: '',
        details: '',
        created_at: ''
      },
      inputRules: [v => v.length >= 3 || 'Fill at least 3 Characters'],
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/dashboard/#'
        },
        {
          text: 'Sauce',
          disabled: false,
          to: '/dashboard/sauces'
        },
        {
          text: 'Edit',
          disabled: true
        }
      ]
    }
  },
  beforeRouteEnter (to, from, next) {
    db.collection('products')
      .where('id', '==', to.params.id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            vm.sauce.id = doc.data().id
            vm.sauce.name = doc.data().name
            vm.sauce.category = doc.data().category
            vm.sauce.price = doc.data().price
            vm.sauce.subcategory = doc.data().subcategory
            vm.sauce.status = doc.data().status
            vm.sauce.image = doc.data().image
            vm.sauce.details = doc.data().details
            vm.sauce.created_at = doc.data().created_at
          })
        })
      })
  },
  methods: {
    fetchSaucecategories () {
      db.collection('saucecategories').onSnapshot(querySnapshot => {
        this.saucecategories = []
        querySnapshot.forEach(doc => {
          this.saucecategories.push(doc.data())
        })
      })
    },
    checkSauce () {
      var sauce = String(this.sauce.name)

      db.collection('products')
        .where('name', '==', sauce)
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            this.sauceExists = false
          } else {
            this.sauceExists = true
          }
        })
    },
    deleteImage (img) {
      let image = fb.storage().refFromURL(img)
      this.sauce.newImage = ''
      image.delete()
    },
    updateSauce () {
      let form = this.$refs.sauceForm
      this.loading = true

      // check if newimage is not empty . then assign image to new image, else retain old this.image
      let updateImage =
        this.sauce.newImage !== '' ? this.sauce.newImage : this.sauce.image

      // if newimage is not empty, means there is an upload, remove old image
      if (this.sauce.newImage !== '') {
        if (this.sauce.image !== '') {
          let image = fb.storage().refFromURL(this.sauce.image)
          this.sauce.image = ''
          image.delete()
        }
      }

      let price = this.sauce.price !== '' ? this.sauce.price : 0
      if (form.validate()) {
        const sauce = {
          id: this.sauce.id,
          image: updateImage,
          name: this.sauce.name,
          status: this.sauce.status,
          category: this.sauce.category,
          subcategory: this.sauce.subcategory,
          price: price,
          details: this.sauce.details,
          created_at: this.sauce.created_at
        }

        const ref = db.collection('products').doc(sauce.id)
        ref
          .set({
            ...sauce
          }) // sets the contents of the doc using the id
          .then(() => {
            Swal.fire({
              type: 'success',
              title: 'Sauce Updated',
              showConfirmButton: false,
              timer: 1500
            })
          })
      }
      this.$router.push('/dashboard/sauces')
      this.loading = false
      this.dialog = false
      form.reset()
    },
    uploadProductImage (e) {
      let image = e.target.files[0]

      var storageRef = fb.storage().ref('sauces/' + uuid.v1() + image.name)

      let uploadTask = storageRef.put(image)

      uploadTask.on(
        'state_changed',
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          this.uploadprogress = progress
        },
        () => {
          this.disabled = true
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.sauce.newImage = downloadURL
            this.disabled = false
          })
        }
      )
    },
    deleteSauce (id) {
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
  },
  created () {
    this.fetchSaucecategories()
  }
}
</script>

<style>
</style>

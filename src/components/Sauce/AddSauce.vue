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
              <h1>Add New Sauce</h1>
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
                @input="checkProduct"
                :rules="inputRules"
              ></v-text-field>
              <p v-if="productExists" class="red--text">Sauce Already Exists</p>

              <v-text-field
                prepend-icon="drag_indicator"
                v-model="sauce.price"
                label="Price"
                prefix="₱"
              ></v-text-field>

              <v-switch v-model="sauce.status" label="Status" color="primary"></v-switch>

              <vue-editor v-model="sauce.details"></vue-editor>

              <div class="my-2">
                <input type="file" @change="uploadProductImage" :disabled="sauce.image != ''" ref="file" />
                <div class="my-2 ml-2" v-if="sauce.image">
                  <span>Preview:</span>
                  <br />
                  <img :src="sauce.image" class="product-preview-image" />
                  <v-btn
                    fab
                    style="margin-bottom: 150px"
                    v-if="sauce.image"
                    small
                    title="remove image"
                    color="primary"
                    @click="deleteImage(sauce.image)"
                  >
                    <v-icon class="white--text" small>close</v-icon>
                  </v-btn>
                </div>
              </div>
              <br/>
              <v-btn
                :disabled="disabled || productExists == true"
                class="primary white--text"
                @click="addSauce"
              >
                <span>Add</span>
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
      saucecategories: [],
      disabled: false,
      productExists: false,
      uploadProgress: 0,

      sauce: {
        image: '',
        name: '',
        category: '',
        subcategory: '',
        price: '',
        status: false,
        details: ''
      },
      inputRules: [v => v.length >= 3 || 'Fill at least 3 Characters'],
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/dashboard/#'
        },
        {
          text: 'Sauces',
          disabled: false,
          to: '/dashboard/sauces'
        },
        {
          text: 'Add',
          disabled: true
        }
      ]
    }
  },
  methods: {
    deleteImage (img) {
      let image = fb.storage().refFromURL(img)
      this.sauce.image = ''
      image.delete()
    },
    checkProduct () {
      var saucename = String(this.sauce.name)
      db.collection('products')
        .where('name', '==', saucename)
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            this.productExists = false
          } else {
            this.productExists = true
          }
        })
    },
    fetchCategories () {
      db.collection('saucecategories')
        .orderBy('name', 'asc')
        .onSnapshot(querySnapshot => {
          this.saucecategories = []
          querySnapshot.forEach(doc => {
            this.saucecategories.push(doc.data())
          })
        })
    },
    addSauce () {
      this.disabled = true
      let form = this.$refs.sauceForm
      this.loading = true

      var status = this.sauce.status ? 'available' : 'unavailable'

      const sauce = {
        image: this.sauce.image,
        name: this.sauce.name,
        category: 'Sauce',
        subcategory: this.sauce.subcategory,
        price: this.sauce.price,
        details: this.sauce.details,
        status: status,
        created_at: new Date()
      }

      const ref = db.collection('products').doc()
      ref
        .set({
          id: ref.id,
          ...sauce
        }) // sets the contents of the doc using the id
        .then(() => {
          Swal.fire({
            type: 'success',
            title: 'Sauce Added',
            showConfirmButton: false,
            timer: 1500
          })
        })

      this.$router.push('/dashboard/sauces')
      this.loading = false

      form.reset()
    },
    uploadProductImage (e) {
      this.disabled = true
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
        (err) => {
          console.log(err)
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            if ((this.sauce.image = downloadURL)) {
              this.disabled = false
            }
          })
        }
      )
    }
  },
  created () {
    this.fetchCategories()
  }
}
</script>

<style>
</style>

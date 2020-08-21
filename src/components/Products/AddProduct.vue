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
              <h1>Add New Product</h1>
            </v-card-title>
            <v-card-text>
              <v-select
                prepend-icon="drag_indicator"
                :items="categories"
                label="Category"
                v-model="product.category"
                item-text="name"
                item-value="name"
              ></v-select>

              <!-- if sauce, show sub category -->
              <v-select
                v-if="product.category == 'Sauce'"
                prepend-icon="drag_indicator"
                :items="saucecategories"
                label="Sauce Category"
                v-model="product.subcategory"
                item-text="name"
                item-value="name"
              ></v-select>
              <v-text-field
                prepend-icon="drag_indicator"
                v-model="product.name"
                label="Name"
                @input="checkProduct"
                :rules="inputRules"
              ></v-text-field>
              <p v-if="productExists" class="red--text">Product Already Exists</p>

              <!-- if chicken -->
              <v-switch
                v-if="product.category == 'Chicken'"
                v-model="product.unli"
                label="Unlimited"
                color="primary"
              ></v-switch>

              <v-text-field
                v-if="product.category =='Chicken' && !product.unli"
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

              <!-- if chicken unli, price for kids -->
              <v-text-field
                v-if="product.category =='Chicken' && product.unli"
                prepend-icon="drag_indicator"
                v-model="product.price_kid"
                label="Price for Kids"
                prefix="₱"
              ></v-text-field>

              <v-text-field
                v-if="product.category =='Chicken' && product.unli"
                prepend-icon="chat"
                v-model="product.subdetails"
                label="Sub Desciption"
              ></v-text-field>

              <v-switch v-model="product.status" label="Status" color="primary"></v-switch>

              <vue-editor v-model="product.details"></vue-editor>

              <div class="my-2">
                <input type="file" @change="uploadProductImage"  :disabled="product.image != ''"  ref="file" />
                <div class="my-2">
                  <span>Preview:</span>
                  <br />

                  <img :src="product.image" alt width="200px" />
                  <v-btn
                    fab
                    style="margin-bottom: 150px"
                    v-if="product.image"
                    small
                    title="remove image"
                    color="primary"
                    @click="deleteImage(product.image)"
                  >
                    <v-icon class="white--text" small>close</v-icon>
                  </v-btn>
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
import { fb, db } from '@/config/firebase'
import Swal from 'sweetalert2'
import { uuid } from 'vue-uuid'
export default {
  data () {
    return {
      categories: [],
      saucecategories: [],
      disabled: false,
      productExists: false,
      uploadProgress: 0,
      product: {
        image: '',
        name: '',
        category: '',
        price: '',
        price_kid: '',
        status: false,
        details: '',
        subcategory: '',
        subdetails: '',
        unli: false,
        flavor: 0
      },
      inputRules: [v => v.length >= 3 || 'Fill at least 3 Characters'],
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/dashboard/#'
        },
        {
          text: 'Products',
          disabled: false,
          to: '/dashboard/products'
        },
        {
          text: 'Add Product',
          disabled: true
        }
      ]
    }
  },
  methods: {
    fetchSubCategories () {
      db.collection('saucecategories')
        .orderBy('name', 'asc')
        .onSnapshot(querySnapshot => {
          this.saucecategories = []
          querySnapshot.forEach(doc => {
            this.saucecategories.push(doc.data())
          })
        })
    },
    checkProduct () {
      var productname = String(this.product.name)
      db.collection('products')
        .where('name', '==', productname)
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
      db.collection('categories')
        .orderBy('name', 'asc')
        .onSnapshot(querySnapshot => {
          this.categories = []
          querySnapshot.forEach(doc => {
            this.categories.push(doc.data())
          })
        })
    },
    addProduct () {
      this.disabled = true
      let form = this.$refs.productForm
      this.loading = true

      var status = this.product.status ? 'available' : 'unavailable'

      const product = {
        image: this.product.image,
        name: this.product.name,
        category: this.product.category,
        price: this.product.price,
        details: this.product.details,
        status: status,
        created_at: new Date()
      }

      // if category is sauce, then in product object add subcategory;
      if (product.category === 'Sauce') {
        product.subcategory = this.product.subcategory
      }

      // if category is chicken, then in product object, unli , flavor , sub details
      if (product.category === 'Chicken') {
        product.unli = this.product.unli

        if (product.unli === true) {
          product.flavor = -1
          product.price_kid = this.product.price_kid
          product.subdetails = this.product.subdetails
        } else {
          product.flavor = parseInt(this.product.flavor)
        }
      }

      const ref = db.collection('products').doc()
      ref
        .set({
          id: ref.id,
          ...product
        }) // sets the contents of the doc using the id
        .then(() => {
          Swal.fire({
            type: 'success',
            title: 'Product Added',
            showConfirmButton: false,
            timer: 1500
          })
        })

      this.$router.push('/dashboard/products')
      this.loading = false

      form.reset()
    },
    uploadProductImage (e) {
      this.disabled = true
      let image = e.target.files[0]

      var storageRef = fb.storage().ref('products/' + uuid.v1() + image.name)
      console.log('Test upload', uuid.v1() + image.name)
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
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            if ((this.product.image = downloadURL)) {
              this.disabled = false
            }
            console.log('File available at: ', downloadURL)
          })
        }
      )
    },
    deleteImage (img) {
      let image = fb.storage().refFromURL(img)
      this.product.image = ''
      image
        .delete()
        .then(() => {
          console.log('Image Deleted')
        })
        .catch(err => console.log(err))
    }
  },
  created () {
    this.fetchCategories()
    this.fetchSubCategories()
  }
}
</script>

<style>
</style>

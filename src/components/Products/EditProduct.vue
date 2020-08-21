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
              <h1>Edit Product</h1>
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
                v-if="product.category =='Chicken' && product.unli"
                prepend-icon="chat"
                v-model="product.subdetails"
                label="Sub Desciption"
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

              <v-switch v-model="product.status" label="Status" color="primary"></v-switch>

              <vue-editor v-model="product.details"></vue-editor>

              <div class="my-2">
                <input
                  type="file"
                  @change="uploadProductImage"
                  ref="file"
                  :disabled="this.product.newImage != ''"
                />
                <div v-if="product.image || product.newImage" class="my-2 ml-2">
                  <small>Preview</small>
                  <br />
                  <v-layout row>
                    <v-flex xs3>
                      <p v-if="product.newImage">Old Image:</p>
                      <img :src="product.image" class="product-preview-image" />
                    </v-flex>
                    <v-flex xs3 v-if="product.newImage">
                      <p>New Image:</p>
                      <img :src="product.newImage" class="product-preview-image" />
                      <v-btn
                        fab
                        style="margin-bottom: 150px"
                        v-if="product.newImage"
                        small
                        title="remove image"
                        color="primary"
                        @click="deleteImage(product.newImage)"
                      >
                        <v-icon class="white--text" small>close</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </div>
              </div>
              <br/>
              <v-btn
                :disabled="disabled || productExists == true"
                class="primary white--text"
                @click="updateProduct"
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
      categories: [],
      saucecategories: [],
      disabled: false,
      productExists: false,
      uploadProgress: 0,
      product: {
        image: '',
        newImage: '',
        name: '',
        category: '',
        price: '',
        price_kid: '',
        status: false,
        details: '',
        created_at: '',
        subcategory: '',
        subdetails: '',
        unli: false,
        flavor: null
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
          text: 'Edit Product',
          disabled: true
        }
      ]
    }
  },
  beforeRouteEnter (to, from, next) {
    db.collection('products')
      .where('id', '==', to.params.product_id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          if (doc.data().category === 'Sauce') {
            next(vm => {
              vm.product.id = doc.data().id
              vm.product.name = doc.data().name
              vm.product.category = doc.data().category
              vm.product.subcategory = doc.data().subcategory
              vm.product.image = doc.data().image
              vm.product.status = doc.data().status
              vm.product.price = doc.data().price
              vm.product.details = doc.data().details
              vm.product.created_at = doc.data().created_at
            })
          } else if (doc.data().category === 'Chicken') {
            next(vm => {
              vm.product.id = doc.data().id
              vm.product.name = doc.data().name
              vm.product.category = doc.data().category
              vm.product.image = doc.data().image
              vm.product.status = doc.data().status
              vm.product.price = doc.data().price
              vm.product.price_kid = doc.data().price_kid
              vm.product.unli = doc.data().unli
              vm.product.flavor = doc.data().flavor
              vm.product.details = doc.data().details
              vm.product.subdetails = doc.data().subdetails
              vm.product.created_at = doc.data().created_at
            })
          } else {
            next(vm => {
              vm.product.id = doc.data().id
              vm.product.name = doc.data().name
              vm.product.category = doc.data().category
              vm.product.image = doc.data().image
              vm.product.status = doc.data().status
              vm.product.price = doc.data().price
              vm.product.details = doc.data().details
              vm.product.created_at = doc.data().created_at
            })
          }
        })
      })
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
    deleteImage (img) {
      let image = fb.storage().refFromURL(img)
      this.product.newImage = ''
      image.delete()
    },
    updateProduct () {
      this.disabled = true
      let form = this.$refs.productForm
      this.loading = true

      var status = this.product.status ? 'available' : 'unavailable'

      // if newImage is not empty update_iamge = newImage, else update_image ==  to old image

      // check if newimage is not empty . then assign image to new image, else retain old this.image
      let updateImage =
        this.product.newImage !== ''
          ? this.product.newImage
          : this.product.image

      // if newimage is not empty, means there is an upload, remove old image
      if (this.product.newImage !== '') {
        if (this.product.image !== '') {
          let image = fb.storage().refFromURL(this.product.image)
          this.product.image = ''
          image.delete()
        }
      }

      const product = {
        id: this.product.id,
        image: updateImage,
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
      // remove old image when updated

      const ref = db.collection('products').doc(product.id)
      ref
        .set({
          ...product
        }) // sets the contents of the doc using the id
        .then(() => {
          Swal.fire({
            type: 'success',
            title: 'Product Updated',
            showConfirmButton: false,
            timer: 1500
          })
        })

      this.$router.push('/dashboard/products')
      this.loading = false
      this.dialog = false
      form.reset()
    },
    uploadProductImage (e) {
      this.disabled = true
      let image = e.target.files[0]

      var storageRef = fb.storage().ref('products/' + uuid.v1() + image.name)

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
            if ((this.product.newImage = downloadURL)) {
              this.disabled = false
            }
          })
        }
      )
    },
    deleteProduct (id) {
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
          db.collection('products')
            .doc(id)
            .delete()
            .then(() => {
              Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
            })

          this.$router.push('/dashboard/products')
        }
      })
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

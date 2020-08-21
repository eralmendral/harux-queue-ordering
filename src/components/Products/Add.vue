<template>
  <v-dialog max-width="500px" v-model="dialog">
    <v-btn color="pink" dark slot="activator">
      <span>Add Product</span>
      <v-icon right>add</v-icon>
    </v-btn>
    <v-card>
      <v-card-title>
        <h2>Add New Product</h2>
      </v-card-title>
      <v-card-text>
        <v-form ref="productForm" >
          <v-select :items="categories" label="Category" v-model="product.category" item-text="name" item-value="name"></v-select>

          <v-text-field
            prepend-icon="drag_indicator"
            label="Name"
            v-model="product.name"
            :rules="inputRules"
          ></v-text-field>

          <v-text-field prepend-icon="drag_indicator" label="Quantity" v-model="product.quantity"></v-text-field>

          <v-text-field
            prepend-icon="drag_indicator"
            label="Price"
            v-model="product.price"
            prefix="₱"
          ></v-text-field>

           <v-select :items="statuses" label="Status" v-model="product.status"  ></v-select>

          <vue-editor v-model="product.details"></vue-editor>

          <input type="file" @change="uploadProductImage" multiple="multiple" ref="file" />

          <v-layout justify-center row>
            <v-flex v-for="image in product.image" :key="image">
              <img :src="image" alt width="50px" />
              <a @click.prevent="deleteImage(image,index)">
                <v-icon small color="red">delete</v-icon>
              </a>
            </v-flex>
          </v-layout>

          <div class="text-xs-right">
            <v-btn
              v-if="!loading"
              class="pink white--text my-2"
              large
              depressed
              @click="addProduct"
              :disabled="!product.name"
            >
              <span>Add</span>
              <v-icon right>add</v-icon>
            </v-btn>
            <v-btn v-else class="pink white--text my-2" large depressed>Submitting...</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { fb, db } from '@/config/firebase'
import Swal from 'sweetalert2'
import { VueEditor } from 'vue2-editor'
import { uuid } from 'vue-uuid'

export default {
  data () {
    return {
      product: {
        name: '',
        image: [],
        category: '',
        details: '',
        quantity: 0,
        price: '',
        status: '',
        created_at: ''
      },
      loading: false,
      statuses: ['available', 'unavailable'],
      dialog: false,
      inputRules: [v => v.length >= 3 || 'Fill at least 3 Characters']
    }
  },
  props: {
    categories: Array
  },
  components: {
    VueEditor
  },
  methods: {
    addProduct () {
      this.dialog = false

      let form = this.$refs.productForm
      const ref = db.collection('products').doc()
      const product = {
        id: ref.id,
        images: this.product.image,
        name: this.product.name,
        quantity: this.product.quantity,
        category: this.product.category,
        details: this.product.details,
        price: this.product.price,
        status: this.product.status,
        created_at: new Date()
      }

      ref.set(product).then(() => {
        Swal.fire({
          type: 'success',
          title: 'Product Added',
          showConfirmButton: false,
          timer: 1500
        })
      })

      this.loading = false
      this.dialog = false
      form.reset()
    },
    uploadProductImage (e) {
      let file = e.target.files[0]
      console.log('FILE ' + file)

      for (var i = 0; i < this.$refs.file.files.length; i++) {
        let file = this.$refs.file.files[i]
        console.log(file)

        var filename = uuid.v1() + file.name
        console.log(filename)
        var storageRef = fb.storage().ref('products/' + filename)

        let uploadTask = storageRef.put(file)
        console.log('DONE')
        uploadTask.on(
          'state_changed',
          snapshot => {},
          error => {
            console.log(error)
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              this.product.image.push(downloadURL)
              console.log('Download url: ' + downloadURL)
            })
          }
        )
      }
    },
    deleteImage (img, index) {
      let image = fb.storage().refFromURL(img)

      this.product.image.splice(index, 1)

      image
        .delete()
        .then(() => {
          console.log('Image Deleted')
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
.invalid {
  border: 1px solid red;
}
</style>

<template>
  <v-dialog max-width="520px" v-model="dialog">
    <v-btn color="pink" dark slot="activator">
      <span>Add Category</span>
      <v-icon right>add</v-icon>
    </v-btn>
    <v-card>
      <v-card-title>
        <h2>Add New Category</h2>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <div class="my-2">
            <span>Preview:</span>
            <img :src="image" alt width="50px" />
            <span>
              <input type="file" class="mx-3" @change="uploadCategoryImage" />
            </span>
          </div>
          <v-text-field
            prepend-icon="drag_indicator"
            label="Name"
            v-model="name"
            :rules="inputRules"
          ></v-text-field>

          <div class="text-xs-right">
            <v-btn
              v-if="!loading"
              class="pink white--text my-2"
              large
              depressed
              @click="addCategory"
              :disabled="!name"
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

export default {
  data () {
    return {
      image: '',
      name: '',
      loading: false,
      dialog: false,
      inputRules: [v => v.length >= 3 || 'Fill at least 3 Characters']
    }
  },
  methods: {
    addCategory () {
      let form = this.$refs.form
      this.loading = true

      if (form.validate()) {
        const category = {
          image: this.image,
          name: this.name,
          created_at: new Date()
        }

        const ref = db.collection('categories').doc()

        ref
          .set({
            id: ref.id,
            image: category.image,
            name: category.name,
            created_at: category.created_at
          }) // sets the contents of the doc using the id
          .then(() => {
            Swal.fire({
              type: 'success',
              title: 'Category Added',
              showConfirmButton: false,
              timer: 1500
            })
            this.$emit('fetchCategories')
          })
      }

      this.loading = false
      this.dialog = false
      form.reset()
    },
    uploadCategoryImage (e) {
      let image = e.target.files[0]

      var storageRef = fb.storage().ref('category/' + image.name)

      let uploadTask = storageRef.put(image)

      uploadTask.on(
        'state_changed',
        snapshot => {},
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.image = downloadURL
          })
        }
      )
    }
  }
}
</script>

<style scoped>
.invalid {
  border: 1px solid red;
}
</style>

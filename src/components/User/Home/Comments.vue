<template>
  <div>
    <v-card v-if="message" class="comment_section" v-bind:style="{ 'background': comment.background  }" >
      <v-card-text class="text-xs-center">
        <h1 class="display-1 message" v-bind:style="{ 'color': comment.textColor  }">{{message.message}}</h1>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { db } from '@/config/firebase'
import { setTimeout } from 'timers'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'
export default {
  data () {
    return {
      messages: [],
      message: '',
      comment: {
        background: '',
        textColor: ''
      }
    }
  },
  created () {
    db.collection('messages')
      .where('table_number', '==', this.tableProfile.table_number)
      .orderBy('created_at', 'asc')
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          this.message = ''
          querySnapshot.forEach(doc => {
            this.message = doc.data()
          })

          if (change.type === 'modified') {
            Swal.fire({
              type: 'info',
              title: `${change.doc.data().message}`,
              showConfirmButton: true,
              timer: 5500
            })
          }
        })
      })

    setTimeout(() => {
      this.message = ''
    }, 180000)

    // fetch comments settings: background-color and text-color
    db.collection('settings')
      .where('name', '==', 'comment')
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          this.comment.background = doc.data().backgroundColor
          this.comment.textColor = doc.data().textColor
        })
      })
  },
  methods: {},
  computed: {
    ...mapGetters(['tableProfile'])
  }
}
</script>

<style>
.message {
  font-family: 'Pacifico' !important;
}
</style>

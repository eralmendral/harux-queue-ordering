import { db } from '@/config/firebase'
import Swal from 'sweetalert2'

const state = {
  tableProfile: {},
  myorders: [],
  can: false
}

const getters = {
  tableProfile: state => state.tableProfile,
  occupied: state => {
    if (state.tableProfile.orders && state.tableProfile.orders > 0) {
      return 'Yes'
    } else {
      return 'No'
    }
  },
  billingOut: state => {
    if (state.tableProfile.billingout) {
      return 'Yes'
    } else {
      return 'No'
    }
  },
  canSauce: state => {
    var letSauce = false
    if (state.tableProfile.sauce) {
      letSauce = true
    }

    return letSauce
  }
}

const actions = {
  async setTableProfile ({ commit }, tableProfileData) {
    commit('setTableProfile', tableProfileData)
  },
  async billout ({ commit }) {
    Swal.fire({
      title: 'Are you sure?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8db600',
      cancelButtonColor: '#ea1e63',
      confirmButtonText: 'Yes, Bill out!'
    }).then(result => {
      if (result.value) {
        commit('billout')

        Swal.fire(
          'Bill Out Request Sent!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }
}

const mutations = {
  setTableProfile: (state, tableProfileData) => {
    state.tableProfile = tableProfileData
  },
  billout: state => {
    // push order number to user profile
    let userref = db.collection('users').doc(state.tableProfile.id)

    userref.get().then(() => {
      var billingout = true

      userref.update({
        billingout
      })

      Swal.fire({
        type: 'success',
        title: 'Billout Request Sent',
        showConfirmButton: false,
        timer: 1500
      })
    })

    // add ,billout count
    var num = Math.random(1, 999)
    // add ,billout count
    db.collection('billout')
      .where('main', '==', true)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          db.collection('billout')
            .doc(doc.id)
            .update({ triggerNotif: num })
        })
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

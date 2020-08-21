import { db } from '@/config/firebase'
import Swal from 'sweetalert2'
const state = {
  products: [],
  categories: [],
  cart: [],
  order: [],
  myorders: []
}

const getters = {
  cartSize: state => {
    return state.cart.length
  },
  cartTotalAmount: state => {
    return state.cart.reduce((total, product) => {
      return total + product.price * product.quantity
    }, 0)
  },
  fetchProducts: state => {
    return state.products
  },

  fetchCart: state => {
    return state.cart
  },
  fetchCategories: state => {
    return state.categories.filter(cat => cat.status === true)
  },
  fetchFeaturedCategories: state => {
    return state.categories.filter(
      cat => cat.featured === true && cat.status === true
    )
  },
  fetchProductQuantity: state => id => {
    if (state.cart.find(product => product.id === id)) {
      return state.cart.find(product => product.id === id)
    }
  }
}

const mutations = {
  setUpProducts: (state, productsPayload) => {
    // sets the state's  products property to the products array recieved as payload

    state.products = productsPayload
  },
  addToCart: (state, { productId }) => {
    // find the product in the products list
    let product = state.products.find(product => product.id === productId)
    // find the product in the cart list
    let cartProduct = state.cart.find(product => product.id === productId)

    if (cartProduct) {
      // product already present in the cart. so increase the quantity
      cartProduct.quantity++
    } else {
      state.cart.push({
        // product newly added to cart
        ...product,
        quantity: 1
      })
    }
  },
  addChickenToCart: (state, { productId }) => {
    // find the product in the products list
    state.chickens.find(product => product.id === productId)
    // find the product in the cart list
    let cartProduct = state.cart.find(product => product.id === productId)

    if (cartProduct) {
      // product already present in the cart. so increase the quantity
      cartProduct.quantity++
    } else {
      state.cart.push({
        // product newly added to cart
        ...cartProduct,
        quantity: 1
      })
    }
  },
  removeFromCart: (state, productId) => {
    let cartProduct = state.cart.find(product => product.id === productId)
    cartProduct.quantity--
  },
  deleteFromCart: (state, productId) => {
    // find the product in the products list
    state.products.find(product => product.id === productId)
    // find the product index in the cart list
    let cartProductIndex = state.cart.findIndex(
      product => product.id === productId
    )
    // srt back the quantity of the product to intial quantity
    // product.quantity = state.cart[cartProductIndex].stock;
    // remove the product from the cart
    state.cart.splice(cartProductIndex, 1)
  },
  confirmOrder: (state, { profile, getters }) => {
    // order number/time/created at
    var orderNumber = new Date().toISOString().substr(0, 19).replace('T', ':').replace('-', ':').replace('-', ':')

    // table number
    // products
    let order = {}
    order.table_number = profile.table_number
    order.orders = state.cart
    order.order_number = orderNumber
    order.status = 'pending'
    order.time = new Date()
    order.total_price = getters.cartTotalAmount

    let ref = db.collection('orders').doc()

    ref
      .set({
        id: ref.id,
        ...order
      })
      .then(() => {
        console.log('Success')
        state.cart = []
        Swal.fire({
          type: 'success',
          title: 'Order Added to Queue',
          showConfirmButton: false,
          timer: 1500
        })
      })

    // push order number to user profile
    let userref = db.collection('users').doc(profile.id)

    userref.get().then(doc => {
      var orders = doc.data().orders
      var newOrder = [...orders, order.order_number]
      var user = doc.data()
      user.orders = newOrder

      // update profile sauce status to true , if one of the product has category chicken

      state.cart.forEach(res => {
        if (res.category === 'Chicken') {
          user.sauce = true
        }
      })

      db.collection('users')
        .doc(profile.id)
        .set({
          ...user
        })
    })
  }
}

const actions = {
  async setCategories ({ commit }) {
    db.collection('categories').onSnapshot(querySnapshot => {
      state.categories = []
      querySnapshot.forEach(doc => {
        state.categories.push(doc.data())
      })
    })
  },
  async setProducts ({ commit }, category) {
    let payload = []

    db.collection('products')
      .where('category', '==', category)
      .where('status', '==', 'available')
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          payload.push(doc.data())
        })
      })

    commit('setUpProducts', payload)
  },

  addToCart: ({ commit }, payload) => {
    commit('addToCart', payload)
  },
  addChickenToCart: ({ commit }, payload) => {
    commit('addChickenToCart', payload)
  },
  removeFromCart: ({ commit }, productId) => {
    let cartProduct = state.cart.find(product => product.id === productId)

    if (cartProduct.quantity && cartProduct.quantity > 1) {
      commit('removeFromCart', productId)
    } else {
      commit('deleteFromCart', productId)
    }
  },
  deleteFromCart: ({ commit }, productId) => {
    commit('deleteFromCart', productId)
  },
  confirmOrder: ({ commit, rootState, getters }) => {
    let profile = rootState.profile.tableProfile
    commit('confirmOrder', { profile, getters })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

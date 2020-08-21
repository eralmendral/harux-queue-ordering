<template>

    <b-carousel
      id="carousel-1"
      v-model="slide"
      :interval="4000"
      fade
      controls
      img-width="1024"
      img-height="250px"
      style="z-index: 1;height: 250px !important;"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"

    >
      <b-carousel-slide
        v-for="slide in slideshow"
        :key="slide.id"
        :img-src="slide.image"
        style="height: 250px !important; "
      >

        <h1 v-html="slide.title"></h1>
        <h4 v-html="slide.details"></h4>
      </b-carousel-slide>
    </b-carousel>

</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { db } from '@/config/firebase'

export default {
  data () {
    return {
      slide: 0,
      sliding: null,
      slideshow: []
    }
  },
  methods: {
    onSlideStart (slide) {
      this.sliding = true
    },
    onSlideEnd (slide) {
      this.sliding = false
    }
  },
  created () {
    db.collection('slideshows')
      .where('show', '==', true)
      .onSnapshot(querySnapshot => {
        this.slideshow = []
        querySnapshot.forEach(doc => {
          this.slideshow.push(doc.data())
        })
      })
  }
}
</script>

<style>

.carousel-inner {
    background-color: #cb7a43;
}
.carousel-inner img {
    margin-left: auto;
    margin-right: auto;
    margin-top: auto;
    opacity: 0.9;
    width: 100vw;
    height: auto;
    max-height: 100vh;
    bottom: 0;
    border-radius: 0%;
}

</style>

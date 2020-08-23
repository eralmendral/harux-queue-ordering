<template>
   <div class="slideshow-wrapper">
      <b-carousel
      id="carousel-1"
      v-model="slide"
      :interval="4000"
      fade
      controls
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"

    >
      <b-carousel-slide
        v-for="slide in slideshow"
        :key="slide.id"
        :img-src="slide.image"
      >

        <h1 v-html="slide.title" class="slideTitle"></h1>
        <h4 v-html="slide.details" class="slideDesc"></h4>
      </b-carousel-slide>
    </b-carousel>
   </div>
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
    max-height: 480px;
    border-radius: 0px;
}

.slideshow-wrapper {
  height: 480px;
  margin-top: 50px
}

@media only screen and (max-width: 720px) {
  .slideshow-wrapper {
    height: 200px;
  }

  .slideTitle {
    font-size: 14px;
  }
}
</style>

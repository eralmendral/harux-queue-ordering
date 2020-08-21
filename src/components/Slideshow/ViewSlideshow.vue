<template>
  <div>
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>chevron_right</v-icon>
      </template>
    </v-breadcrumbs>
    <b-carousel
      id="carousel-1"
      v-model="xslide"
      :interval="4000"
      img-width="1024"
      img-height="350px"
      style="text-shadow: 1px 1px 2px #333;z-index:1;height: 350px !important"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
    >
      <b-carousel-slide
        :caption="slide.title"
        :text="slide.details"
        :img-src="slide.image"
        style="height: 350px !important"
      ></b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script>
import { fb, db } from "@/config/firebase";

import { uuid } from "vue-uuid";
export default {
  data() {
    return {
        xslide:0,
      slide: {},
      sliding: null,
     
      items: [
        {
          text: "Dashboard",
          disabled: false,
          to: "/dashboard/#"
        },
        {
          text: "Slide",
          disabled: false,
          to: "/dashboard/slideshow"
        },
        {
          text: "View",
          disabled: true
        }
      ]
    };
  },
    methods: {
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    }
  },
  beforeRouteEnter(to, from, next) {
    db.collection("slideshows")
      .where("id", "==", to.params.slide_id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            (vm.slide.id = doc.data().id),
              (vm.slide.image = doc.data().image),
              (vm.slide.title = doc.data().title),
              (vm.slide.details = doc.data().details),
              (vm.slide.show = doc.data().show);
          });
        });
      });
  }
};
</script>

<style>
</style>

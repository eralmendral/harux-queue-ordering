<template>
  <v-dialog max-width="520px">
    <v-btn color="pink" dark slot="activator">
      <span>Add Table</span>
      <v-icon right>add</v-icon>
    </v-btn>
    <v-card>
      <v-card-title>
        <h2>Add New Table</h2>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3">
          <div class="my-2">
            <img :src="avatar" alt width="50px" />
            <span>
              <input type="file" class="mx-3"/>
            </span>
          </div>
          <v-text-field prepend-icon="drag_indicator" label="Number" v-model="number" ></v-text-field>
          <v-text-field prepend-icon="email" label="Email"  v-model="email"></v-text-field>
          <v-text-field prepend-icon="vpn_key" label="Password"  v-model="password"></v-text-field>
          <div class="text-xs-right">
            <v-btn depressed color="pink" class="white--text my-2">
              <span>Add</span>
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AddTable",
  data() {
    return {
      avatar: "img/boy_emoji.png",
      number: "",
      email: "",
      password: ""
    };
  }
};
</script>

<style>
</style>

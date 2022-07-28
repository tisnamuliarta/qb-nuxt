<template>
  <v-container>
    <v-row>
      <v-col cols="12"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      items: []
    }
  },

  methods: {
    setItem(items) {
      this.items = items
    }
  }
}
</script>

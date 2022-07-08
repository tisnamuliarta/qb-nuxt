<template>
  <div>
    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        color="green"
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
    }
  },

  methods: {
    start() {
      this.loading = true
    },

    finish() {
      this.loading = false
    },
  },
}
</script>

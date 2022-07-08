<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-top-transition"
    scrollable
    no-click-animation
  >
    <v-card tile>
      <v-card-title>
        <v-toolbar-title>
          <v-btn icon>
            <v-icon>mdi-progress-pencil</v-icon>
          </v-btn>
          <span v-text="title"></span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark color="red" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />

      <v-card-text class="pl-0 pr-0">
        <v-container fluid>
          <slot name="content" />
        </v-container>
      </v-card-text>

      <v-divider />

      <v-card-actions style="background-color: #263238">
        <slot name="actions" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DialogFull',

  data() {
    return {
      dialog: false,
      title: '',
    }
  },

  methods: {
    openDialog() {
      this.dialog = true
    },

    setTitle(title) {
      this.title = title
    },

    closeDialog() {
      this.$router.back()
      this.$emit('getDataFromApi')
      this.$nuxt.$emit('getDataFromApi')
    },
  },
}
</script>

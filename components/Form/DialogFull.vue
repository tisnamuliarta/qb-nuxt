<template>
  <v-dialog
    id="dialogFull"
    v-model="dialog"
    value="dialog"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-top-transition"
    scrollable
    no-click-animation
    :retain-focus="false"
  >
    <v-card tile :loading="loading">
      <v-card-title>
        <v-toolbar-title>
          <v-btn icon>
            <v-icon>mdi-progress-pencil</v-icon>
          </v-btn>
          <span v-text="title"></span>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn v-if="showIcon" icon @click="$emit('newData')">
          <v-icon>mdi-new-box</v-icon>
        </v-btn>

        <v-btn v-if="showIcon" icon @click="$emit('printAction')">
          <v-icon>mdi-printer</v-icon>
        </v-btn>

        <v-btn
          v-if="showIcon"
          icon
          @click="$emit('arrowLink', { status: 'prev' })"
        >
          <v-icon>mdi-arrow-left-thin</v-icon>
        </v-btn>

        <v-btn
          v-if="showIcon"
          icon
          @click="$emit('arrowLink', { status: 'next' })"
        >
          <v-icon>mdi-arrow-right-thin</v-icon>
        </v-btn>

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

  props: {
    showIcon: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      dialog: true,
      loading: false,
      title: '',
      countRouter: -1,
    }
  },

  methods: {
    showLoading() {
      this.loading = true
    },

    finishLoading() {
      this.loading = false
    },

    openDialog() {
      this.dialog = true
    },

    setTitle(title) {
      this.title = title
    },

    closeDialog() {
      if (!this.$auth.$storage.getState('basePath')) {
        this.$emit('closeDialog')
      } else {
        this.$router.push({
          path: this.$auth.$storage.getState('basePath'),
        })
      }
      // this.$emit('getDataFromApi')
      this.$nuxt.$emit('getDataFromApi')
    },
  },
}
</script>

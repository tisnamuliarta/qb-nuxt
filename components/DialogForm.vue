<template>
  <v-dialog
    v-model="dialog"
    no-click-animation
    persistent
    scrollable
    :origin="original"
    :max-width="maxWidth"
    transition="dialog-top-transition"
  >
    <v-card>
      <v-card-title>
        <span class="subtitle-2">{{ dialogTitle }}</span>
        <v-spacer></v-spacer>
        <v-btn icon color="red" dark @click="closeDialog()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text class="pr-0 pl-0">
        <slot name="content"></slot>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <slot name="addLine"></slot>
        <v-spacer></v-spacer>
        <slot name="saveData"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DialogForm',

  props: {
    maxWidth: {
      type: String,
      default: '800px',
    },
    dialogTitle: {
      type: String,
      default: '',
    },
    original: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      dialog: false,
    }
  },

  methods: {
    addLine() {
      this.$emit('addLine')
    },

    openDialog() {
      this.dialog = true
    },

    closeDialog() {
      this.dialog = false
      this.$emit('eventCloseDialog')
    },

    saveData() {
      this.$emit('saveData')
    },
  },
}
</script>

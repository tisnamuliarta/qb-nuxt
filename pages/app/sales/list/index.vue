<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="3">
        <v-card class="mx-auto">
          <v-card-text>
            <div class="subtitle-1">SHORTCUTS</div>
          </v-card-text>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-btn icon>
                    <v-icon x-large>mdi-receipt</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="mx-auto">
          <v-card-text>
            <div class="subtitle-1">SHORTCUTS</div>
          </v-card-text>
          <v-card-text></v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AllPurchase',

  head() {
    return {
      title: this.$t('Sales Overview'),
    }
  },

  activated() {
    this.$nuxt.$emit('extensionActive', {
      active: 0,
    })
  },
}
</script>

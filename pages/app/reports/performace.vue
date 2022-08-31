<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="10">
         <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="12" sm="6" lg="6" xl="4">
                <v-card>
                  <v-card-text>
                    <div class="subtitle-1">INVOICES</div>
                  </v-card-text>
                  <v-card-text>
                    <LazyChartBarChart></LazyChartBarChart>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" lg="6" xl="4">
                <v-card>
                  <v-card-text>
                    <div class="subtitle-1">EXPENSES</div>
                  </v-card-text>
                  <v-card-text>
                    <LazyChartDoughnutChart></LazyChartDoughnutChart>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" lg="6" xl="4">
                <v-card>
                  <v-card-text>
                    <div class="subtitle-1">PROFIT AND LOSS</div>
                  </v-card-text>
                  <v-card-text>
                    <LazyChartLineChart></LazyChartLineChart>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" lg="6" xl="4">
                <v-card>
                  <v-card-text>
                    <div class="subtitle-1">SALES</div>
                  </v-card-text>
                  <v-card-text>
                    <LazyChartLineChart></LazyChartLineChart>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'PurchaseOverview',

  head() {
    return {
      title: 'Purchase Overview',
    }
  },

  activated() {
    this.$nuxt.$emit('extensionSetting', {
      show: false,
      showBtn: false,
    })
  },

  created() {
    this.$nuxt.$on('getDataFromApi', ($event) => this.getDataFromApi($event))
  },

  methods: {
    getDataFromApi() {
      if (this.$refs.tableDocument) {
        this.$refs.tableDocument.getDataFromApi()
      }
    },
  },
}
</script>

<template>
  <v-container>
    <v-row>
      <!-- <v-col cols="12" lg="10">
        <v-row>
          <v-col cols="12" md="6" xl="4">
            <v-card class="mx-auto">
              <v-card-text>
                <div class="subtitle-1">SHORTCUTS</div>
              </v-card-text>
              <v-card-text>
                <LazyChartBarChart></LazyChartBarChart>
              </v-card-text>
            </v-card>
          </v-col>


          <v-col cols="12" md="6" xl="4">
            <v-card class="mx-auto">
              <v-card-text>
                <div class="subtitle-1">SHORTCUTS</div>
              </v-card-text>
              <v-card-text>
                <LazyChartBarChart></LazyChartBarChart>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" xl="4">
            <v-card class="mx-auto">
              <v-card-text>
                <div class="subtitle-1">SHORTCUTS</div>
              </v-card-text>
              <v-card-text>
                <LazyChartLineChart></LazyChartLineChart>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" xl="4">
            <v-card class="mx-auto">
              <v-card-text>
                <div class="subtitle-1">SHORTCUTS</div>
              </v-card-text>
              <v-card-text>
                <LazyChartLineChart></LazyChartLineChart>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" xl="4">
            <v-card class="mx-auto">
              <v-card-text>
                <div class="subtitle-1">SHORTCUTS</div>
              </v-card-text>
              <v-card-text>
                <LazyChartPieChart></LazyChartPieChart>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" xl="4">
            <v-card class="mx-auto">
              <v-card-text>
                <div class="subtitle-1">SHORTCUTS</div>
              </v-card-text>
              <v-card-text>
                <LazyChartDoughnutChart></LazyChartDoughnutChart>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col> -->

      <v-col cols="12">
        <LazyPayrollTableCommission
          ref="tableCommission"
        ></LazyPayrollTableCommission>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'SalesOverview',

  head() {
    return {
      title: 'Payroll Overview',
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

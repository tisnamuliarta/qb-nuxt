<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="10">
        <v-row>
          <v-col cols="12" sm="6" lg="6">
            <v-card>
              <v-card-text>
                <div class="subtitle-1">PURCHASE</div>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-text>
                <LazyChartLineChart ref="sales"></LazyChartLineChart>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" lg="6">
            <v-card>
              <v-card-text>
                <div class="subtitle-1">EXPENSES</div>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-text>
                <LazyChartDoughnutChart ref="expense"></LazyChartDoughnutChart>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'SalesOverview',

  head() {
    return {
      title: 'Purchase Overview',
    }
  },

  activated() {
    this.getDataChart()
    this.$nuxt.$emit('extensionSetting', {
      show: false,
      showBtn: false,
    })
  },

  mounted() {
    this.getDataChart()
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

    async getDataChart() {
      const resSales = await this.$axios.get(`/api/chart`, {
        params: {
          type: 'line',
          data: 'purchase'
        }
      })
      const resExpense = await this.$axios.get(`/api/chart`, {
        params: {
          type: 'doughnut',
          data: 'expense'
        }
      })
      this.$refs.expense.setData(resExpense.data)
      this.$refs.sales.setData(resSales.data)

      this.$nuxt.$loading.finish()

    }
  },
}
</script>

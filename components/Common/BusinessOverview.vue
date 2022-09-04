<template>
  <v-row>
    <v-col cols="12" lg="9">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="12" sm="6" lg="6" xl="4">
                <v-skeleton-loader v-show="loading" type="card" />
                <v-card v-show="!loading">
                  <v-card-text>
                    <div class="subtitle-1">INVOICES</div>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-text>
                    <LazyChartBarChart ref="invoice"></LazyChartBarChart>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" lg="6" xl="4">
                <v-skeleton-loader v-show="loading" type="card" />
                <v-card v-show="!loading">
                  <v-card-text>
                    <div class="subtitle-1">EXPENSES</div>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-text>
                    <LazyChartDoughnutChart ref="expense"></LazyChartDoughnutChart>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" lg="6" xl="4">
                <v-skeleton-loader v-show="loading" type="card" />
                <v-card v-show="!loading">
                  <v-card-text>
                    <div class="subtitle-1">PROFIT AND LOSS</div>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-text>
                    <LazyChartLineChart ref="profitLoss"></LazyChartLineChart>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" lg="6" xl="4">
                <v-skeleton-loader v-show="loading" type="card" />
                <v-card v-show="!loading">
                  <v-card-text>
                    <div class="subtitle-1">SALES</div>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-text>
                    <LazyChartLineChart ref="sales"></LazyChartLineChart>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-col>

    <v-col cols="12" md="3">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-text>
                <div class="subtitle-1">BANK ACCOUNTS</div>
              </v-card-text>
              <v-card-text></v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'DashboardHome',
  data() {
    return {
      loading: true,
      title: 'Dashboard',
      value: [423, 446, 675, 510, 590, 610, 760],
    }
  },

  activated() {
    // this.$nextTick(() => {
    //   this.$nuxt.$loading.start()
    // })
    this.$nuxt.$emit('extensionSetting', {
      tabs: [
        {
          title: 'Business Overview',
          route: '/home/business-overview',
        },
        {
          title: 'Get Thing Done',
          route: '/home/getthingdone',
        },
      ],
      show: true,
      showBtn: false,
    })

    this.getDataChart()
  },

  mounted() {
    this.getDataChart()
  },

  methods: {
    async getDataChart() {
      this.loading = true
      const resInvoice = await this.$axios.get(`/api/chart`, {
        params: {
          type: 'bar',
          data: 'invoice'
        }
      })

      const resExpense = await this.$axios.get(`/api/chart`, {
        params: {
          type: 'doughnut',
          data: 'expense'
        }
      })

      const resProfitLoss = await this.$axios.get(`/api/chart`, {
        params: {
          type: 'line',
          data: 'profitLoss'
        }
      })

      const resSales = await this.$axios.get(`/api/chart`, {
        params: {
          type: 'line',
          data: 'sales'
        }
      })

      this.$refs.invoice.setData(resInvoice.data)
      this.$refs.expense.setData(resExpense.data)
      this.$refs.profitLoss.setData(resProfitLoss.data)
      this.$refs.sales.setData(resSales.data)

      // this.$nuxt.$loading.finish()
      this.loading = false

    }
  }
}
</script>

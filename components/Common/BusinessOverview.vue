<template>
  <v-row>
    <v-col cols="12" lg="9">
      <v-container>
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
      title: 'Dashboard',
      value: [423, 446, 675, 510, 590, 610, 760],
    }
  },

  activated() {
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
  },
}
</script>

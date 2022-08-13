<template>
  <LazyReportLayoutDefault
    ref="report"
    md-width="8"
    :period="period"
    @getData="getData"
  >
    <template #content>
      <v-simple-table dense>
        <template #default>
          <tbody>
            <tr>
              <th>Operating Revenues</th>
              <th></th>
            </tr>
            <tr v-if="operatingRevenue">
              <td colspan="2">
                <ReportSectionDetail :items="operatingRevenue"></ReportSectionDetail>
              </td>
            </tr>
            <tr>
              <th>Operating Expenses</th>
              <th></th>
            </tr>
            <tr v-if="operatingExpense">
              <td colspan="2">
                <ReportSectionDetail :items="operatingExpense"></ReportSectionDetail>
              </td>
            </tr>
            <tr style="border-top: 2px solid #222 !important">
              <th>Gross Profit</th>
              <th class="text-right" style="border-top: 2px solid #222 !important;">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(grossProfit)
                  }}
                </span>
              </th>
            </tr>
            <tr>
              <th>Non Operating Revenues</th>
              <th></th>
            </tr>
            <tr v-if="nonOperatingRevenue">
              <td colspan="2">
                <ReportSectionDetail :items="nonOperatingRevenue"></ReportSectionDetail>
              </td>
            </tr>
            <tr>
              <th>Total Revenue</th>

              <th class="text-right" style="border-top: 2px solid #222 !important;">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(totalRevenue)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>Non Operating Expenses</th>
              <th></th>
            </tr>

            <tr v-if="directExpense">
              <td colspan="2">
                <ReportSectionDetail :items="directExpense"></ReportSectionDetail>
              </td>
            </tr>

            <tr v-if="overHeadExpense">
              <td colspan="2">
                <ReportSectionDetail :items="overHeadExpense"></ReportSectionDetail>
              </td>
            </tr>

            <tr v-if="otherExpense">
              <td colspan="2">
                <ReportSectionDetail :items="otherExpense"></ReportSectionDetail>
              </td>
            </tr>

            <tr>
              <th>Total Non Operating Expenses</th>
              <th class="text-right" style="border-top: 2px solid #222 !important;">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(totalNonOperatingExpense)
                  }}
                </span>
              </th>
            </tr>
            <tr>
              <th>Net Profit</th>
              <th class="text-right" style="border-top: 2px solid #222 !important;">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(netProfit)
                  }}
                </span>
              </th>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </template>
  </LazyReportLayoutDefault>
</template>

<script>
export default {
  name: 'ListReport',

  data() {
    return {
      loading: true,
      allData: [],
      operatingRevenue: {},
      operatingExpense: {},
      nonOperatingRevenue: {},

      overHeadExpense: {},
      directExpense: {},
      otherExpense: {},

      grossProfit: 0,
      totalRevenue: 0,
      netProfit: 0,
      totalNonOperatingExpense: 0,
      period: '',
    }
  },

  head() {
    return {
      title: this.$route.query.name,
    }
  },

  methods: {
    getData(data) {
      this.allData = data.data

      this.period = data.startDate + ' to ' + data.endDate

      this.grossProfit = this.allData.results.GROSS_PROFIT
      this.totalRevenue = this.allData.results.TOTAL_REVENUE
      this.netProfit = this.allData.results.NET_PROFIT
      this.totalNonOperatingExpense = this.allData.totals.NON_OPERATING_EXPENSES

      this.operatingRevenue =
        this.allData.accounts.OPERATING_REVENUES.OPERATING_REVENUE

      this.operatingExpense =
        this.allData.accounts.OPERATING_EXPENSES.OPERATING_EXPENSE

      this.nonOperatingRevenue =
        this.allData.accounts.NON_OPERATING_REVENUES.NON_OPERATING_REVENUE

      this.overHeadExpense =
        this.allData.accounts.NON_OPERATING_EXPENSES.OVERHEAD_EXPENSE

      this.directExpense =
        this.allData.accounts.NON_OPERATING_EXPENSES.DIRECT_EXPENSE

      this.otherExpense =
        this.allData.accounts.NON_OPERATING_EXPENSES.OTHER_EXPENSE
    },
  },
}
</script>

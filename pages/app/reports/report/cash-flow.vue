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
              <th>Operations Cash Flow</th>
              <th></th>
            </tr>

            <tr>
              <th>Net Profit</th>
              <th class="text-right">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(netProfit)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>Provisions</th>
              <th class="text-right">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(provision)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>Receivables</th>
              <th class="text-right">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(receiveable)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>Payables</th>
              <th class="text-right">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(payable)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>Taxation</th>
              <th class="text-right">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(taxation)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>Current Assets</th>
              <th class="text-right">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(currentAsset)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>Current Liabilities</th>
              <th class="text-right">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(currentLiability)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>Total Operations Cash Flow</th>
              <th class="text-right" style="border-top: 2px solid #222 !important;">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(totalOperationCashFlow)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>Investment Cash Flow</th>
              <th></th>
            </tr>

            <tr>
              <th>Non Current Assets</th>
              <th class="text-right">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(nonCurrentAsset)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>Total Investment Cash Flow</th>
              <th class="text-right" style="border-top: 2px solid #222 !important;">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(totalInvestmentCashFlow)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>Financing Cash Flow</th>
              <th></th>
            </tr>

            <tr>
              <th>Non Current Liabilities</th>
              <th class="text-right">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(nonCurrentLiability)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>Equity</th>
              <th class="text-right">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(equity)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>Total Financing Cash Flow</th>
              <th class="text-right" style="border-top: 2px solid #222 !important;">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(totalFinanceCashflow)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>Net Cash Flow</th>
              <th></th>
            </tr>

            <tr>
              <th>Beginning Cash balance</th>
              <th class="text-right">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(beginningCash)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th> Net Cash Flow</th>
              <th class="text-right">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(netCashflow)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>Ending Cash balance</th>
              <th class="text-right" style="border-top: 2px solid #222 !important;">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(endingCash)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>Cashbook balance</th>
              <th class="text-right" style="border-top: 2px solid #222 !important;">
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(cashbookBalance)
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
      netProfit: 0,
      provision: 0,
      receiveable: 0,
      payable: 0,
      taxation: 0,
      currentAsset: 0,
      currentLiability: 0,
      totalOperationCashFlow: 0,
      nonCurrentAsset: 0,
      totalInvestmentCashFlow: 0,
      nonCurrentLiability: 0,
      equity: 0,
      totalFinanceCashflow: 0,
      beginningCash: 0,
      netCashflow: 0,
      endingCash: 0,
      cashbookBalance: 0,
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

      this.netProfit = this.allData.balances.PROFIT
      this.provision = this.allData.balances.PROVISIONS
      this.receiveable = this.allData.balances.RECEIVABLES
      this.payable = this.allData.balances.PAYABLES
      this.taxation = this.allData.balances.TAXATION
      this.currentAsset = this.allData.balances.CURRENT_ASSETS
      this.currentLiability = this.allData.balances.CURRENT_LIABILITIES
      this.totalOperationCashFlow = this.allData.results.OPERATIONS_CASH_FLOW
      this.nonCurrentAsset = this.allData.balances.NON_CURRENT_ASSETS
      this.totalInvestmentCashFlow = this.allData.results.INVESTMENT_CASH_FLOW
      this.nonCurrentLiability = this.allData.balances.NON_CURRENT_LIABILITIES
      this.equity = this.allData.balances.EQUITY
      this.totalFinanceCashflow = this.allData.results.FINANCING_CASH_FLOW
      this.beginningCash = this.allData.results.START_CASH_BALANCE
      this.netCashflow = this.allData.balances.NET_CASH_FLOW
      this.endingCash = this.allData.results.END_CASH_BALANCE
      this.cashbookBalance = this.allData.results.CASHBOOK_BALANCE
    },
  },
}
</script>

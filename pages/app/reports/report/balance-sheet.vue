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
              <th>{{ $t('Assets') }}</th>
              <th></th>
            </tr>
            <tr v-if="itemNonCurrentAsset">
              <td colspan="2">
                <ReportSectionDetail :items="itemNonCurrentAsset"></ReportSectionDetail>
              </td>
            </tr>
            <tr v-if="itemContraAsset">
              <td colspan="2">
                <ReportSectionDetail :items="itemContraAsset"></ReportSectionDetail>
              </td>
            </tr>
            <tr v-if="itemInventory">
              <td colspan="2">
                <ReportSectionDetail :items="itemInventory"></ReportSectionDetail>
              </td>
            </tr>
            <tr v-if="itemBank">
              <td colspan="2">
                <ReportSectionDetail :items="itemBank"></ReportSectionDetail>
              </td>
            </tr>
            <tr v-if="itemCurrentAsset">
              <td colspan="2">
                <ReportSectionDetail :items="itemCurrentAsset"></ReportSectionDetail>
              </td>
            </tr>
            <tr v-if="itemReceivable">
              <td colspan="2">
                <ReportSectionDetail :items="itemReceivable"></ReportSectionDetail>
              </td>
            </tr>
            <tr style="border-top: 2px solid #222 !important">
              <th>{{ $t('Total Assets') }}</th>
              <th
                class="text-right"
                style="border-top: 2px solid #222 !important"
              >
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(totalAsset)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>{{ $t('Liabilities') }}</th>
              <th></th>
            </tr>

            <tr v-if="itemNonCurrentLiability">
              <td colspan="2">
                <ReportSectionDetail
                  :items="itemNonCurrentLiability"
                ></ReportSectionDetail>
              </td>
            </tr>

            <tr v-if="itemControl">
              <td colspan="2">
                <ReportSectionDetail
                  :items="itemControl"
                ></ReportSectionDetail>
              </td>
            </tr>

            <tr v-if="itemCurrentLiability">
              <td colspan="2">
                <ReportSectionDetail
                  :items="itemCurrentLiability"
                ></ReportSectionDetail>
              </td>
            </tr>

            <tr v-if="itemPayable">
              <td colspan="2">
                <ReportSectionDetail
                  :items="itemPayable"
                ></ReportSectionDetail>
              </td>
            </tr>

            <tr>
              <th>{{ $t('Total Liabilities') }}</th>

              <th
                class="text-right"
                style="border-top: 2px solid #222 !important"
              >
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(totalLiability)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>{{ $t('Reconciliation') }}</th>
              <th></th>
            </tr>

            <tr v-if="itemReconciliation">
              <td colspan="2">
                <ReportSectionDetail
                  :items="itemReconciliation"
                ></ReportSectionDetail>
              </td>
            </tr>

            <tr>
              <th>{{ $t('Total Reconciliation') }}</th>
              <th
                class="text-right"
                style="border-top: 2px solid #222 !important"
              >
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(totalReconciliation)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>{{ $t('Net Assets') }}</th>
              <th
                class="text-right"
                style="border-top: 2px solid #222 !important"
              >
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(netAsset)
                  }}
                </span>
              </th>
            </tr>

            <tr>
              <th>{{ $t('Equity') }}</th>
              <th></th>
            </tr>

            <tr v-if="itemEquity">
              <td colspan="2">
                <ReportSectionDetail
                  :items="itemEquity"
                ></ReportSectionDetail>
              </td>
            </tr>

            <tr>
              <th>{{ $t('Total Equity') }}</th>
              <th
                class="text-right"
                style="border-top: 2px solid #222 !important"
              >
                <span class="mr-4">
                  {{
                    $auth.user.entity.currency.currency_symbol +
                    ' ' +
                    $formatter.formatPrice(totalEquity)
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
      // asset
      itemNonCurrentAsset: {},
      itemContraAsset: {},
      itemInventory: {},
      itemBank: {},
      itemCurrentAsset: {},
      itemReceivable: {},

      totalAsset: 0,
      totalEquity: 0,
      totalLiability: 0,
      totalReconciliation: 0,
      // liability
      itemNonCurrentLiability: {},
      itemControl: {},
      itemCurrentLiability: {},
      itemPayable: {},

      itemEquity: {},

      itemReconciliation: {},

      netAsset: 0,
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
      // assets
      this.itemNonCurrentAsset = this.allData.accounts.ASSETS.NON_CURRENT_ASSET
      this.itemContraAsset = this.allData.accounts.ASSETS.CONTRA_ASSET
      this.itemInventory = this.allData.accounts.ASSETS.INVENTORY
      this.itemBank = this.allData.accounts.ASSETS.BANK
      this.itemCurrentAsset = this.allData.accounts.ASSETS.CURRENT_ASSET
      this.itemReceivable = this.allData.accounts.ASSETS.RECEIVEABLE

      // liability
      this.itemNonCurrentLiability = this.allData.accounts.LIABILITIES.NON_CURRENT_LIABILITY
      this.itemControl = this.allData.accounts.LIABILITIES.CONTROL
      this.itemCurrentLiability = this.allData.accounts.LIABILITIES.CURRENT_LIABILITY
      this.itemPayable = this.allData.accounts.LIABILITIES.PAYABLE

      // equity
      this.itemEquity = this.allData.accounts.EQUITY.EQUITY

      this.itemReconciliation = this.allData.accounts.RECONCILIATION.RECONCILIATION

      this.totalAsset = this.allData.totals.ASSETS
      this.totalLiability = this.allData.totals.LIABILITIES
      this.totalReconciliation = this.allData.totals.RECONCILIATION
      this.netAsset = this.allData.results.NET_ASSETS
      this.totalEquity = this.allData.results.TOTAL_EQUITY
    },
  },
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="10">
        <v-expansion-panels ref="tableDocument" v-model="panel" multiple>
          <v-expansion-panel v-for="(item, i) in items" :key="i">
            <v-expansion-panel-header>{{
              item.header
            }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list link dense>
                <v-list-item-group>
                  <v-row dense>
                    <v-col
                      v-for="(value, index) in item.items"
                      :key="index"
                      cols="12"
                      md="6"
                    >
                      <v-list-item dense class="pt-0 pb-0">
                        <v-list-item-title
                          v-text="value.name"
                        ></v-list-item-title>
                        <v-list-item-action>
                          <v-list-item-action-text
                            v-text="item.action"
                          ></v-list-item-action-text>
                          <v-icon small color="yellow darken-3">
                            mdi-star-outline
                          </v-icon>
                        </v-list-item-action>
                      </v-list-item>
                      <v-divider></v-divider>
                    </v-col>
                  </v-row>
                </v-list-item-group>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AllSales',

  data() {
    return {
      panel: [0, 1, 2, 3, 4, 5, 6],
      items: [
        {
          header: 'Business Overview',
          items: [
            { name: 'Audit Log', route: '' },
            { name: 'Statement of cash flow', route: '' },
            { name: 'Ballance sheet', route: '' },
            { name: 'Balance Sheet Comparison', route: '' },
            { name: 'Balance Sheet Detail', route: '' },
            { name: 'Balance Sheet Summary', route: '' },
            { name: 'Business Snapshot', route: '' },
            { name: 'Profit and loss', route: '' },
            { name: 'Profit and Loss as % of total income', route: '' },
            { name: 'Profit and Loss Comparison', route: '' },
            { name: 'Profit and Loss Detail', route: '' },
            { name: 'Profit and Loss year-to-date comparison', route: '' },
            { name: 'Profit and Loss by Customer', route: '' },
            { name: 'Profit and Loss by Month', route: '' },
            { name: 'Profit and Loss by Tag Group', route: '' },
            { name: 'Project Profitability Summary', route: '' },
            { name: 'Quarterly Profit and Loss Summary', route: '' },
          ],
        },
        {
          header: 'Who owe you',
          items: [
            { name: 'Account receivable aging detail', route: '' },
            { name: 'Account receivable aging summary', route: '' },
            { name: 'Collections Report', route: '' },
            { name: 'Customer Balance Detail', route: '' },
            { name: 'Customer Balance Summary', route: '' },
            { name: 'Invoice List', route: '' },
            { name: 'Invoices and Received Payments', route: '' },
            { name: 'Open invoice', route: '' },
            { name: 'Statement List', route: '' },
            { name: 'Terms List', route: '' },
            { name: 'Unbilled charges', route: '' },
            { name: 'Unbilled time', route: '' },
          ],
        },
        {
          header: 'Sales and customer',
          items: [
            { name: 'Customer Contact List', route: '' },
            { name: 'Deposit Detail', route: '' },
            {
              name: 'Estimates & Progress Invoicing Summary by Customer',
              route: '',
            },
            { name: 'Estimates by Customer', route: '' },
            { name: 'Income by Customer Summary', route: '' },
            { name: 'Inventory Valuation Detail', route: '' },
            { name: 'Inventory Valuation Summary', route: '' },
            { name: 'Payment Method List', route: '' },
            { name: 'Physical Inventory Worksheet', route: '' },
            { name: 'Product/Service List', route: '' },
            { name: 'Sales by Class Detail', route: '' },
            { name: 'Sales by Class Summary', route: '' },
            { name: 'Sales by Customer Detail', route: '' },
            { name: 'Sales by Customer Summary', route: '' },
            { name: 'Sales by Customer Type Detail', route: '' },
            { name: 'Sales by Location Detail', route: '' },
            { name: 'Sales by Location Summary', route: '' },
            { name: 'Sales by Product/Service Detail', route: '' },
            { name: 'Sales by Product/Service Summary', route: '' },
            { name: 'Time Activities by Customer Detail', route: '' },
            { name: 'Transaction List by Customer', route: '' },
            { name: 'Transaction List by Tag Group', route: '' },
          ],
        },
        {
          header: 'What you owe',
          items: [
            { name: 'Accounts payable aging detail', route: '' },
            { name: 'Accounts payable aging summary', route: '' },
            { name: 'Bill Payment List', route: '' },
            { name: 'Bills and Applied Payment', route: '' },
            { name: 'Unpaid Bills', route: '' },
            { name: 'Vendor Balance Detail', route: '' },
            { name: 'Vendor Balance Summary', route: '' },
          ],
        },
        {
          header: 'Expense and vendor',
          items: [
            { name: 'Expenses by Vendor Summary', route: '' },
            { name: 'Open Purchase Order List', route: '' },
            { name: 'Open Purchase Order Detail', route: '' },
            { name: 'Purchases by Product/Service Detail', route: '' },
            { name: 'Purchases by Vendor Detail', route: '' },
            { name: 'Transaction List by Vendor', route: '' },
            { name: 'Vendor Contact List', route: '' },
          ],
        },
        {
          header: 'Payroll',
          items: [
            { name: 'Employee Contact List', route: '' },
            { name: 'Paycheck History', route: '' },
            { name: 'Payroll Billing Summary', route: '' },
            { name: 'Payroll Details', route: '' },
            { name: 'Payroll Summary by Employee', route: '' },
            { name: 'Payroll Tax Liability', route: '' },
            { name: 'Payroll Tax Payments', route: '' },
            { name: 'Time Activities by Employee Detail', route: '' },
            { name: 'Total Pay', route: '' },
            { name: 'Total Payroll Cost', route: '' },
            { name: 'Vacation and Sick Leave', route: '' },
          ],
        },

        {
          header: 'Accounting',
          items: [
            { name: 'Account List', route: '' },
            { name: 'Balance Sheet Comparison', route: '' },
            { name: 'Balance Sheet', route: '' },
            { name: 'General Ledger', route: '' },
            { name: 'Journal', route: '' },
            { name: 'Profit and Loss Comparison', route: '' },
            { name: 'Profit and Loss by Tag Group', route: '' },
            { name: 'Profit and Loss', route: '' },
            { name: 'Recent Automatic Transactions', route: '' },
            { name: 'Recent Transactions', route: '' },
            { name: 'Reconciliation Reports', route: '' },
            { name: 'Statement of Cash Flows', route: '' },
            { name: 'Transaction Detail by Account', route: '' },
            { name: 'Transaction List by Date', route: '' },
            { name: 'Transaction List with Splits', route: '' },
            { name: 'Trial Balance', route: '' },
          ],
        },
      ],
    }
  },

  head() {
    return {
      title: 'Reports',
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

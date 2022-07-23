<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="10">
        <v-card class="mx-auto">
          <v-sheet class="pa-4 primary lighten-2">
            <v-text-field
              v-model="search"
              label="Search Company Directory"
              dark
              flat
              solo-inverted
              hide-details
              clearable
              clear-icon="mdi-close-circle-outline"
            ></v-text-field>
            <v-checkbox
              v-model="caseSensitive"
              dark
              hide-details
              label="Case sensitive search"
            ></v-checkbox>
          </v-sheet>
          <v-card-text>
            <v-treeview
              :items="items"
              :search="search"
              :filter="filter"
              :open.sync="open"
              activatable
            >
              <template #label="{ item }">
                <a @click="openDialog(item)">{{ item.name }}</a>
              </template>
            </v-treeview>
          </v-card-text>
        </v-card>
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
      itemsPerPageArray: [4, 8, 12],
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      sortBy: 'name',
      keys: ['Name', 'Calories'],
      open: [1, 2, 3, 4, 5, 6, 7, 8],
      search: null,
      caseSensitive: false,
      items: [
        {
          id: 1,
          name: 'Business Overview',
          children: [
            { id: 11, name: 'Audit Log', route: '' },
            { id: 12, name: 'Statement of cash flow', route: '' },
            { id: 13, name: 'Ballance sheet', route: '' },
            { id: 14, name: 'Balance Sheet Comparison', route: '' },
            { id: 15, name: 'Balance Sheet Detail', route: '' },
            { id: 16, name: 'Balance Sheet Summary', route: '' },
            { id: 17, name: 'Business Snapshot', route: '' },
            { id: 18, name: 'Profit and loss', route: '' },
            { id: 19, name: 'Profit and Loss as % of total income', route: '' },
            { id: 111, name: 'Profit and Loss Comparison', route: '' },
            { id: 112, name: 'Profit and Loss Detail', route: '' },
            {
              id: 113,
              name: 'Profit and Loss year-to-date comparison',
              route: '',
            },
            { id: 114, name: 'Profit and Loss by Customer', route: '' },
            { id: 115, name: 'Profit and Loss by Month', route: '' },
            { id: 116, name: 'Profit and Loss by Tag Group', route: '' },
            { id: 117, name: 'Project Profitability Summary', route: '' },
            { id: 118, name: 'Quarterly Profit and Loss Summary', route: '' },
          ],
        },
        {
          id: 2,
          name: 'Who owe you',
          children: [
            { id: 21, name: 'Account receivable aging detail', route: '' },
            { id: 22, name: 'Account receivable aging summary', route: '' },
            { id: 23, name: 'Collections Report', route: '' },
            { id: 24, name: 'Customer Balance Detail', route: '' },
            { id: 25, name: 'Customer Balance Summary', route: '' },
            { id: 26, name: 'Invoice List', route: '' },
            { id: 27, name: 'Invoices and Received Payments', route: '' },
            { id: 28, name: 'Open invoice', route: '' },
            { id: 29, name: 'Statement List', route: '' },
            { id: 211, name: 'Terms List', route: '' },
            { id: 212, name: 'Unbilled charges', route: '' },
            { id: 213, name: 'Unbilled time', route: '' },
          ],
        },
        {
          id: 4,
          name: 'Sales and customer',
          children: [
            { id: 41, name: 'Customer Contact List', route: '' },
            { id: 42, name: 'Deposit Detail', route: '' },
            {
              id: 43,
              name: 'Estimates & Progress Invoicing Summary by Customer',
              route: '',
            },
            { id: 44, name: 'Estimates by Customer', route: '' },
            { id: 45, name: 'Income by Customer Summary', route: '' },
            { id: 46, name: 'Inventory Valuation Detail', route: '' },
            { id: 47, name: 'Inventory Valuation Summary', route: '' },
            { id: 48, name: 'Payment Method List', route: '' },
            { id: 49, name: 'Physical Inventory Worksheet', route: '' },
            { id: 411, name: 'Product/Service List', route: '' },
            { id: 412, name: 'Sales by Class Detail', route: '' },
            { id: 413, name: 'Sales by Class Summary', route: '' },
            { id: 414, name: 'Sales by Customer Detail', route: '' },
            { id: 415, name: 'Sales by Customer Summary', route: '' },
            { id: 416, name: 'Sales by Customer Type Detail', route: '' },
            { id: 417, name: 'Sales by Location Detail', route: '' },
            { id: 418, name: 'Sales by Location Summary', route: '' },
            { id: 419, name: 'Sales by Product/Service Detail', route: '' },
            { id: 421, name: 'Sales by Product/Service Summary', route: '' },
            { id: 422, name: 'Time Activities by Customer Detail', route: '' },
            { id: 423, name: 'Transaction List by Customer', route: '' },
            { id: 424, name: 'Transaction List by Tag Group', route: '' },
          ],
        },
        {
          id: 5,
          name: 'What you owe',
          children: [
            { id: 51, name: 'Accounts payable aging detail', route: '' },
            { id: 52, name: 'Accounts payable aging summary', route: '' },
            { id: 53, name: 'Bill Payment List', route: '' },
            { id: 54, name: 'Bills and Applied Payment', route: '' },
            { id: 55, name: 'Unpaid Bills', route: '' },
            { id: 56, name: 'Vendor Balance Detail', route: '' },
            { id: 57, name: 'Vendor Balance Summary', route: '' },
          ],
        },
        {
          id: 6,
          name: 'Expense and vendor',
          children: [
            { id: 61, name: 'Expenses by Vendor Summary', route: '' },
            { id: 62, name: 'Open Purchase Order List', route: '' },
            { id: 63, name: 'Open Purchase Order Detail', route: '' },
            { id: 64, name: 'Purchases by Product/Service Detail', route: '' },
            { id: 65, name: 'Purchases by Vendor Detail', route: '' },
            { id: 66, name: 'Transaction List by Vendor', route: '' },
            { id: 67, name: 'Vendor Contact List', route: '' },
          ],
        },
        {
          id: 7,
          name: 'Payroll',
          children: [
            { id: 71, name: 'Employee Contact List', route: '' },
            { id: 72, name: 'Paycheck History', route: '' },
            { id: 73, name: 'Payroll Billing Summary', route: '' },
            { id: 74, name: 'Payroll Details', route: '' },
            { id: 75, name: 'Payroll Summary by Employee', route: '' },
            { id: 76, name: 'Payroll Tax Liability', route: '' },
            { id: 77, name: 'Payroll Tax Payments', route: '' },
            { id: 78, name: 'Time Activities by Employee Detail', route: '' },
            { id: 79, name: 'Total Pay', route: '' },
            { id: 711, name: 'Total Payroll Cost', route: '' },
            { id: 712, name: 'Vacation and Sick Leave', route: '' },
          ],
        },

        {
          id: 8,
          name: 'Accounting',
          children: [
            { id: 81, name: 'Account List', route: '' },
            { id: 82, name: 'Balance Sheet Comparison', route: '' },
            { id: 83, name: 'Balance Sheet', route: '' },
            { id: 84, name: 'General Ledger', route: '' },
            { id: 85, name: 'Journal', route: '' },
            { id: 86, name: 'Profit and Loss Comparison', route: '' },
            { id: 87, name: 'Profit and Loss by Tag Group', route: '' },
            { id: 88, name: 'Profit and Loss', route: '' },
            { id: 89, name: 'Recent Automatic Transactions', route: '' },
            { id: 811, name: 'Recent Transactions', route: '' },
            { id: 812, name: 'Reconciliation Reports', route: '' },
            { id: 813, name: 'Statement of Cash Flows', route: '' },
            { id: 814, name: 'Transaction Detail by Account', route: '' },
            { id: 815, name: 'Transaction List by Date', route: '' },
            { id: 816, name: 'Transaction List with Splits', route: '' },
            { id: 817, name: 'Trial Balance', route: '' },
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

  computed: {
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].includes(search)
        : undefined
    },
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
    openDialog(item) {
      console.log(item)
    },

    getDataFromApi() {
      if (this.$refs.tableDocument) {
        this.$refs.tableDocument.getDataFromApi()
      }
    },
  },
}
</script>

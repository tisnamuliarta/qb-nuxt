<template>
  <div>
    <DocumentTableDocument
      ref="tableDocument"
      type-document="BL"
      form-url="/app/form/purchase/invoice"
      table-url="/api/transactions"
      url="/api/transactions"
      :header-table="[
        { text: $t('Transaction No'), value: 'transaction_no', cellClass: 'disable-wrap' },
        { text: 'No Contract', value: 'reference_no', cellClass: 'disable-wrap' },
        { text: 'Vendor', value: 'contact.name', cellClass: 'disable-wrap' },
        {
          text: $t('Transaction Date'),
          value: 'transaction_date',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
        {
          text: $t('Due Date'),
          value: 'due_date',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
        {
          text: 'Status',
          value: 'status',
          align: 'left',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
        {
          text: 'Balance Due',
          value: 'balance_due',
          align: 'right',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
        {
          text: 'Total',
          value: 'main_account_amount',
          align: 'right',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
        {
          text: 'Actions',
          value: 'actions',
          align: 'center',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
      ]"
    ></DocumentTableDocument>
  </div>
</template>

<script>
export default {
  name: 'AllPurchase',

  head() {
    return {
      title: this.$t('A/P Invoice'),
    }
  },

  activated() {
    this.$nuxt.$emit('extensionActive', {
      active: 2,
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

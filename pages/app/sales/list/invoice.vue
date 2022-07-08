<template>
  <div>
    <DocumentTableDocument
      ref="tableDocument"
      type-document="IN"
      form-url="/app/form/sales/invoice"
      table-url="/api/transactions"
      :header-table="[
        { text: 'Number', value: 'transaction_no', cellClass: 'disable-wrap' },
        { text: 'Customer', value: 'contact.name', cellClass: 'disable-wrap' },
        {
          text: 'Date',
          value: 'issued_at',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
        {
          text: 'Due Date',
          value: 'due_at',
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
      title: this.$t('A/R Invoice'),
    }
  },

  activated() {
    this.$nuxt.$emit('extensionActive', {
      active: 3,
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

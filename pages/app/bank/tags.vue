<template>
  <div>
    <DocumentTableDocument
      ref="tableDocument"
      type-document="CP"
      :type-trans="['CP','CS','PY', 'RC', 'CE', 'IN', 'BL', 'DN', 'CN']"
      :show-new-data-multiple="false"
      form-url="/app/form/purchase/payment"
      table-url="/api/transaction/group"
      url="/api/transaction/group"
      :header-table="[
        { text: $t('Transaction No'), value: 'transaction_no', cellClass: 'disable-wrap' },
        { text: 'Vendor/Customer', value: 'contact.name', cellClass: 'disable-wrap' },
        {
          text: $t('Transaction Type'),
          value: 'type',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
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
          text: 'Total',
          value: 'main_account_amount',
          align: 'right',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
        {
          text: 'Tags',
          value: 'tags',
          align: 'left',
          sortable: false,
          filterable: false,
        },
      ]"
    ></DocumentTableDocument>
  </div>
</template>

<script>
export default {
  name: 'PurchaseOverview',

  head() {
    return {
      title: 'Bank Transactions',
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


<template>
  <div>
    <DocumentTableDocument
      ref="tableDocument"
      type-document="GI"
      form-url="/app/form/inventory/issue"
      :table-title="$t('Goods Issue')"
      :header-table="[
        { text: $t('Transaction No'), value: 'transaction_no', cellClass: 'disable-wrap' },
        // { text: 'Vendor', value: 'contact.name', cellClass: 'disable-wrap' },
        {
          text: $t('Transaction Date'),
          value: 'transaction_date',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
        {
          text: $t('Reference'),
          value: 'reference_no',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
        {
          text: $t('Warehouse'),
          value: 'warehouse.name',
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
      title: this.$t('Goods Issue'),
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

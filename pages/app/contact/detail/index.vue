<template>
  <div>
    <InventoryTableContactTransaction
      ref="tableDocument"
      type-document="IN"
      form-url="/app/form/sales/invoice"
      :table-url="getTableUrl()"
      :table-title="tableTitle"
      :header-table="[
        { text: $t('Transaction No'), value: 'transaction_no', cellClass: 'disable-wrap' },
        { text: 'Customer', value: 'contact.name', cellClass: 'disable-wrap' },
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
    ></InventoryTableContactTransaction>
  </div>
</template>

<script>
export default {
  name: 'AllPurchase',

  data() {
    return {
      tableTitle: ''
    }
  },

  head() {
    return {
      title: this.$t('Transaction List'),
    }
  },

  activated() {
    this.getDataFromApi()
    this.$nuxt.$emit('extensionActive', {
      active: 0,
    })
  },

  created() {
    this.$nuxt.$on('getDataFromApi', ($event) => this.getDataFromApi($event))
  },

  methods: {
    getTableUrl() {
      return '/api/bp/transaction/' + this.$route.query.id
    },

    getDataFromApi() {
      this.$axios.get(`/api/bp/contacts/` + this.$route.query.id)
        .then((res) => {
          this.tableTitle = res.data.data.name
          if (this.$refs.tableDocument) {
            this.$refs.tableDocument.getDataFromApi()
          }
        })
    },
  },
}
</script>

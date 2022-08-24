<template>
  <div>
    <PayrollTableLoan
      ref="tableDocument"
      type-document="EMPLOYEE"
      :table-title="$t('Pinjaman')"
      form-url="/app/purchasereturn/form"
      :header-table="[
        { text: 'Name', value: 'employee.full_name', cellClass: 'disable-wrap' },
        { text: 'Rate', value: 'transaction_date', cellClass: 'disable-wrap' },
        { text: 'Amount', value: 'amount', cellClass: 'disable-wrap' },
        {
          text: 'Notes',
          value: 'narration',
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
    ></PayrollTableLoan>
  </div>
</template>

<script>
export default {
  name: 'EmployeesList',

  head() {
    return {
      title: 'Loan',
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

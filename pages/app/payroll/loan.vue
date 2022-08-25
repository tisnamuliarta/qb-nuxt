<template>
  <div>
    <PayrollTableLoan
      ref="tableDocument"
      type-document="EMPLOYEE"
      :table-title="$t('Loans')"
      form-url="/app/purchasereturn/form"
      :header-table="[
        { text: $t('Employees'), value: 'employee.full_name', cellClass: 'disable-wrap' },
        { text: $t('Loan Request Date'), value: 'transaction_date', cellClass: 'disable-wrap' },
        { text: $t('Amount'), value: 'amount', cellClass: 'disable-wrap' },
        { text: $t('Installment Amount'), value: 'installment_amount', cellClass: 'disable-wrap' },
        { text: $t('Installment Start Date'), value: 'installment_start_date', cellClass: 'disable-wrap' },
        { text: $t('Loan Type'), value: 'loan_type', cellClass: 'disable-wrap' },
        {
          text: $t('Notes'),
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

<template>
  <div>
    <PayrollTablePayCheck
      ref="tableDocument"
      type-document="EMPLOYEE"
      :table-title="$t('Paycheck list')"
      form-url="/app/form/payroll/pay-check"
      :header-table="[
        { text: $t('Transaction No'), value: 'transaction_no', cellClass: 'disable-wrap' },
        { text: $t('Pay date'), value: 'pay_date', cellClass: 'disable-wrap' },
        { text: 'From Date', value: 'from_date', cellClass: 'disable-wrap' },
        {
          text: 'To Date',
          value: 'to_date',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
        {
          text: 'Status',
          value: 'status',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
        {
          text: 'Created By',
          value: 'user.name',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
        {
          text: 'Total',
          value: 'main_account_amount',
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
    ></PayrollTablePayCheck>
  </div>
</template>

<script>
export default {
  name: 'EmployeesList',

  head() {
    return {
      title: 'Paycheck list',
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

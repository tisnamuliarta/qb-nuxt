<template>
  <div>
    <PayrollTableEmployee
      ref="tableDocument"
      type-document="EMPLOYEE"
      :table-title="$t('Employees')"
      form-url="/app/purchasereturn/form"
      :header-table="[
        { text: 'Name', value: 'first_name', cellClass: 'disable-wrap' },
        { text: 'ID', value: 'employee_id', cellClass: 'disable-wrap' },
        { text: 'Pay Rate', value: 'salary', cellClass: 'disable-wrap' },
        { text: 'Pay Method', value: 'payment_method', cellClass: 'disable-wrap' },
        {
          text: 'Phone Number',
          value: 'mobile_phone',
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
          text: 'Actions',
          value: 'actions',
          align: 'center',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
      ]"
    ></PayrollTableEmployee>
  </div>
</template>

<script>
export default {
  name: 'EmployeesList',

  head() {
    return {
      title: 'Employees',
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

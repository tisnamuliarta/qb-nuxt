<template>
  <div>
    <LazyPaymentDialogPayment
      ref="dialogForm"
      url="/api/transactions"
      form-url="/app/form/sales/payment"
      table-url="/app/bank/transaction/salespayment"
      form-type="RC"
      form-type-prefix="SP"
      dialog-title="Incoming Payment"
      @getDataFromApi="getDataFromApi"
    ></LazyPaymentDialogPayment>
  </div>
</template>

<script>
export default {
  name: 'SalesQuotation',

  head() {
    return {
      title: 'Incoming Payment',
    }
  },

  // activated() {
  //   this.$refs.dialogForm.openDialogFull()
  // },

  methods: {
    getDataFromApi() {
      this.$nuxt.$emit('getDataFromApi')
    }
  }
}
</script>

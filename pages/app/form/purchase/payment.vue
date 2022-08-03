<template>
  <div>
    <LazyPaymentDialogPayment
      ref="dialogForm"
      url="/api/transactions"
      form-url="/app/form/purchase/payment"
      table-url="/app/bank/transaction/purchasepayment"
      form-type="PY"
      form-type-prefix="PP"
      dialog-title="Outgoing Payment"
      @getDataFromApi="getDataFromApi"
    ></LazyPaymentDialogPayment>
  </div>
</template>

<script>
export default {
  name: 'SalesQuotation',

  // activated() {
  //   this.$refs.dialogForm.getDataFromApi()
  // },

  head() {
    return {
      title: 'Outgoing Payment',
    }
  },

  methods: {
    getDataFromApi() {
      this.$nuxt.$emit('getDataFromApi')
    }
  }
}
</script>

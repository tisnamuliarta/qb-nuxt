<template>
  <div>
    <LazyDocumentDialogForm
      ref="dialogForm"
      url="/api/transactions"
      form-url="/app/form/purchase/cash"
      table-url="/app/bank/transaction/cash-purchase"
      form-type="CP"
      form-type-prefix="CP"
      dialog-title="Cash Purchase"
      @getDataFromApi="getDataFromApi"
    ></LazyDocumentDialogForm>
  </div>
</template>

<script>
export default {
  name: 'SalesQuotation',

  head() {
    return {
      title: 'Cash Purchase',
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

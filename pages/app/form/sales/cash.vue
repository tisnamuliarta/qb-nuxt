<template>
  <div>
    <LazyDocumentDialogForm
      ref="dialogForm"
      url="/api/transactions"
      form-url="/app/form/sales/cash"
      table-url="/app/bank/transaction/cash-sale"
      form-type="CS"
      form-type-prefix="CS"
      dialog-title="Cash Sale"
      @getDataFromApi="getDataFromApi"
    ></LazyDocumentDialogForm>
  </div>
</template>

<script>
export default {
  name: 'SalesQuotation',

  head() {
    return {
      title: 'Cash Sale',
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

<template>
  <div>
    <LazyDocumentDialogForm
      ref="dialogForm"
      url="/api/transactions"
      form-url="/app/form/sales/invoice"
      table-url="/app/sales/list/invoice"
      form-type="IN"
      form-type-prefix="SI"
      dialog-title="AR Invoice"
      @getDataFromApi="getDataFromApi"
    ></LazyDocumentDialogForm>
  </div>
</template>

<script>
export default {
  name: 'SalesQuotation',

  head() {
    return {
      title: 'AR Invoice',
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

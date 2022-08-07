<template>
  <div>
    <LazyDocumentDialogForm
      ref="dialogForm"
      url="/api/transactions"
      form-url="/app/form/sales/dp"
      table-url="/app/sales/list/dp"
      form-type="RC"
      form-type-prefix="RD"
      dialog-title="AR Down Payment"
      @getDataFromApi="getDataFromApi"
    ></LazyDocumentDialogForm>
  </div>
</template>

<script>
export default {
  name: 'SalesQuotation',

  head() {
    return {
      title: 'AR Down Payment',
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

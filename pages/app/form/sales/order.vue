<template>
  <div>
    <LazyDocumentDialogForm
      ref="dialogForm"
      url="/api/documents"
      form-url="/app/form/sales/order"
      table-url="/app/sales/list/salesorder"
      form-type="SO"
      form-type-prefix="SO"
      dialog-title="Sales Order"
      @getDataFromApi="getDataFromApi"
    ></LazyDocumentDialogForm>
  </div>
</template>

<script>
export default {
  name: 'SalesQuotation',

  head() {
    return {
      title: 'Sales Order',
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

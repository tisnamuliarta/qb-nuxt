<template>
  <div>
    <LazyReceiptDialogReceipt
      ref="dialogForm"
      url="/api/documents"
      form-url="/app/form/inventory/issue"
      table-url="/app/item/issue"
      form-type="GI"
      form-type-prefix="GI"
      dialog-title="Goods Issue"
      @getDataFromApi="getDataFromApi"
    ></LazyReceiptDialogReceipt>
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
      title: 'Goods Issue',
    }
  },

  methods: {
    getDataFromApi() {
      this.$nuxt.$emit('getDataFromApi')
    }
  }
}
</script>

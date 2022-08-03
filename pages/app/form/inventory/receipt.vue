<template>
  <div>
    <LazyReceiptDialogReceipt
      ref="dialogForm"
      url="/api/documents"
      form-url="/app/form/inventory/receipt"
      table-url="/app/item/receipt"
      form-type="GE"
      form-type-prefix="GE"
      dialog-title="Goods Receipt"
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
      title: 'Goods Receipt',
    }
  },

  methods: {
    getDataFromApi() {
      this.$nuxt.$emit('getDataFromApi')
    }
  }
}
</script>

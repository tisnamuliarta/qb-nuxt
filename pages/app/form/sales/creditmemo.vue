<template>
  <div>
    <LazyDocumentDialogForm
      ref="dialogForm"
      url="/api/documents"
      form-url="/app/form/sales/creditmemo"
      table-url="/app/sales/list/creditmemo"
      form-type="CN"
      form-type-prefix="CN"
      dialog-title="AR Credit Memo"
      @getDataFromApi="getDataFromApi"
    ></LazyDocumentDialogForm>
  </div>
</template>

<script>
export default {
  name: 'SalesQuotation',

  head() {
    return {
      title: 'AR Credit Memo',
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

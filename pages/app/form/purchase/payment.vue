<template>
  <div>
    <LazyDocumentDialogForm
      ref="dialogForm"
      url="/api/transactions"
      form-url="/app/form/purchase/payment"
      form-type="PY"
      form-type-prefix="PP"
      dialog-title="Outgoing Payment"
      @getDataFromApi="getDataFromApi"
    ></LazyDocumentDialogForm>
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

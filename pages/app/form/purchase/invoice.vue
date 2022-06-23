<template>
  <div>
    <LazyDocumentDialogForm
      ref="dialogForm"
      url="/api/documents"
      form-type="PI"
      dialog-title="AP Invoice"
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
      title: 'AP Invoice',
    }
  },

  methods: {
    getDataFromApi() {
      this.$nuxt.$emit('getDataFromApi')
    }
  }
}
</script>

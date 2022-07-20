<template>
  <v-layout>
    <v-flex sm12>
      <div class="pl-4 pt-2">
        <span class="font-weight-medium text-h6"
          >{{ $t('Account Mapping') }}
        </span>
      </div>
      <LazyMainToolbar
        title="Account Mapping"
        show-new-data
        show-back-link
        new-data-text="New Mapping"
        @getDataFromApi="getAccountMapping"
        @newData="newData"
      />
      <div class="mt-0">
        <FormDisplayTable
          ref="formTable"
          @openDialog="openDialog"
        ></FormDisplayTable>
      </div>

      <AccountingDialogAccount
        ref="dialogAccount"
        @selectItems="selectItems"
      ></AccountingDialogAccount>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'AccountMapping',

  data() {
    return {
      url: '/api/financial/account-mapping'
    }
  },

  created() {
    this.getAccounts()
    this.getAccountMapping()
  },

  methods: {
    newData() {
      const vm = this
      const details = {}
      const clearData = vm.$refs.formTable.getAddData(document)
      clearData.forEach(function (item, key) {
        if (!vm.$refs.formTable.checkIfEmptyRow(key)) details[key] = item
      })

      this.$nuxt.$loading.start()
      this.$axios.post(this.url, details)
        .then((res) => {
          this.getAccountMapping()
        })
        .catch((err) => {
          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })
        })
        .finally(() => {
          this.$nuxt.$loading.finish()
        })
    },

    getAccountMapping() {
      this.$axios
        .get(this.url)
        .then((res) => {
          setTimeout(() => {
            this.$refs.formTable.setDataToDetails(
              res.data.data,
              res.data.colHeaders,
              res.data.columns
            )
          }, 300)
        })
        .catch((err) => {
          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })
        })
    },

    selectItems(data) {
      const rowData = data.row
      const selected = data.selected
      this.$refs.formTable.setDataAtRowProp(rowData, 'account_id', selected[0].id)
      this.$refs.formTable.setDataAtRowProp(rowData, 'account', selected[0].code)
      this.$refs.formTable.setDataAtRowProp(
        rowData,
        'account_name',
        selected[0].name
      )
    },

    openDialog(row) {
      this.$refs.dialogAccount.openDialog(row)
    },

    getAccounts() {},

    getForm() {
      return this.form
    },

    setForm(form) {
      this.form = Object.assign({}, form)
      this.getAccountMapping()
    },
  },
}
</script>

<template>
  <LazyFormDialogFull
    ref="dialogForm"
    @arrowLink="arrowLink"
    @closeDialog="closeDialog"
  >
    <v-overlay :value="showLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <template #content>
      <LazyPayrollFormPayCheck
        ref="formDocument"
        :form-type="formType"
      ></LazyPayrollFormPayCheck>
    </template>

    <template #actions>
      <v-spacer />
      <v-btn
        small
        color="green darken-1"
        class="mr-3"
        dark
        :loading="loading"
        :disabled="form.status === 'closed'"
        @click="actionSave('save')"
      >
        {{ actionName }}
      </v-btn>
    </template>
  </LazyFormDialogFull>
</template>

<script>
export default {
  name: 'DialogForm',

  props: {
    url: {
      type: String,
      default: '/api/payroll/payroll',
    },
    formType: {
      type: String,
      default: 'PE',
    },
    formUrl: {
      type: String,
      default: '/app/form/payroll/pay-check',
    },
    dialogTitle: {
      type: String,
      default: 'Paycheck list',
    },
    tableUrl: {
      type: String,
      default: '/app/payroll/pay-check',
    },
  },

  data() {
    return {
      title: this.dialogTitle,
      itemAction: [],
      action: [],
      breadcrumb: [],
      form: {},
      audits: {},
      defaultItem: {},
      dialogLoading: false,
      showLoading: true,
      dialog: true,
      loading: false,
      actionName: 'Save',
      actionOnSave: 'save',
      countRouter: -1,
    }
  },

  head() {
    return {
      title: this.$t('Paycheck list'),
    }
  },

  activated() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
    })
    setTimeout(() => {
      this.action = []
      this.itemAction = [
        { text: 'Copy', action: 'copy' },
        { text: 'Cancel', action: 'cancel' },
        { text: 'Audit History', action: 'history' },
      ]
      this.itemAction = this.appendItemAction(this.formType)
      // this.$refs.dialogForm.openDialog()
      this.$refs.dialogForm.openDialog()
      this.getDataFromApi()
    }, 500)
  },

  methods: {
    // A method that is called when the dialog is closed.
    close() {
      this.$emit('getDataFromApi')
    },

    checkDisable() {
      return this.form.status === 'closed' || this.form.status === 'cancel'
    },

    appendItemAction(type) {
      this.action = []

      return [...this.action, ...this.itemAction]
    },

    closeDialog() {
      this.$router.push({
        path: this.tableUrl,
      })
    },

    arrowLink(data) {
      this.$refs.dialogForm.showLoading()
      this.$axios
        .get(this.url + '/arrow', {
          params: {
            type: this.formType,
            status: data.status,
            document: this.$route.query.document,
          },
        })
        .then((res) => {
          this.$router.push({
            path: this.formUrl,
            query: {
              document: res.data.id,
            },
          })

          setTimeout(() => {
            this.getDataFromApi()
          }, 300)

          this.$refs.dialogForm.finishLoading()
        })
        .catch((err) => {
          this.$refs.dialogForm.finishLoading()

          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })
        })
    },

    async getDataFromApi(copyFromId) {
      this.showLoading = true
      try {
        // this.dialogLoading = true
        const type = this.formType
        const copyFrom = this.$route.query.copyFrom
        let res = ''
        if (copyFrom) {
          res = await this.$axios.get(`/api/document/copy/` + copyFrom)
        } else {
          res = await this.$axios.get(
            this.url + '/' + this.$route.query.document,
            {
              params: {
                type,
                copyFromId,
              },
            }
          )
        }

        let form = ''
        this.audits = res.data.audits
        if (res.data.count === 0) {
          form = res.data.form
          this.actionName = 'Save'
        } else {
          form = res.data.data
          this.actionName = 'Update'
        }

        this.form = Object.assign({}, form)
        this.defaultItem = Object.assign({}, form)

        if (copyFrom) {
          this.form.status = 'open'
          this.form.base_id = this.form.id
          this.form.base_type = this.form.transaction_type
          this.form.base_num = this.form.transaction_no
          this.form.transaction_type = this.formType
        }

        this.title = this.dialogTitle + ' #' + this.form.transaction_no

        this.$refs.dialogForm.setTitle(this.title)

        this.$refs.formDocument.setData(this.form, res.data.columns, res.data.colHeaders)

        this.showLoading = false
      } catch (err) {
        // this.showLoading = false

        const message =
          err.response !== undefined ? err.response.data.message : err
        this.$swal({
          type: 'error',
          title: 'Error',
          text: message,
        })
      }
    },

    actionSave(action) {
      this.actionOnSave = action
      const docId = this.$route.query.document
      const url = docId === '0' ? this.url : this.url + '/' + docId
      const method = docId === '0' ? 'post' : 'patch'
      const data = this.$refs.formDocument.returnData(docId)
      const vm = this
      this.loading = true
      this.showLoading = true
      this.$axios({ method, url, data })
        .then((res) => {
          this.$nuxt.$emit('snackbar', this.title + ' saved!')

          switch (this.actionOnSave) {
            case 'save':
              this.$router.push({
                path: vm.formUrl,
                query: {
                  document: res.data.id,
                },
              })
              setTimeout(() => {
                this.getDataFromApi()
              }, 50)
              break

            case 'saveNew':
              this.$router.push({
                path: vm.formUrl,
                query: {
                  document: 0,
                },
              })
              setTimeout(() => {
                this.getDataFromApi()
              }, 50)
              break

            case 'saveClose':
              this.$refs.dialogForm.closeDialog()
              break
          }
        })
        .catch((err) => {
          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })
        })
        .finally((res) => {
          this.showLoading = false
          this.loading = false
        })
    },
  },
}
</script>

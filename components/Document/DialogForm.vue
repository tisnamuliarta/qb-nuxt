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
      <!-- <LazyDocumentFormCash
        v-if="formType === 'CP' || formType === 'CS'"
        ref="formDocument"
        :form-type="formType"
      ></LazyDocumentFormCash> -->
      <LazyDocumentFormDocument
        ref="formDocument"
        :form-type="formType"
      ></LazyDocumentFormDocument>

      <AccountingDialogLedger ref="ledger"></AccountingDialogLedger>
    </template>

    <template #actions>
      <span v-if="actionName === 'Update Document'">
        <v-btn text small dark @click="printAction('preview')"
          >Print or Preview</v-btn
        >
        <v-divider dark vertical></v-divider>
        <v-btn text small dark>
          More
          <v-menu transition="slide-y-transition" bottom>
            <template #activator="{ on, attrs }">
              <v-btn dark icon v-bind="attrs" v-on="on">
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list link>
              <v-list-item
                v-for="(value, i) in itemAction"
                :key="i"
                @click="actionItem(value.action)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ value.text }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </span>

      <v-spacer />
      <v-btn
        small
        class="mr-3"
        :loading="loading"
        :disabled="checkDisable()"
        @click="actionSave('saveDraft')"
      >
        Save draft
      </v-btn>

      <v-btn
        small
        color="green darken-1"
        class="mr-3"
        dark
        :loading="loading"
        :disabled="checkDisable()"
        @click="actionSave('save')"
      >
        {{ actionName }}

        <!-- <v-menu transition="slide-y-transition" bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              dark
              icon
              :disabled="checkDisable()"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list link>
            <v-list-item
              v-for="(value, i) in items"
              :key="i"
              @click="actionSave(value.action)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ value.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu> -->
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
      default: '/api/documents',
    },
    formType: {
      type: String,
      default: '',
    },
    formUrl: {
      type: String,
      default: '',
    },
    dialogTitle: {
      type: String,
      default: '',
    },
    tableUrl: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      title: this.dialogTitle,
      items: [
        { text: 'Save and close', action: 'saveClose' },
        { text: 'Save and new', action: 'saveNew' },
        { text: 'Save and send', action: 'saveSend' },
      ],
      itemAction: [],
      action: [],
      breadcrumb: [],
      form: {},
      audits: {},
      defaultItem: {},
      dialogLoading: false,
      dialog: false,
      loading: false,
      showLoading: false,
      actionName: 'Save Document',
      actionOnSave: 'save',
      countRouter: -1,
      showDraft: false,
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
        { text: 'Cancel', action: 'canceled' },
        { text: 'Audit History', action: 'history' },
        { text: 'Journal Entry', action: 'journal' },
      ]
      this.itemAction = this.appendItemAction(this.formType)
      this.$auth.$storage.setState('formType', this.formType)
      // this.dialog = true
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
      return this.form.status === 'closed' || this.form.status === 'canceled'
    },

    appendItemAction(type) {
      this.action = []
      if (type === 'CS' || type === 'CP') {
        this.action = []
      } else {
        this.action = this.$formatter.appendAction(type)
      }

      return [...this.action, ...this.itemAction]
    },

    closeDialog() {
      this.$router.push({
        path: this.tableUrl,
      })
    },

    arrowLink(data) {
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
        })
        .catch((err) => {
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
          res = await this.$axios.get(`/api/document/copy`, {
            params: {
              type,
              copyFromId,
              copyFrom,
            },
          })
        } else {
          const transaction = this.$formatter.transactionList()

          const transactionType =
            this.form.transaction_type === undefined
              ? type
              : this.form.transaction_type

          const transactionUrl = transaction.includes(transactionType)
            ? '/api/transactions'
            : this.url

          const url = transactionUrl + '/' + this.$route.query.document

          res = await this.$axios.get(url, {
            params: {
              type,
              copyFromId,
            },
          })
        }

        let form = ''
        this.audits = res.data.audits
        if (res.data.count === 0) {
          form = res.data.form
          this.actionName = 'Save Document'
        } else {
          form = res.data.data
          this.actionName = 'Update Document'
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

        if (this.form.tags) {
          const tags = []
          this.form.tags.forEach((item, index) => {
            tags.push(item.name.en)
          })

          this.form.tags = tags
        }

        this.title = this.dialogTitle + ' #' + this.form.transaction_no
        this.$refs.dialogForm.setTitle(this.title)
        this.$refs.formDocument.setData(this.form)

        this.showLoading = false
      } catch (err) {
        this.showLoading = false

        const message =
          err.response !== undefined ? err.response.data.message : err
        this.$swal({
          type: 'error',
          title: 'Error',
          text: message,
        })
      }
    },

    // A method that is called when a user clicks on an action button in the UI.
    actionItem(action) {
      const vm = this
      switch (action) {
        case 'copy':
          this.$router.push({
            path: vm.formUrl,
            query: {
              document: 0,
            },
          })
          this.form.status = 'open'
          this.$refs.formDocument.setData(this.form)
          break

        case 'journal':
          this.$refs.ledger.openDialog(
            '/api/transaction/ledger/' + this.form.id
          )
          break

        case 'closed':
        case 'canceled':
          this.closeItem(this.form, action)
          break

        default:
          this.$router.push({
            path: vm.$formatter.mappingAction(action),
            query: {
              document: 0,
              copyFrom: this.form.id,
            },
          })
          this.form.status = 'open'
          this.form.base_id = this.form.id
          this.form.base_type = this.form.transaction_type
          this.form.base_num = this.form.document_number
          this.$refs.formDocument.setData(this.form)
          break
      }
    },

    closeItem(item, action) {
      this.$swal({
        title: this.$t('Are you sure you want to run this action?'),
        text: 'Data cannot be change after posted!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Save',
      }).then((result) => {
        if (result.value) {
          this.$nuxt.$loading.start()
          this.$axios
            .put(this.url + '/' + item.id, {
              updateStatus: action,
              ...item,
            })
            .then((res) => {
              this.getDataFromApi()
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
        }
      })
    },

    actionDocument(action) {
      const document = this.$route.query.document
      switch (action) {
        case 'SQ':
        case 'SO':
        case 'PQ':
        case 'PO':
          this.$router.push({
            path: '/dashboard/documents/form',
            query: {
              document: 0,
              type: action,
            },
          })
          setTimeout(() => {
            this.actionName = 'Save'
            this.$refs.formDocument.changeValue('type', action)
            this.$refs.formDocument.changeValue('parent_id', document)
          }, 300)
          break
        case 'C':
          this.$refs.formDocument.changeValue('status', 'cancel')
          this.store()
          break
        case 'sendEmail':
          this.openDialogEmail()
          break
      }
    },

    printAction(action) {
      switch (action) {
        case 'preview':
          this.previewDocument()
          break
        case 'sendEmail':
          this.openDialogEmail()
          break
      }
    },

    openDialogEmail() {
      this.$refs.dialogSendEmail.openEmailDialog(this.form)
    },

    previewDocument() {
      const vm = this
      this.$refs.dialogForm.showLoading()
      this.$axios
        .get(`/api/document/print`, {
          params: {
            id: vm.form.id,
            type: vm.form.transaction_type,
          },
          responseType: 'arraybuffer',
        })
        .then((response) => {
          this.$refs.dialogForm.finishLoading()
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')

          link.href = url
          link.setAttribute('download', vm.form.transaction_no + '.pdf') // set custom file name
          document.body.appendChild(link)

          link.click() // force download file without open new tab
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

    actionSave(action) {
      const type = ['IN', 'RC', 'CN', 'SR', 'BL', 'PY', 'DN', 'GN', 'CS', 'CP']
      if (action === 'save' && type.includes(this.form.transaction_type)) {
        this.$swal({
          title: this.$t('Are you sure you want to run this action?'),
          text: 'Data cannot be change after posted!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Save',
        }).then((result) => {
          if (result.value) {
            this.save(action)
          }
        })
      } else {
        this.save(action)
      }
    },

    save(action) {
      this.actionOnSave = action
      const docId = this.$route.query.document
      const transaction = this.$formatter.transactionList()
      const transactionUrl = transaction.includes(this.form.transaction_type)
        ? '/api/transactions'
        : this.url
      const url = docId === '0' ? transactionUrl : transactionUrl + '/' + docId
      const method = docId === '0' ? 'post' : 'patch'
      const data = {
        ...this.$refs.formDocument.returnData(docId),
        action,
      }
      const vm = this
      this.loading = true
      this.showLoading = true
      this.$axios({ method, url, data })
        .then((res) => {
          this.$nuxt.$emit('snackbar', this.title + ' saved!')

          switch (this.actionOnSave) {
            case 'save':
            case 'saveDraft':
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

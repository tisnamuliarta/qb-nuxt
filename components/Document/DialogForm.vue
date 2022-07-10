<template>
  <LazyFormDialogFull ref="dialogForm">
    <v-overlay :value="showLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <template #content>
      <LazyDocumentFormDocument
        ref="formDocument"
        :form-type="formType"
      ></LazyDocumentFormDocument>
    </template>
    <template #actions>
      <v-btn text small dark>Print or Preview</v-btn>
      <v-divider dark vertical></v-divider>
      <v-btn text small dark>Make recurring</v-btn>
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
        Save

        <v-menu transition="slide-y-transition" bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              dark
              icon
              :disabled="form.status === 'closed'"
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
        </v-menu>
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
  },

  data() {
    return {
      title: this.dialogTitle,
      items: [
        { text: 'Save and close', action: 'saveClose' },
        { text: 'Save and new', action: 'saveNew' },
        { text: 'Save and send', action: 'saveSend' },
      ],
      itemAction: [
        { text: 'Copy', action: 'copy' },
        { text: 'Cancel', action: 'cancel' },
        { text: 'Audit History', action: 'history' },
      ],
      breadcrumb: [],
      form: {},
      audits: {},
      defaultItem: {},
      dialogLoading: false,
      showLoading: false,
      dialog: true,
      loading: false,
      actionName: 'Save',
      actionOnSave: 'save',
      countRouter: -1,
    }
  },

  activated() {
    this.itemAction = this.appendItemAction(this.formType)
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
    })
    setTimeout(() => {
      // this.$refs.dialogForm.openDialog()
      this.$refs.dialogForm.openDialog()
      this.getDataFromApi()
    }, 300)
  },

  // mounted() {

  //   setTimeout(() => {
  //     this.$refs.dialogForm.openDialog()
  //     this.$refs.dialogForm.openDialog()
  //     this.getDataFromApi()
  //   }, 300)
  // },

  methods: {
    // A method that is called when the dialog is closed.
    close() {
      this.$emit('getDataFromApi')
    },

    checkDisable() {
      return this.form.status === 'closed' || this.form.status === 'cancel'
    },

    appendItemAction(type) {
      let action = []
      switch (type) {
        case 'PQ':
          action = [
            {
              text: 'Copy to ' + this.$t('Purchase Order'),
              action: 'PO',
              type: 'document',
            },
            {
              text: 'Copy to ' + this.$t('Goods Receipt PO'),
              action: 'GR',
              type: 'document',
            },
            {
              text: 'Copy to ' + this.$t('A/P Invoice'),
              action: 'BL',
              type: 'transaction',
            },
          ]
          break

        case 'PO':
          action = [
            {
              text: 'Copy to ' + this.$t('Goods Receipt PO'),
              action: 'GR',
              type: 'document',
            },
            {
              text: 'Copy to ' + this.$t('A/P Invoice'),
              action: 'BL',
              type: 'transaction',
            },
          ]
          break

        case 'GR':
          action = [
            {
              text: 'Copy to ' + this.$t('A/P Invoice'),
              action: 'BL',
              type: 'transaction',
            },
            {
              text: 'Copy to ' + this.$t('Goods Return'),
              action: 'BL',
              type: 'document',
            },
          ]
          break

        case 'BL':
          action = [
            {
              text: 'Copy to ' + this.$t('Outgoing Payment'),
              action: 'PY',
              type: 'transaction',
            },
          ]
          break

        case 'PY':
          action = [
            {
              text: 'Copy to ' + this.$t('A/P Credit Memo'),
              action: 'DN',
              type: 'transaction',
            },
          ]
          break

        case 'DN':
          action = [
            {
              text: 'Copy to ' + this.$t('Goods Return'),
              action: 'GN',
              type: 'document',
            },
          ]
          break

        case 'SQ':
          action = [
            {
              text: 'Copy to ' + this.$t('Sales Order'),
              action: 'SO',
              type: 'document',
            },
            {
              text: 'Copy to ' + this.$t('Sales Delivery'),
              action: 'SD',
              type: 'document',
            },
            {
              text: 'Copy to ' + this.$t('A/R Invoice'),
              action: 'IN',
              type: 'transaction',
            },
          ]
          break

        case 'SO':
          action = [
            {
              text: 'Copy to ' + this.$t('Sales Delivery'),
              action: 'SD',
              type: 'document',
            },
            {
              text: 'Copy to ' + this.$t('A/R Invoice'),
              action: 'IN',
              type: 'transaction',
            },
          ]
          break

        case 'SD':
          action = [
            {
              text: 'Copy to ' + this.$t('A/R Invoice'),
              action: 'IN',
              type: 'transaction',
            },
            {
              text: 'Copy to ' + this.$t('Sales Return'),
              action: 'SR',
              type: 'document',
            },
          ]
          break

        case 'IN':
          action = [
            {
              text: 'Copy to ' + this.$t('Incoming Payment'),
              action: 'RC',
              type: 'transaction',
            },
          ]
          break

        case 'RC':
          action = [
            {
              text: 'Copy to ' + this.$t('A/R Credit Memo'),
              action: 'CN',
              type: 'transaction',
            },
          ]
          break

        case 'CN':
          action = [
            {
              text: 'Copy to ' + this.$t('Sales Return'),
              action: 'SR',
              type: 'document',
            },
          ]
          break
      }

      return [...action, ...this.itemAction]
    },

    arrowLink(status, type) {
      this.$axios
        .get(this.url + '/arrow', {
          params: {
            type,
            status,
            document: this.$route.query.document,
          },
        })
        .then((res) => {
          this.$router.push({
            path: '/dashboard/documents',
            query: {
              document: res.data.id,
              type,
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

    getDataFromApi(copyFromId) {
      // this.dialogLoading = true
      const type = this.formType
      this.$axios
        .get(this.url + '/' + this.$route.query.document, {
          params: {
            type,
            copyFromId,
          },
        })
        .then((res) => {
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

          if (this.form.transaction_no) {
            this.title = this.dialogTitle + ' #' + this.form.transaction_no
          } else {
            this.title = this.dialogTitle + ' #' + this.form.document_number
          }

          this.$refs.dialogForm.setTitle(this.title)

          this.$refs.formDocument.setData(this.form)
        })
        .catch((err) => {
          const message =
            err.response !== undefined ? err.response.data.message : err
          this.$swal({
            type: 'error',
            title: 'Error',
            text: message,
          })
        })
        .finally((res) => {
          this.$nuxt.$loading.finish()
        })
    },

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

        default:
          break
      }
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

    deleteDocument(document) {
      const vm = this
      this.$swal({
        title: 'Are you sure?',
        text: 'The data will be deleted',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.value) {
          this.$axios
            .delete(this.url + '/' + document)
            .then((res) => {
              this.$swal({
                type: 'success',
                title: 'Success...',
                text: 'Data Deleted!',
              })
              this.$router.push({
                path: vm.$helper.mappingAction(vm.$route.query.type),
              })
            })
            .catch((err) => {
              this.$swal({
                type: 'error',
                title: 'Oops...',
                text: err.response.data.message,
              })
            })
        }
      })
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
      this.dialogLoading = true
      this.$axios
        .get(`/api/documents/print`, {
          params: {
            id: vm.form.id,
          },
          responseType: 'arraybuffer',
        })
        .then((response) => {
          this.dialogLoading = false
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')

          link.href = url
          link.setAttribute('download', vm.form.document_number + '.pdf') // set custom file name
          document.body.appendChild(link)

          link.click() // force download file without open new tab
        })
        .catch((err) => {
          this.dialogLoading = false
          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })
        })
    },

    actionSave(action) {
      this.actionOnSave = action
      const docId = this.$route.query.document
      const url = docId === '0' ? this.url : this.url + '/' + docId
      const method = docId === '0' ? 'post' : 'patch'
      const data = this.$refs.formDocument.returnData(docId)
      const vm = this
      this.loading = true
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
          this.loading = false
        })
    },
  },
}
</script>

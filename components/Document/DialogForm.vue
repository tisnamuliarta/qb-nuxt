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
      <v-btn text small dark>More</v-btn>

      <v-spacer />
      <v-btn small color="green darken-1" class="mr-3" dark @click="close">
        Save and send

        <v-menu transition="slide-y-transition" bottom>
          <template #activator="{ on, attrs }">
            <v-btn dark icon v-bind="attrs" v-on="on">
              <v-icon>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(value, i) in items" :key="i">
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
    dialogTitle: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      title: this.dialogTitle,
      items: [
        { text: 'Save and new', action: 'edit' },
        { text: 'Save and close', action: 'delete' },
      ],
      breadcrumb: [],
      form: {},
      audits: {},
      defaultItem: {},
      dialogLoading: false,
      showLoading: false,
      dialog: true,
      itemAction: [],
      actionName: 'Save',
    }
  },

  activated() {
    this.$refs.dialogForm.openDialog()
    this.getDataFromApi()
  },

  methods: {
    close() {
      this.$router.back()
      this.$emit('getDataFromApi')
    },
    checkDisable() {
      return this.form.status === 'closed' || this.form.status === 'cancel'
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
              document: res.data.data.id,
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
      this.showLoading = true
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
          this.audits = res.data.data.audits
          if (res.data.data.count > 0) {
            form = res.data.data.rows
            this.actionName = 'Update'
          } else {
            form = res.data.data.form
            this.actionName = 'Save'
          }

          this.form = Object.assign({}, form)
          this.defaultItem = Object.assign({}, form)

          this.title = this.dialogTitle + ' #' + this.form.document_number
          this.$refs.dialogForm.setTitle(this.title)

          setTimeout(() => {
            this.$refs.formDocument.setData(this.form)
          }, 30)
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
          this.showLoading = false
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

    store() {
      const method = this.$route.query.document === '0' ? 'post' : 'patch'
      const url =
        this.$route.query.document === '0'
          ? this.url
          : this.url + '/' + this.$route.query.document;

      const data = this.$refs.formDocument.returnData(this.$route.query.document)

      this.dialogLoading = true
      this.$axios({ method, url, data })
        .then((res) => {
          this.$router.push({
            path: '/dashboard/documents/form',
            query: {
              document: res.data.data.id,
              type: res.data.data.type,
            },
          })
          this.$nuxt.$emit('snackbar', res.data.message)
          setTimeout(() => {
            this.getDataFromApi()
          }, 50)
        })
        .catch((err) => {
          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })
        })
        .finally((res) => {
          this.dialogLoading = false
        })
    },
  },
}
</script>
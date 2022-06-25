<template>
  <div>
    <dropzone
      id="attachment"
      ref="attachment"
      :options="options"
      :destroy-dropzone="true"
      @vdropzone-sending="
        (file, xhr, formData) => sendingParams(file, xhr, formData)
      "
      @vdropzone-success="(file, response) => reloadAttachment(file, response)"
      @vdropzone-error="(file, message, xhr) => handleError(file, message, xhr)"
    ></dropzone>
  </div>
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'

export default {
  name: 'FieldUpload',

  components: { Dropzone },

  props: {
    formType: {
      type: String,
      default: '',
    },
    formData: {
      type: Object,
      default() {
        return {}
      },
    },
  },

  data() {
    return {
      showLoadingAttachment: false,
      form: this.formData,
      options: {
        url:
          window.location.protocol +
          '//' +
          window.location.hostname +
          process.env.baseApi +
          '/api/document-files',
        timeout: 9000000000,
        addRemoveLinks: true,
        withCredentials: true,
        thumbnailWidth: 50,
        thumbnailHeight: 50,
        acceptedFiles: 'image/*',
        dictDefaultMessage:
          "<span class='mdi mdi-cloud-upload'></span> UPLOAD HERE",
        headers: {
          Authorization: this.$auth.$storage.getLocalStorage('_token.local'),
        },
      },
    }
  },

  methods: {
    sendingParams(file, xhr, formData) {
      const tempId = this.form.id !== 0 ? this.form.id : this.form.temp_id
      formData.append('temp_id', tempId)
      formData.append('type', this.formType)
    },

    handleError(file, message, xhr) {
      this.$swal({
        type: 'error',
        title: 'Error...',
        text: message.message,
      })
    },

    reloadAttachment(file, response) {
      if (response.errors) {
        this.$swal({
          type: 'error',
          title: 'Oops...',
          text: response.message,
        })
      } else {
        setTimeout(() => {
          this.getFiles()
        }, 300)

        this.$swal({
          type: 'success',
          title: 'Success...',
          text: 'Attachment uploaded!',
        })
      }
    },

    getFiles() {
      this.showLoadingAttachment = true
      const vm = this
      const tempId = this.form.id ? this.form.id : this.form.temp_id

      this.$axios
        .get(vm.options.url, {
          params: {
            type: this.formType,
            temp_id: tempId,
          },
        })
        .then((res) => {
          this.$emit('eventGetFiles', {
            total: res.data.data.total,
            row: res.data.data.rows,
          })
          vm.showLoadingAttachment = false
        })
        .catch((err) => {
          this.showLoadingAttachment = false
          this.$swal({
            type: 'error',
            title: 'Error...',
            text: err.response.message,
          })
        })
    },

    deleteFile(item) {
      const vm = this
      this.$swal({
        title: 'Are you sure?',
        text: 'The file will be permanently deleted',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.value) {
          this.$axios
            .delete(vm.options.url, {
              params: {
                id: item.id,
              },
            })
            .then((res) => {
              this.$swal({
                type: 'success',
                title: 'Success...',
                text: 'Attachment Deleted!',
              })
              vm.getFiles()
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
  },
}
</script>

<template>
  <div>
    <DialogForm
      ref="dialogForm"
      max-width="600px"
      :dialog-title="formTitle"
      button-title="Save"
    >
      <template #content>
        <v-form>
          <v-container>
            <v-row dense>
              <v-col cols="12" md="4">
                <v-autocomplete
                  v-model="form.resource_type"
                  :items="['machine', 'labor', 'other']"
                  label="Type"
                  outlined
                  persistent-hint
                  dense
                  hide-details="auto"
                >
                </v-autocomplete>
              </v-col>

              <v-col cols="12" md="8">
                <v-text-field
                  v-model="form.name"
                  label="Name"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="form.code"
                  label="Code"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="form.status"
                  :items="['active', 'inactive']"
                  label="Status"
                  outlined
                  persistent-hint
                  dense
                  hide-details="auto"
                >
                </v-autocomplete>
              </v-col>

              <v-col v-if="form.resource_type === 'labor'" cols="12">
                <v-autocomplete
                  v-model="form.employee_id"
                  :items="itemEmployee"
                  label="Employee"
                  item-text="first_name"
                  item-value="id"
                  outlined
                  persistent-hint
                  dense
                  hide-details="auto"
                >
                </v-autocomplete>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="form.unit"
                  :items="itemUnit"
                  label="UoM"
                  item-text="name"
                  item-value="name"
                  outlined
                  persistent-hint
                  dense
                  hide-details="auto"
                >
                </v-autocomplete>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="form.std_cost_account_1"
                  :items="itemAccounts"
                  label="Item Cost Account"
                  item-text="name"
                  item-value="id"
                  outlined
                  persistent-hint
                  dense
                  hide-details="auto"
                >
                </v-autocomplete>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="form.warehouse_id"
                  :items="itemWarehouse"
                  label="Warehouse"
                  item-text="name"
                  item-value="id"
                  outlined
                  persistent-hint
                  dense
                  hide-details="auto"
                >
                </v-autocomplete>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="form.standard_cost"
                  type="number"
                  label="Cost"
                  class="text-money"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.internal_capacity"
                  type="number"
                  label="Internal Capacity"
                  class="text-money"
                  readonly
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.committed_capacity"
                  type="number"
                  label="Committed Capacity"
                  class="text-money"
                  readonly
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.consumed_capacity"
                  type="number"
                  label="Consumed Capacity"
                  class="text-money"
                  readonly
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.available"
                  type="number"
                  label="Available Capacity"
                  class="text-money"
                  readonly
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </template>
      <template #saveData>
        <v-btn
          color="green darken-1"
          dark
          small
          :loading="submitLoad"
          @click="save()"
        >
          {{ buttonTitle }}
        </v-btn>
      </template>
    </DialogForm>

    <LazyInventoryFormMaster
      ref="formMaster"
      @returnData="returnData"
    ></LazyInventoryFormMaster>
  </div>
</template>

<script>
// import Dropzone from 'nuxt-dropzone'
// import 'nuxt-dropzone/dropzone.css'

export default {
  name: 'FormProduct',

  // components: { Dropzone },

  props: {
    formTitle: {
      type: String,
      default: '',
    },
    buttonTitle: {
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
      logo: '',
      dialog: false,
      tab: null,
      submitLoad: false,
      form: this.formData,
      selectedItem: 1,
      itemCategory: [],
      itemUnit: [],
      itemEmployee: [],
      itemPriceList: [],
      itemAccounts: [],
      itemWarehouse: [],
      items: [
        { tab: 'Sales Data', href: '#tab-1' },
        { tab: 'Purchase Data', href: '#tab-2' },
        { tab: 'Inventory Data', href: '#tab-3' },
        { tab: 'Production Data', href: '#tab-4' },
      ],
      itemGroup: [
        {
          id: 1,
          name: 'Inventory',
          desc: this.$t(
            'Product you buy and/or sell and you track quantities of'
          ),
        },
        {
          id: 2,
          name: 'Non inventory',
          desc: this.$t(
            "Product you buy and/or sell but you don't need to (or can't) track quantities of, for example nuts and bolts used in an installation"
          ),
        },
        {
          id: 3,
          name: 'Service',
          desc: this.$t(
            'Service that you provide to customers, for example, landscaping or tax preparation services'
          ),
        },
        // {
        //   id: 4,
        //   name: 'Bundle',
        //   desc: this.$t(
        //     'A collection of products and/or services that you sell together, for example a gift basket of fruit, cheese, and whine'
        //   ),
        // },
      ],
      menu: '',
      itemTax: [],
      itemContact: [],
      images: [],
      statusProcessing: 'insert',
      valueWhenIsEmpty: null,
      temp_image: null,
      url: '/api/inventory/resource',
      moneyOptions: {
        suffix: '',
        length: 11,
        precision: 2,
      },
      options: {
        url: '/api/document-files',
        timeout: 9000000000,
        addRemoveLinks: true,
        withCredentials: true,
        thumbnailWidth: 50,
        thumbnailHeight: 50,
        acceptedFiles: 'image/*',
        dictDefaultMessage:
          "<span class='mdi mdi-cloud-upload'></span> UPLOAD HERE",
        // headers: {
        //   'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN'),
        // },
      },
    }
  },

  // activated() {
  //   this.loadData()
  // },

  methods: {
    async loadData() {
      try {
        const resItemCategory = await this.$axios.get(
          `/api/inventory/item-category`
        )

        const resItemUnit = await this.$axios.get(`/api/inventory/item-units`)
        const resAccount = await this.$axios.get(`/api/financial/accounts`, {
          params: {
            type: 'All',
          },
        })

        const resContact = await this.$axios.get(`/api/bp/contacts`)
        const resWarehouse = await this.$axios.get(`/api/inventory/warehouse`)
        const resEmployee = await this.$axios.get(`/api/payroll/employees`)

        this.itemCategory = resItemCategory.data.data
        this.itemUnit = resItemUnit.data.data
        this.itemAccounts = resAccount.data.data
        this.itemContact = resContact.data.data
        this.itemWarehouse = resWarehouse.data.data
        this.itemEmployee = resEmployee.data.data
      } catch (err) {
        this.$swal({
          type: 'error',
          title: 'Error',
          text: err.response.data.error,
        })
      }
    },

    newData(form) {
      this.$refs.dialogForm.openDialog()
      this.statusProcessing = 'insert'
      this.form = Object.assign({}, form)
      this.getFiles()
      this.loadData()
    },

    editItem(item, url) {
      const dataForm = item
      // dataForm.category = JSON.parse(dataForm.category)
      this.form = Object.assign({}, dataForm)
      this.statusProcessing = 'update'
      this.$refs.dialogForm.openDialog()
      this.getFiles()
      this.loadData()
    },

    sendingParams(file, xhr, formData) {
      const tempId = this.form.id ? this.form.id : this.form.temp_id
      formData.append('temp_id', tempId)
      formData.append('type', 'item')
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
        this.$emit('eventCountAttachment', {
          total: response.data.count,
          row: this.row,
        })

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
        .get(this.options.url, {
          params: {
            type: 'item',
            temp_id: tempId,
          },
        })
        .then((res) => {
          vm.images = res.data.data
          vm.total = res.data.total
          vm.showLoadingAttachment = false
        })
        .catch((err) => {
          this.showLoadingAttachment = false
          this.$swal({
            type: 'error',
            title: 'Oops...',
            text: err.response.message,
          })
        })
    },

    returnData(data) {
      if (data.type === 'Item Category') {
        this.itemCategory = data.item
      } else if (data.type === 'Item Unit') {
        this.itemUnit = data.item
      }
    },

    close() {
      this.$refs.dialogForm.closeDialog()
      this.statusProcessing = 'insert'
      setTimeout(() => {
        this.form = Object.assign({}, this.defaultItem)
      }, 300)
    },

    save() {
      const vm = this
      const status = this.statusProcessing

      if (status === 'insert') {
        this.store('post', this.url, this.form)
        vm.submitLoad = false
      } else if (status === 'update') {
        this.store('put', this.url + '/' + this.form.id, this.form)
        vm.submitLoad = false
      }
    },

    store(method, url, data) {
      const vm = this
      vm.submitLoad = true
      this.$axios({ method, url, data })
        .then((res) => {
          this.$refs.dialogForm.closeDialog()
          this.$emit('getDataFromApi')
        })
        .catch((err) => {
          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })

          vm.submitLoad = false
        })
    },
  },
}
</script>

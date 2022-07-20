<template>
  <div>
    <DialogForm
      ref="dialogForm"
      max-width="500px"
      :dialog-title="formTitle"
      button-title="Save"
    >
      <template #content>
        <v-form class="pt-2">
          <v-container>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="form.price_list_name"
                  label="Name"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="form.base_id"
                  label="Base Price List"
                  :items="itemPriceList"
                  item-value="id"
                  item-text="price_list_name"
                  outlined
                  dense
                  hide-details="auto"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="form.factor"
                  label="Factor"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="12">
                <v-autocomplete
                  v-model="form.rounding_method"
                  :items="['Closest', 'Up', 'Down']"
                  label="Rounding Method"
                  outlined
                  dense
                  hide-details="auto"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="12">
                <v-autocomplete
                  v-model="form.enabled"
                  :items="[true, false]"
                  label="Active"
                  outlined
                  dense
                  hide-details="auto"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="12">
                <v-text-field
                  v-model="form.start_date"
                  label="Valid From"
                  persistent-hint
                  outlined
                  dense
                  hide-details="auto"
                  type="date"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="12">
                <v-text-field
                  v-model="form.end_date"
                  label="Valid To"
                  persistent-hint
                  outlined
                  dense
                  hide-details="auto"
                  type="date"
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
  </div>
</template>

<script>
export default {
  name: 'FormAccount',

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
      dialog: false,
      submitLoad: false,
      form: this.formData,
      url: '/api/inventory/price-list',
      itemCategory: [],
      itemBank: [],
      itemPriceList: [],
      itemTax: [],
      statusProcessing: 'insert',
    }
  },

  // activated() {
  //   this.loadData()
  // },

  methods: {
    async loadData() {
      try {
        const resPriceList = await this.$axios.get(`/api/inventory/price-list`)
        this.itemPriceList = resPriceList.data.data
      } catch (err) {
        this.$swal({
          type: 'error',
          title: 'Error',
          text: err.response.data.error,
        })
      }
    },
    newData(item, categoryType) {
      this.$refs.dialogForm.openDialog()
      this.statusProcessing = 'insert'
      this.form = Object.assign({}, item)
      this.itemCategory = categoryType
      this.loadData()
    },

    editItem(item, categoryType) {
      this.form = Object.assign({}, item)
      this.statusProcessing = 'update'
      this.$refs.dialogForm.openDialog()
      this.itemCategory = categoryType
      this.loadData()
    },

    returnData(data) {
      if (data.type === 'Banks') {
        this.itemBank = data.item
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

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
                  v-model="form.name"
                  label="Name"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.type"
                  label="Type"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="12">
              <v-autocomplete
                v-model="form.inventory_account_id"
                :items="itemAccounts"
                item-text="name"
                item-value="id"
                label="Inventory Account"
                outlined
                dense
                hide-details="auto"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="12">
              <v-autocomplete
                v-model="form.cogs_account_id"
                :items="itemAccounts"
                item-text="name"
                item-value="id"
                label="COGS Account"
                outlined
                dense
                hide-details="auto"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="12">
              <v-autocomplete
                v-model="form.allocation_account_id"
                :items="itemAccounts"
                item-text="name"
                item-value="id"
                label="Allocation Account"
                outlined
                dense
                hide-details="auto"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="12">
              <v-autocomplete
                v-model="form.price_diff_account_id"
                :items="itemAccounts"
                item-text="name"
                item-value="id"
                label="Price Diff Account"
                outlined
                dense
                hide-details="auto"
              ></v-autocomplete>
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
    url: {
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
      itemCategory: [],
      itemBank: [],
      itemTax: [],
      itemAccounts: [],
      statusProcessing: 'insert',
    }
  },

  activated() {
    this.loadData()
  },

  methods: {
    async loadData() {
      try {
        const resAccount = await this.$axios.get(`/api/financial/accounts`, {
          params: {
            type: 'All',
          },
        })
        this.itemAccounts = resAccount.data.data

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
    },

    editItem(item, categoryType) {
      this.form = Object.assign({}, item)
      this.statusProcessing = 'update'
      this.$refs.dialogForm.openDialog()
      this.itemCategory = categoryType
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
      this.$axios({method, url, data})
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

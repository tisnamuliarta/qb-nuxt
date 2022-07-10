<template>
  <div>
    <DialogForm
      ref="dialogForm"
      max-width="600px"
      :dialog-title="formTitle"
      button-title="Save"
    >
      <template #content>
        <v-form class="pt-2">
          <v-container>
            <v-row dense>
              <v-col cols="12" md="7">
                <v-row dense>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="form.account_type"
                      :items="itemAccountType"
                      label="Account Type"
                      outlined
                      persistent-hint
                      dense
                      hide-details="auto"
                      @change="changeAccountType"
                    >
                    </v-autocomplete>
                  </v-col>

                  <v-col cols="12">
                    <v-autocomplete
                      v-model="form.category_id"
                      :items="itemCategory"
                      label="Category"
                      item-text="name"
                      item-value="id"
                      outlined
                      persistent-hint
                      dense
                      hide-details="auto"
                      @change="changeCategory"
                    >
                    </v-autocomplete>
                  </v-col>

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
                      v-model="form.code"
                      label="Number"
                      outlined
                      dense
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-textarea
                      v-model="form.description"
                      rows="3"
                      label="Description"
                      outlined
                      dense
                      hide-details="auto"
                    ></v-textarea>
                  </v-col>

                  <v-col cols="12">
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="form.opening_balance_date"
                          label="Opening Balance Date"
                          prepend-icon="mdi-calendar"
                          readonly
                          persistent-hint
                          outlined
                          dense
                          hide-details="auto"
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>

                      <v-date-picker
                        v-model="form.opening_balance_date"
                        no-title
                        @input="menu = false"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="form.opening_balance_amount"
                      rows="3"
                      label="Opening Ballance"
                      outlined
                      dense
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" md="5" class="bg-grey lighten-3">
                <span v-text="categoryDesc"></span>
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
      menu: '',
      dialog: false,
      submitLoad: false,
      form: this.formData,
      itemCategory: [],
      itemAllCurrency: [],
      itemCurrency: [],
      itemAccountType: [],
      itemBank: [],
      itemTax: [],
      categoryDesc: '',
      statusProcessing: 'insert',
    }
  },

  mounted() {
    this.getCategory()
    this.getCurrency()
  },

  methods: {
    newData(form) {
      this.$refs.dialogForm.openDialog()
      this.statusProcessing = 'insert'
      this.form = Object.assign({}, form)
      this.itemAccountType = form.account_type_list
      this.form.account_type = this.itemAccountType[0]
      this.changeAccountType()
    },

    editItem(item, form) {
      this.form = Object.assign({}, item)
      this.statusProcessing = 'update'
      this.$refs.dialogForm.openDialog()
      this.itemAccountType = form.account_type_list
      this.changeAccountType()
    },

    changeAccountType() {
      this.itemCategory = this.itemAllCurrency.filter(this.filterTransType)
      if (this.statusProcessing === 'insert') {
        this.form.category_id = this.itemCategory[0].id
        this.categoryDesc = this.itemCategory[0].descriptions
        this.form.name = this.itemCategory[0].name
      }
    },

    filterTransType(item) {
      if (item.category_type === this.form.account_type) {
        return true
      }
    },

    changeCategory() {
      const categoryDesc = this.itemAllCurrency.filter(this.filterItemDesc)
      this.categoryDesc = categoryDesc[0].descriptions
      this.form.name = categoryDesc[0].name
    },

    filterItemDesc(item) {
      if (item.id === this.form.category_id) {
        return true
      }
    },

    getCategory() {
      this.$axios
        .get(`/api/financial/account-category`, {
          params: {
            type: 'Account Category',
          },
        })
        .then((res) => {
          this.itemAllCurrency = res.data.data
        })
        .catch((err) => {
          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })
        })
    },

    getCurrency() {
      this.$axios
        .get(`/api/financial/currency`, {
          params: {
            type: 'Account Category',
          },
        })
        .then((res) => {
          this.itemCurrency = res.data.data.rows
        })
        .catch((err) => {
          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })
        })
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
      const form = this.form
      const status = this.statusProcessing

      if (status === 'insert') {
        this.store('post', this.url, form)
      } else if (status === 'update') {
        this.store('put', this.url + '/' + this.form.id, form)
      }
      vm.submitLoad = false
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

<style scoped>
.bg-grey {
  background-color: #eee;
}
</style>

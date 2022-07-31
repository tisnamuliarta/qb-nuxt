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
                  v-model="form.item_group_id"
                  :items="itemGroup"
                  label="Type"
                  item-text="name"
                  item-value="id"
                  outlined
                  persistent-hint
                  dense
                  hide-details="auto"
                >
                  <template #item="data">
                    <v-list-item-content>
                      <v-list-item-title
                        class="font-weight-bold"
                        v-text="data.item.name"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        v-text="data.item.desc"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
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

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.code"
                  label="Code"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
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
                >
                </v-autocomplete>
              </v-col>

              <v-col cols="12" md="4">
                <v-autocomplete
                  v-model="form.unit"
                  :items="itemUnit"
                  label="Unit"
                  item-text="name"
                  item-value="name"
                  outlined
                  persistent-hint
                  dense
                  hide-details="auto"
                >
                </v-autocomplete>
              </v-col>

              <v-col cols="12" md="4">
                <v-autocomplete
                  v-model="form.price_list_id"
                  :items="itemPriceList"
                  label="Price List"
                  item-text="price_list_name"
                  item-value="id"
                  outlined
                  persistent-hint
                  dense
                  hide-details="auto"
                >
                </v-autocomplete>
              </v-col>

              <!-- <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.onhand"
                  type="number"
                  :value-when-is-empty="valueWhenIsEmpty"
                  :options="moneyOptions"
                  label="Initial quantity onhand"
                  class="text-money"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col> -->

              <!-- <v-col cols="12" md="4">
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
                      v-model="form.onhand_date"
                      label="As of date"
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
                    v-model="form.onhand_date"
                    no-title
                    @input="menu = false"
                  >
                  </v-date-picker>
                </v-menu>
              </v-col> -->

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.commision_rate"
                  type="number"
                  :value-when-is-empty="valueWhenIsEmpty"
                  :options="moneyOptions"
                  label="Commission Rate"
                  class="text-money"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-card flat>
                  <v-tabs v-model="tab">
                    <v-tab
                      v-for="item in items"
                      :key="item.tab"
                      :href="item.href"
                    >
                      {{ item.tab }}
                    </v-tab>
                  </v-tabs>

                  <v-tabs-items v-model="tab">
                    <v-tab-item value="tab-1">
                      <v-row dense class="mt-2">
                        <v-col cols="12">
                          <v-text-field
                            v-model="form.description"
                            label="Descriptions"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model="form.sale_price"
                            type="number"
                            :value-when-is-empty="valueWhenIsEmpty"
                            :options="moneyOptions"
                            label="Sales Price"
                            class="text-money"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="9">
                          <v-autocomplete
                            v-model="form.revenue_account_id"
                            :items="itemAccounts"
                            item-text="name"
                            item-value="id"
                            label="Income Account"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-autocomplete>
                        </v-col>

                        <v-col cols="12" md="3">
                          <v-autocomplete
                            v-model="form.sell_tax_id"
                            :items="itemTax"
                            item-text="name"
                            item-value="id"
                            label="Sales Tax"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-autocomplete>
                        </v-col>
                      </v-row>
                    </v-tab-item>

                    <v-tab-item value="tab-2">
                      <v-row dense class="mt-2">
                        <v-col cols="12">
                          <v-text-field
                            v-model="form.purchase_description"
                            label="Descriptions"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model="form.purchase_price"
                            type="number"
                            :value-when-is-empty="valueWhenIsEmpty"
                            :options="moneyOptions"
                            class="text-money"
                            label="Cost"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="9">
                          <v-autocomplete
                            v-model="form.expense_account_id"
                            :items="itemAccounts"
                            item-text="name"
                            item-value="id"
                            label="Expense Account"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-autocomplete>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-autocomplete
                            v-model="form.contact_id"
                            :items="itemContact"
                            item-text="name"
                            item-value="id"
                            label="Prefered Vendor"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-autocomplete>
                        </v-col>
                      </v-row>
                    </v-tab-item>

                    <v-tab-item value="tab-3">
                      <v-row dense class="mt-2">
                        <!-- <v-col cols="12" md="4">
                          <v-text-field
                            v-model="form.reorder_point"
                            type="number"
                            :value-when-is-empty="valueWhenIsEmpty"
                            :options="moneyOptions"
                            label="Reorder point"
                            class="text-money"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col> -->

                        <v-col cols="12" md="12">
                          <v-autocomplete
                            v-model="form.inventory_account"
                            :items="itemAccounts"
                            item-text="name"
                            item-value="id"
                            label="Default Inventory Account"
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

                        <v-col cols="12" md="12">
                          <v-simple-table dense>
                            <template #default>
                              <thead>
                                <tr>
                                  <th class="text-left">
                                    Warehouse
                                  </th>
                                  <th class="text-center">
                                    On Hand
                                  </th>
                                  <th class="text-center">
                                    Ordered
                                  </th>
                                  <th class="text-center">
                                    Committed
                                  </th>
                                  <th class="text-center">
                                    Available
                                  </th>
                                  <th class="text-center">
                                    Cost
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  v-for="item in form.item_warehouse"
                                  :key="item.whs_name"
                                >
                                  <td>{{ item.whs_name }}</td>
                                  <td class="text-right">{{ item.on_hand_qty }}</td>
                                  <td class="text-right">{{ item.ordered_qty }}</td>
                                  <td class="text-right">{{ item.committed_qty }}</td>
                                  <td class="text-right">{{ item.available_qty }}</td>
                                  <td class="text-right">{{ item.item_cost }}</td>
                                </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                        </v-col>

                        <!-- <v-col cols="12" md="12">
                          <v-autocomplete
                            v-model="form.warehouse_id"
                            :items="itemWarehouse"
                            item-text="name"
                            item-value="id"
                            label="Warehouse"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-autocomplete>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-row dense>
                            <v-col cols="12" sm="3">
                              <v-text-field
                                v-model="form.on_hand_qty"
                                label="In Stock"
                                outlined
                                readonly
                                dense
                                hide-details="auto"
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="3">
                              <v-text-field
                                v-model="form.ordered_qty"
                                label="Ordered"
                                outlined
                                readonly
                                dense
                                hide-details="auto"
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="3">
                              <v-text-field
                                v-model="form.committed_qty"
                                label="Committed"
                                outlined
                                readonly
                                dense
                                hide-details="auto"
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="3">
                              <v-text-field
                                v-model="form.available_qty"
                                label="Available"
                                outlined
                                readonly
                                dense
                                hide-details="auto"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-col> -->
                      </v-row>
                    </v-tab-item>

                    <v-tab-item value="tab-4">
                      <v-row dense class="mt-2">
                        <v-col cols="12" md="12">
                          <v-autocomplete
                            v-model="form.issue_method"
                            :items="['backflush', 'manual']"
                            label="Issue Method"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-autocomplete>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-autocomplete
                            v-model="form.material_type"
                            :items="[
                              'production',
                              'sales',
                              'assembly',
                              'template',
                            ]"
                            label="Material Type"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-autocomplete>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-autocomplete
                            v-model="form.valuation_method"
                            :items="['moving average']"
                            label="Valuation Method"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-autocomplete>
                        </v-col>
                      </v-row>
                    </v-tab-item>
                  </v-tabs-items>
                </v-card>
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
      url: '/api/inventory/items',
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
        const resVat = await this.$axios.get(`/api/financial/taxes`)
        const resContact = await this.$axios.get(`/api/bp/contacts`)
        const resWarehouse = await this.$axios.get(`/api/inventory/warehouse`)
        const resPriceList = await this.$axios.get(`/api/inventory/price-list`)

        this.itemCategory = resItemCategory.data.data
        this.itemUnit = resItemUnit.data.data
        this.itemAccounts = resAccount.data.data
        this.itemTax = resVat.data.data
        this.itemContact = resContact.data.data
        this.itemWarehouse = resWarehouse.data.data
        this.itemPriceList = resPriceList.data.data
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

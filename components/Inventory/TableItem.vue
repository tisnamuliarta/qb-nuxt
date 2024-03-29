<template>
  <v-layout>
    <v-flex sm12>
      <div class="mt-0">
        <v-skeleton-loader v-show="loading" type="table" />
        <v-data-table
          v-show="!loading"
          v-model="selected"
          :mobile-breakpoint="0"
          :headers="headers"
          :items="allData"
          :items-per-page="20"
          :options.sync="options"
          :server-items-length="totalData"
          :loading="loading"
          class="elevation-0"
          item-key="id"
          calculate-widths
          fixed-header
          :height="viewData ? '60vh' : '70vh'"
          show-select
          dense
          :footer-props="{ 'items-per-page-options': [20, 50, 100, -1] }"
        >
          <template #top>
            <div v-if="!viewData" class="pl-4 pt-2">
              <span class="font-weight-medium text-h6">{{
                $t('Items Master Data')
              }}</span>
            </div>

            <LazyMainToolbar
              :document-status="documentStatus"
              :search-status="searchStatus"
              :item-search="itemSearch"
              :search-item="searchItem"
              :search="search"
              :show-add="showAdd"
              title="Items"
              show-new-data
              :new-data-text="$t('New Item')"
              show-batch-action
              @emitData="emitData"
              @newData="newData"
              @getDataFromApi="getDataFromApi"
            />
          </template>
          <template #[`item.ACTIONS`]="{ item }">
            <v-btn
              color="secondary"
              class="font-weight-bold text-right mr-0"
              text
              small
              @click="actions(itemAction, item)"
            >
              {{ itemText }}
            </v-btn>
            <v-menu transition="slide-y-transition" bottom>
              <template #activator="{ on, attrs }">
                <v-btn color="black" dark icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(value, i) in items"
                  :key="i"
                  @click="actions(value.action, item)"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ value.text }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>

          <template #[`item.sale_price`]="{ item }">
            {{ formatPrice(item.sale_price) }}
          </template>

          <template #[`item.purchase_price`]="{ item }">
            {{ formatPrice(item.purchase_price) }}
          </template>

          <template #[`item.last_buy_price`]="{ item }">
            {{ formatPrice(item.last_buy_price) }}
          </template>

          <template #[`item.average_price`]="{ item }">
            {{ formatPrice(item.average_price) }}
          </template>

          <template #[`item.minimum_stock`]="{ item }">
            {{ formatPrice(item.minimum_stock) }}
          </template>
          <template #[`item.available_qty`]="{ item }">
            {{ checkAvailable(item.item_warehouse) }}
          </template>
          <template #[`item.commision_rate`]="{ item }">
            {{
              $auth.user.entity.currency.currency_symbol +
              ' ' +
              formatPrice(item.commision_rate)
            }}
          </template>
        </v-data-table>
      </div>
    </v-flex>

    <LazyInventoryFormItem
      ref="formData"
      :form-data="form"
      :form-title="formTitle"
      :button-title="buttonTitle"
      @getDataFromApi="getDataFromApi"
    ></LazyInventoryFormItem>
  </v-layout>
</template>

<script>
export default {
  name: 'TableItem',

  props: {
    viewData: {
      type: Boolean,
      default: false,
    },
    showAddBtn: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      selected: [],
      totalData: 0,
      editedIndex: -1,
      loading: true,
      allData: [],
      showAdd: this.showAddBtn,
      documentStatus: [],
      itemSearch: [],
      searchStatus: '',
      searchItem: '',
      search: '',
      whs: '',
      url: '/api/inventory/items',
      form: {},
      defaultItem: {},
      options: {},
      headers: [],
      items: [
        { text: 'Edit', action: 'edit' },
        { text: 'Delete', action: 'delete' },
      ],
      itemText: '',
      itemAction: '',
      dateFrom: null,
      dateTo: null,
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? this.$t('New Item')
        : this.$t('Edit Item')
    },
    buttonTitle() {
      return this.editedIndex === -1 ? this.$t('Save') : this.$t('Update')
    },
  },

  watch: {
    options: {
      handler() {
        this.getDataFromApi()
      },
      deep: true,
    },
  },

  activated() {
    this.getDataFromApi()
  },

  mounted() {
    this.mappingHeader()
    this.itemText = this.items[0].text
    this.itemAction = this.items[0].action
  },

  methods: {
    formatPrice(value) {
      const val = (value / 1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },

    checkAvailable(available) {
      const vm = this
      let availableQty = 0
      available.forEach((element) => {
        // console.log(element)
        if (typeof vm.whs === 'string') {
          if (element.whs_name === vm.whs) {
            availableQty = element.available_qty
          }
        } else if (element.warehouse_id === vm.whs) {
          availableQty = element.available_qty
        }
      })
      return availableQty
    },

    setEmptyToSelected(whs) {
      this.whs = whs
      this.getDataFromApi()
      this.selected = []
    },

    newData() {
      this.editedIndex = -1
      this.$refs.formData.newData(this.form)
    },

    parseJson(category) {
      if (Array.isArray(JSON.parse(category))) {
        return JSON.parse(category).toString()
      } else {
        return category
      }
    },

    actions(action, item) {
      if (action === 'edit') {
        this.editItem(item)
      } else {
        this.deleteItem(item)
      }
    },

    deleteItem(item) {
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
            .delete(this.url + '/' + item.id)
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

    editItem(item) {
      this.editedIndex = 1
      this.editedIndex = this.allData.indexOf(item)
      this.$refs.formData.editItem(item, this.url)
    },

    emitData(data) {
      this.documentStatus = data.documentStatus
      this.itemSearch = data.itemSearch
      this.searchStatus = data.searchStatus
      this.searchItem = data.searchItem
      this.search = data.search
      this.filters = data.filters
      this.dateFrom = data.dateFrom
      this.dateTo = data.dateTo
      this.getDataFromApi()
    },

    getDataFromApi() {
      this.loading = true
      const vm = this
      const status = {
        searchItem: vm.searchItem,
        documentStatus: vm.documentStatus,
        searchStatus: vm.searchStatus,
        search: vm.search,
        whs: vm.whs,
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
      }
      this.$axios
        .get(this.url, {
          params: {
            ...vm.options,
            ...status,
          },
        })
        .then((res) => {
          this.loading = false
          this.allData = res.data.data
          this.totalData = res.data.total
          this.itemSearch = res.data.filter
          this.form = Object.assign({}, res.data.form)
          this.defaultItem = Object.assign({}, res.data.form)
          // this.url = res.data.url
        })
        .catch((err) => {
          this.loading = false
          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })
        })
    },

    returnSelected() {
      return this.selected
    },

    mappingHeader() {
      if (this.viewData) {
        this.headers = [
          {
            text: 'Item Code',
            value: 'code',
            cellClass: 'disable-wrap',
            class: 'disable-wrap',
          },
          {
            text: 'Item Name',
            value: 'name',
            cellClass: 'disable-wrap',
            class: 'disable-wrap',
          },
          {
            text: 'Item Type',
            value: 'group_name',
            cellClass: 'disable-wrap',
            class: 'disable-wrap',
          },
          {
            text: 'Item Category',
            value: 'category.name',
            cellClass: 'disable-wrap',
            class: 'disable-wrap',
          },
          {
            text: 'Unit',
            value: 'unit',
            cellClass: 'disable-wrap',
            class: 'disable-wrap',
          },
          // {
          //   text: 'Warehouse',
          //   value: 'whs_name',
          //   cellClass: 'disable-wrap',
          //   class: 'disable-wrap',
          // },
          {
            text: 'Commission',
            value: 'commision_rate',
            align: 'right',
            sortable: false,
            filterable: false,
          },
          {
            text: 'Available Qty',
            value: 'available_qty',
            align: 'right',
            cellClass: 'disable-wrap',
            class: 'disable-wrap',
          },
        ]
      } else {
        this.headers = [
          { text: 'Item Code', value: 'code', width: '120px' },
          { text: 'Item Name', value: 'name', width: '150px' },
          {
            text: 'Item Type',
            value: 'group_name',
            cellClass: 'disable-wrap',
            class: 'disable-wrap',
          },
          {
            text: 'Item Category',
            value: 'category.name',
            sortable: false,
            filterable: false,
          },
          {
            text: 'Commission',
            value: 'commision_rate',
            align: 'right',
            sortable: false,
            filterable: false,
          },
          { text: 'Unit', value: 'unit', sortable: false, filterable: false },
          // {
          //   text: 'Buy Price',
          //   value: 'purchase_price',
          //   align: 'right',
          //   sortable: false,
          //   filterable: false,
          // },
          // {
          //   text: 'Sell Price',
          //   value: 'sale_price',
          //   align: 'right',
          //   sortable: false,
          //   filterable: false,
          // },
          {
            text: 'Action',
            value: 'ACTIONS',
            align: 'center',
            cellClass: 'disable-wrap',
            sortable: false,
            filterable: false,
          },
        ]
      }
    },
  },
}
</script>

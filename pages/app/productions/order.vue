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
                $t('Production Order')
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

          <template #[`item.main_account_amount`]="{ item }">
            {{
              $auth.user.entity.currency.currency_symbol +
              ' ' +
              formatPrice(item.main_account_amount)
            }}
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

          <template #[`item.status`]="{ item }">
            <v-chip label small dark :color="statusColor(item)">
              {{ item.status }}
            </v-chip>
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
  name: 'ItemMaster',

  data() {
    return {
      viewData: false,
      selected: [],
      totalData: 0,
      url: '',
      editedIndex: -1,
      loading: true,
      allData: [],
      showAdd: this.showAddBtn,
      documentStatus: [],
      itemSearch: [],
      searchStatus: '',
      searchItem: '',
      search: '',
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
    }
  },

  head() {
    return {
      title: this.$t('Production Order'),
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
    this.$nuxt.$emit('extensionSetting', {
      show: false,
      showBtn: false,
    })
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

    statusColor(item) {
      switch (item.status) {
        case 'planned':
          return 'blue darken-3'
        case 'partial':
          return 'orange'
        case 'released':
          return 'orange'
        case 'closed':
          return 'green'
        case 'overdue':
          return 'red'
        case 'cancel':
          return 'red'
      }
    },

    setEmptyToSelected() {
      this.selected = []
    },

    newData() {
      this.$router.push({
        path: '/app/form/production/order',
        query: {
          document: this.form.id ? this.form.id : 0,
        },
      })
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
        this.$auth.$storage.setState('basePath', this.$route.path)
        this.$router.push({
          path: '/app/form/production/order',
          query: {
            document: item.id ? item.id : 0,
          },
        })
      } else {
        this.deleteItem(item)
      }
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
      }
      this.$axios
        .get(`/api/production/order`, {
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
          this.url = res.data.url
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
            text: 'Transaction No',
            value: 'transaction_no',
            cellClass: 'disable-wrap',
            class: 'disable-wrap',
          },
          {
            text: 'Transaction Date',
            value: 'transaction_date',
            cellClass: 'disable-wrap',
            class: 'disable-wrap',
          },
          {
            text: 'Quantity',
            value: 'planned_qty',
            cellClass: 'disable-wrap',
            class: 'disable-wrap',
          },
          {
            text: 'Item Name',
            value: 'item_name',
            cellClass: 'disable-wrap',
            class: 'disable-wrap',
          },
          {
            text: 'Amount',
            value: 'main_account_amount',
            cellClass: 'disable-wrap',
            class: 'disable-wrap',
          },
        ]
      } else {
        this.headers = [
          {
            text: 'Transaction No',
            value: 'transaction_no',
            cellClass: 'disable-wrap',
          },
          {
            text: 'Transaction Date',
            value: 'transaction_date',
            cellClass: 'disable-wrap',
          },
          {
            text: 'Quantity',
            value: 'planned_qty',
            cellClass: 'disable-wrap',
            class: 'disable-wrap',
          },
          {
            text: 'Item Name',
            value: 'item_name',
            sortable: false,
            filterable: false,
            cellClass: 'disable-wrap',
          },
          // {
          //   text: 'Reorder Point',
          //   value: 'reorder_point',
          //   align: 'right',
          //   sortable: false,
          //   filterable: false,
          // },
          {
            text: 'Amount',
            value: 'main_account_amount',
            sortable: false,
            filterable: false,
            cellClass: 'disable-wrap',
          },
          // {
          //   text: 'Buy Price',
          //   value: 'purchase_price',
          //   align: 'right',
          //   sortable: false,
          //   filterable: false,
          // },
          {
            text: 'Status',
            value: 'status',
            sortable: false,
            filterable: false,
          },
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

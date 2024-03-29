<template>
  <v-layout>
    <v-flex sm12>
      <div class="mt-0">
        <v-data-table
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
                $t('Price List')
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
              :new-data-text="$t('New Price List')"
              show-batch-action
              @emitData="emitData"
              @newData="newData"
              @getDataFromApi="getDataFromApi"
            />
          </template>
          <template #[`item.id`]="{ item }">
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

          <template #[`item.enabled`]="{ item }">
            {{ (item.enabled === 1) ? 'Y' : 'N' }}
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
        </v-data-table>
      </div>
    </v-flex>

    <LazyInventoryFormPriceList
      ref="formData"
      :form-data="form"
      :form-title="formTitle"
      :button-title="buttonTitle"
      :url="url"
      @getDataFromApi="getDataFromApi"
    ></LazyInventoryFormPriceList>
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
      url: '/api/inventory/price-list',
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

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? this.$t('New')
        : this.$t('Edit')
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

    setEmptyToSelected() {
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
      this.headers = [
        {
          text: 'Name',
          value: 'price_list_name',
          cellClass: 'disable-wrap',
          class: 'disable-wrap',
        },
        {
          text: 'Base Price List',
          value: 'base_price.price_list_name',
          cellClass: 'disable-wrap',
          class: 'disable-wrap',
        },
        {
          text: 'Factor',
          value: 'factor',
          cellClass: 'disable-wrap',
          class: 'disable-wrap',
        },
        {
          text: 'Rounding Method',
          value: 'rounding_method',
          cellClass: 'disable-wrap',
          class: 'disable-wrap',
        },
        {
          text: 'Active',
          value: 'enabled',
          cellClass: 'disable-wrap',
          class: 'disable-wrap',
        },
        {
          text: 'Valid From',
          value: 'start_date',
          cellClass: 'disable-wrap',
          class: 'disable-wrap',
        },
        {
          text: 'Valid To',
          value: 'end_date',
          cellClass: 'disable-wrap',
          class: 'disable-wrap',
        },
        {
          text: 'Actions',
          value: 'id',
          align: 'center',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
      ]
    },
  },
}
</script>

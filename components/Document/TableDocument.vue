<template>
  <v-row>
    <v-col cols="12" class="mt-0">
      <v-data-table
        :mobile-breakpoint="0"
        :headers="headers"
        :items="allData"
        :items-per-page="20"
        :options.sync="options"
        :server-items-length="totalData"
        :loading="loading"
        show-select
        class="elevation-0"
        fixed-header
        height="70vh"
        dense
        :footer-props="{ 'items-per-page-options': [20, 50, 100, -1] }"
      >
        <template #top>
          <div class="pl-4 pt-2">
            <span class="font-weight-medium text-h6">{{ tableTitle }}</span>
          </div>
          <LazyMainToolbar
            :document-status="documentStatus"
            :search-status="searchStatus"
            :item-search="itemSearch"
            :search-item="searchItem"
            :search="search"
            :title="toolbarTitle"
            :button-title="btnTitle"
            :new-data-multiple-item="itemMultiple"
            show-batch-action
            show-filter
            show-new-data-multiple
            new-data-text="New Transactions"
            @emitData="emitData"
            @newData="newData"
            @getDataFromApi="getDataFromApi"
          />
        </template>
        <template #[`item.document_number`]="{ item }">
          <a @click="editItem(item)">
            <strong v-text="item.document_number"></strong>
          </a>
        </template>

        <template #[`item.transaction_no`]="{ item }">
          <a @click="editItem(item)">
            <strong v-text="item.transaction_no"></strong>
          </a>
        </template>

        <template #[`item.status`]="{ item }">
          <v-chip label small dark :color="statusColor(item)">
            {{ item.status }}
          </v-chip>
        </template>

        <template #[`item.balance_due`]="{ item }">
          {{ $formatter.formatPrice(item.balance_due) }}
        </template>

        <template #[`item.amount`]="{ item }">
          {{ $formatter.formatPrice(item.amount) }}
        </template>

        <template #[`item.main_account_amount`]="{ item }">
          {{ $formatter.formatPrice(item.main_account_amount) }}
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn
            v-if="item.status === 'open'"
            color="secondary"
            class="font-weight-bold text-right pr-0"
            text
            small
            @click="actions('edit', item)"
          >
            Edit
          </v-btn>
          <v-btn
            v-if="item.status === 'closed'"
            color="secondary"
            class="font-weight-bold text-right pr-0"
            text
            small
            @click="actions('view', item)"
          >
            View
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
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'TableDocument',

  props: {
    typeDocument: {
      type: String,
      default: '',
    },
    formUrl: {
      type: String,
      default: '',
    },
    tableTitle: {
      type: String,
      default: '',
    },
    btnTitle: {
      type: String,
      default: 'New Transaction',
    },
    tableUrl: {
      type: String,
      default: '/api/documents',
    },
    items: {
      type: Array,
      default() {
        return [
          { text: 'Closed', action: 'closed' },
          { text: 'Cancel', action: 'cancel' },
        ]
      },
    },
    headerTable: {
      type: Array,
      default() {
        return []
      },
    },
    itemMultiple: {
      type: Array,
      default() {
        return []
      },
    },
  },

  data() {
    return {
      totalData: 0,
      editedIndex: -1,
      loading: true,
      company: [],
      allData: [],
      documentStatus: [],
      itemSearch: [],
      toolbarTitle: '',
      searchStatus: '',
      searchItem: '',
      search: '',
      form: {},
      defaultItem: {},
      options: {},
      itemText: '',
      itemAction: '',
      headers: this.headerTable,
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? 'New ' + this.typeDocument
        : 'Edit ' + +this.typeDocument
    },
    buttonTitle() {
      return this.editedIndex === -1 ? 'Save' : 'Update'
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

  created() {
    this.mappingDocument()
  },

  mounted() {
    this.itemText = this.items[0].text
    this.itemAction = this.items[0].action
  },

  methods: {
    newData() {
      this.$router.push({
        path: this.formUrl,
        query: {
          document: this.form.id,
        },
      })
    },

    statusColor(item) {
      switch (item.status) {
        case 'open':
          return 'blue darken-3'
        case 'partial':
          return 'orange'
        case 'paid':
          return 'green'
        case 'closed':
          return 'green'
        case 'overdue':
          return 'red'
        case 'cancel':
          return 'red'
      }
    },

    editItem(item) {
      if (item.transaction_type) {
        this.$router.push({
          path: this.mappingAction(item.transaction_type),
          query: {
            document: item.id,
            type: item.transaction_type,
          },
        })
      } else {
        this.$router.push({
          path: this.mappingAction(item.type),
          query: {
            document: item.id,
            type: item.type,
          },
        })
      }
    },

    mappingAction(type) {
      switch (type) {
        case 'SQ':
          return '/app/form/sales/quote'
        case 'SO':
          return '/app/form/sales/order'
        case 'SD':
          return '/app/form/sales/delivery'
        case 'IN':
          return '/app/form/sales/invoice'
        case 'RC':
          return '/app/form/sales/payment'
        case 'CN':
          return '/app/form/sales/creditmemo'
        case 'SR':
          return '/app/form/sales/return'
        case 'PQ':
          return '/app/form/purchase/quote'
        case 'PO':
          return '/app/form/purchase/order'
        case 'GR':
          return '/app/form/purchase/receipt'
        case 'BL':
          return '/app/form/purchase/invoice'
        case 'PY':
          return '/app/form/purchase/payment'
        case 'DN':
          return '/app/form/purchase/creditmemo'
        case 'GN':
          return '/app/form/purchase/return'
      }
    },

    actions(action, item) {
      switch (action) {
        case 'edit':
        case 'view':
          this.editItem(item)
          break;

        case 'delete':
          this.deleteItem(item)
          break;

        case 'closed':
        case 'cancel':
          this.closeItem(item, action)
          break;
      }
    },

    deleteItem(item) {
      this.$axios
        .delete(`/api/master/permissions/` + item.menu_name)
        .then((res) => {
          this.getDataFromApi()
          this.$nuxt.$emit('getMenu', 'nice payload')
        })
    },

    closeItem(item, action) {
      this.$nuxt.$loading.start()
      this.$axios.put(this.tableUrl + '/' + item.id, {
        updateStatus: action,
        ...item
      })
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
    },

    mappingDocument() {
      this.toolbarTitle = this.$helper.mapping(this.typeDocument)
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
        type: this.typeDocument,
      }
      this.$axios
        .get(this.tableUrl, {
          params: {
            ...vm.options,
            ...status
          },
        })
        .then((res) => {
          this.loading = false
          this.allData = res.data.data
          this.totalData = res.data.total
          this.itemSearch = res.data.filter
          this.form = Object.assign({}, res.data.form)
          this.defaultItem = Object.assign({}, res.data.form)
          this.company = this.$auth.$storage.getState('company')
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
  },
}
</script>

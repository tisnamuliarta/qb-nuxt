<template>
  <v-row>
    <v-col cols="12" class="mt-0">
      <v-skeleton-loader v-show="loading" type="table" />
      <v-data-table
        v-show="!loading"
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
            :show-new-data-multiple="showNewDataMultiple"
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
          <v-chip label small dark :color="$formatter.statusColor(item.status)">
            {{ item.status }}
          </v-chip>
        </template>

        <template #[`item.balance_due`]="{ item }">
          {{
            $auth.user.entity.currency.currency_symbol +
            ' ' +
            $formatter.formatPrice(item.balance_due)
          }}
        </template>

        <template #[`item.amount`]="{ item }">
          {{
            $auth.user.entity.currency.currency_symbol +
            ' ' +
            $formatter.formatPrice(item.amount)
          }}
        </template>

        <template #[`item.tags`]="{ item }">
          <v-chip
            v-for="(value, index) in item.tags"
            :key="index"
            class="ma-2"
            dense
            label
            small
            outlined
            color="green"
          >
            {{ value.name.en }}
          </v-chip>
        </template>

        <template #[`item.main_account_amount`]="{ item }">
          {{
            $auth.user.entity.currency.currency_symbol +
            ' ' +
            $formatter.formatPrice(item.main_account_amount)
          }}
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn
            v-if="
              item.status === 'open' ||
              item.status === 'draft' ||
              item.status === 'partial'
            "
            color="secondary"
            class="font-weight-bold text-right pr-0"
            text
            small
            @click.stop="actions('edit', item)"
          >
            Edit
          </v-btn>
          <v-btn
            v-if="item.status === 'closed' || item.status === 'canceled'"
            color="secondary"
            class="font-weight-bold text-right pr-0"
            text
            small
            @click.stop="actions('view', item)"
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
                @click.stop="actions(value.action, item)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ value.text }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>

      <AccountingDialogLedger ref="ledger"></AccountingDialogLedger>
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
    typeTrans: {
      type: Array,
      default() {
        return []
      },
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
          { text: 'Cancel', action: 'canceled' },
          { text: 'Delete', action: 'delete' },
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
    showNewDataMultiple: {
      type: Boolean,
      default: true,
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
      dateFrom: null,
      dateTo: null,
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

  activated() {
    this.getDataFromApi()
  },

  mounted() {
    this.itemText = this.items[0].text
    this.itemAction = this.items[0].action
    // this.getDataFromApi()
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

    editItem(item) {
      if (item.transaction_type === 'JN') {
        this.$refs.ledger.openDialog('/api/transaction/ledger/' + item.id)
      } else {
        this.$auth.$storage.setState('basePath', this.$route.path)
        this.$router.push({
          path: this.$formatter.mappingAction(item.transaction_type),
          query: {
            document: item.id,
          },
        })
      }
    },

    actions(action, item) {
      switch (action) {
        case 'edit':
        case 'view':
          this.editItem(item)
          break

        case 'delete':
          this.deleteItem(item)
          break

        case 'closed':
        case 'canceled':
          this.closeItem(item, action)
          break
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
            .delete(this.tableUrl + '/' + item.id)
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

    closeItem(item, action) {
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
            .put(this.tableUrl + '/' + item.id, {
              updateStatus: action,
              ...item,
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
        }
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
        type: this.typeDocument,
        typeTrans: this.typeTrans,
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
      }
      this.$axios
        .get(this.tableUrl, {
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

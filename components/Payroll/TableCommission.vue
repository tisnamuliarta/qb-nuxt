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
            @emitData="emitData"
            @newData="newData"
            @getDataFromApi="getDataFromApi"
          />
        </template>
        <template #[`item.first_name`]="{ item }">
          <a @click="editItem(item)">
            <strong v-text="item.first_name + ' ' + item.last_name"></strong>
          </a>
        </template>

        <template #[`item.status`]="{ item }">
          <v-chip label small dark :color="statusColor(item)">
            {{ item.status }}
          </v-chip>
        </template>

        <template #[`item.quantity`]="{ item }">
          {{ $formatter.formatPrice(item.quantity) }}
        </template>

        <template #[`item.amount`]="{ item }">
          {{
            $auth.user.entity.currency.currency_symbol +
            ' ' +
            $formatter.formatPrice(item.amount)
          }}
        </template>

        <template #[`item.sub_total`]="{ item }">
          {{
            $auth.user.entity.currency.currency_symbol +
            ' ' +
            $formatter.formatPrice(item.sub_total)
          }}
        </template>

        <template #[`item.payment_method`]="{ item }">
          {{ item.payment_method === 1 ? 'Cash' : 'Direct Deposit' }}
        </template>
        <template #[`item.id`]="{ item }">
          <a @click="editItem(item)">
            <strong>
              {{
                item.transaction_type === 'CS' || item.transaction_type === 'IN'
                  ? item.transaction.transaction_no
                  : item.document.transaction_no
              }}
            </strong>
          </a>
        </template>
        <template #[`item.line_item`]="{ item }">
          {{
            item.transaction_type === 'CS' || item.transaction_type === 'IN'
              ? item.transaction.narration
              : item.document.narration
          }}
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
      default: 'Employee Commission',
    },
    btnTitle: {
      type: String,
      default: 'New Transaction',
    },
    items: {
      type: Array,
      default() {
        return [{ text: 'Delete', action: 'delete' }]
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
      dateFrom: null,
      dateTo: null,
      headers: [
        { text: 'Name', value: 'employee_name', cellClass: 'disable-wrap' },
        {
          text: 'Transaction No',
          value: 'id',
          cellClass: 'disable-wrap',
        },
        {
          text: 'Transaction Type',
          value: 'transaction_type',
          cellClass: 'disable-wrap',
        },
        {
          text: 'Transaction date',
          value: 'transaction_date',
          cellClass: 'disable-wrap',
        },
        {
          text: 'Notes',
          value: 'line_item',
          cellClass: 'disable-wrap',
        },
        {
          text: 'Quantity',
          value: 'quantity',
          cellClass: 'disable-wrap',
          align: 'right',
        },
        {
          text: 'Amount',
          value: 'amount',
          cellClass: 'disable-wrap',
          align: 'right',
        },
        {
          text: 'Sub Total',
          value: 'sub_total',
          cellClass: 'disable-wrap',
          align: 'right',
        },
        {
          text: 'Status',
          value: 'status',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
        // {
        //   text: 'Actions',
        //   value: 'actions',
        //   align: 'center',
        //   cellClass: 'disable-wrap',
        //   sortable: false,
        //   filterable: false,
        // },
      ],
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? this.$t('New Employee')
        : this.$t('Edit Employee')
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

  activated() {
    this.itemText = this.items[0].text
    this.itemAction = this.items[0].action
    this.getDataFromApi()
  },

  methods: {
    newData() {
      this.editedIndex = -1
      this.$refs.formData.newData(this.form)
    },

    statusColor(item) {
      return this.$formatter.statusColor(item.status)
    },

    editItem(item) {
      if (item.transaction_type === 'JN') {
        this.$refs.ledger.openDialog('/api/transaction/ledger/' + item.id)
      } else {
        this.$auth.$storage.setState('basePath', this.$route.path)
        this.$router.push({
          path: this.$formatter.mappingAction(item.transaction_type),
          query: {
            document: item.transaction_id,
          },
        })
      }
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
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
      }
      this.$axios
        .get(`/api/payroll/list-commission`, {
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

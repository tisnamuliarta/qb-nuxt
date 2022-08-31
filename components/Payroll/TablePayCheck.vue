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
            show-new-data
            new-data-text="Run Payroll"
            @emitData="emitData"
            @newData="newData"
            @getDataFromApi="getDataFromApi"
          />
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

        <template #[`item.main_account_amount`]="{ item }">
          {{ $formatter.formatPrice(item.main_account_amount) }}
        </template>

        <template #[`item.payment_method`]="{ item }">
          {{
            (item.payment_method === 1 ) ? 'Cash' : 'Direct Deposit'
          }}
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn
            v-if="item.status === 'draft'"
            color="secondary"
            class="font-weight-bold text-right pr-0"
            text
            small
            @click="actions('edit', item)"
          >
            Edit
          </v-btn>
          <v-btn
            v-else-if="item.status === 'closed'"
            color="secondary"
            class="font-weight-bold text-right pr-0"
            text
            small
            @click="payrollSummary(item)"
          >
            Summary
          </v-btn>
          <v-btn
            v-else
            color="secondary"
            class="font-weight-bold text-right pr-0"
            text
            small
            @click="actions('edit', item)"
          >
            View
          </v-btn>
        </template>
      </v-data-table>
    </v-col>

    <LazyPayrollDialogPayrollSummary
      ref="formData"
      :form-data="form"
      :form-title="formTitle"
      :button-title="buttonTitle"
      :form-url="formUrl"
      @getDataFromApi="getDataFromApi"
    ></LazyPayrollDialogPayrollSummary>
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
      headers: this.headerTable,
      dateFrom: null,
      dateTo: null,
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
        case 'partial':
          return 'warning'
        case 'active':
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
      this.$router.push({
        path: this.formUrl,
        query: {
          document: item.id,
        },
      })
    },

    actions(action, item) {
      if (action === 'edit') {
        this.editItem(item)
      } else {
        this.deleteItem(item)
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

    payrollSummary(item) {
      this.$refs.formData.openDialog(item)
    },

    printDocument(item) {
      this.$nuxt.$loading.start()
      this.$axios
        .get(`/api/payroll/print/` + item.id, {
          params: {
            item
          },
          responseType: 'arraybuffer',
        })
        .then((response) => {
          this.$nuxt.$loading.finish()
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')

          link.href = url
          link.setAttribute('download', item.transaction_no + '.pdf') // set custom file name
          document.body.appendChild(link)

          link.click() // force download file without open new tab
        })
        .catch((err) => {
          this.$nuxt.$loading.finish()
          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })
        })
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
      this.$nuxt.$loading.start()
      this.$axios
        .get(`/api/payroll/payroll`, {
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
          this.$nuxt.$loading.finish()
        })
        .catch((err) => {
          this.loading = false
          this.$nuxt.$loading.finish()
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

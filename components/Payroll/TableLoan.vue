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
            :new-data-text="$t('New Loans')"
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

        <template #[`item.amount`]="{ item }">
          {{
            $auth.user.entity.currency.currency_symbol +
            ' ' +
            $formatter.formatPrice(item.amount)
          }}
        </template>

        <template #[`item.payment_method`]="{ item }">
          {{ item.payment_method === 1 ? 'Cash' : 'Direct Deposit' }}
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn
            color="secondary"
            class="font-weight-bold text-right pr-0"
            text
            small
            @click="actions('edit', item)"
          >
            Edit
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

    <LazyPayrollFormLoan
      ref="formData"
      :form-data="form"
      :form-title="formTitle"
      :button-title="buttonTitle"
      :form-url="formUrl"
      @getDataFromApi="getDataFromApi"
    ></LazyPayrollFormLoan>
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
      default: 'New Loan',
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
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? this.$t('New Loans')
        : this.$t('Edit Loans')
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
      this.editedIndex = -1
      this.$refs.formData.newData(this.form)
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
      this.editedIndex = 1
      this.editedIndex = this.allData.indexOf(item)
      this.$refs.formData.editItem(item, this.url)
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
        .get(`/api/payroll/loan`, {
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
          this.$refs.formData.setItemEmployee(res.data.employee)
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

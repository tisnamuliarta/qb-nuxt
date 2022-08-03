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
        hide-default-footer
        class="elevation-1"
        show-select
        fixed-header
        height="76vh"
        dense
        :footer-props="{ 'items-per-page-options': [20, 50, 100, -1] }"
      >
        <template #top>
          <div class="pl-4 pt-2">
            <v-chip
              link
              class="ma-2"
              color="primary"
              label
              small
              @click="$router.push({ path: '/app/accounting/account' })"
            >
              <v-icon left> mdi-arrow-left</v-icon>
              All Accounts
            </v-chip>

            <span class="font-weight-medium text-h6"
              >{{ form.name }} account balances:
              {{
                $auth.user.entity.currency.currency_symbol +
                ' ' +
                $formatter.formatPrice(form.balance)
              }}</span
            >
          </div>

          <LazyMainToolbar
            :document-status="documentStatus"
            :search-status="searchStatus"
            :item-search="itemSearch"
            :search-item="searchItem"
            :search="search"
            title="Chart of Accounts"
            show-filter
            show-batch-action
            @emitData="emitData"
            @newData="newData"
            @getDataFromApi="getDataFromApi"
          />
        </template>

        <template #[`item.amount`]="{ item }">
          {{
            $auth.user.entity.currency.currency_symbol +
            ' ' +
            $formatter.formatPrice(item.amount)
          }}
        </template>

        <template #[`item.contribution`]="{ item }">
          {{
            $auth.user.entity.currency.currency_symbol +
            ' ' +
            $formatter.formatPrice(item.contribution)
          }}
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

        <template #[`item.id`]="{ item }">
          <v-btn
            color="secondary"
            class="font-weight-bold text-right"
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
      </v-data-table>

      <LazyAccountingFormAccount
        ref="forms"
        :form-data="form"
        :form-title="formTitle"
        :button-title="buttonTitle"
        :url="url"
        @getDataFromApi="getDataFromApi"
      ></LazyAccountingFormAccount>

      <AccountingDialogLedger ref="ledger"></AccountingDialogLedger>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ReconcileList',
  data() {
    return {
      totalData: 0,
      editedIndex: -1,
      loading: true,
      allData: [],
      documentStatus: [],
      itemSearch: [],
      searchStatus: '',
      searchItem: '',
      search: '',
      form: {},
      defaultItem: {},
      options: {},
      date_from: null,
      date_to: null,
      items: [
        { text: 'Edit', action: 'edit' },
        { text: 'Delete', action: 'delete' },
      ],
      itemText: '',
      itemAction: '',
      url: '/api/financial/reconcile',
      headers: [
        {
          text: 'Transaction No',
          value: 'transaction_no',
          cellClass: 'disable-wrap',
        },
        { text: 'Transaction Type', value: 'type', cellClass: 'disable-wrap' },
        {
          text: 'Transaction Date',
          value: 'date',
          cellClass: 'disable-wrap',
        },
        { text: 'Notes', value: 'narration', cellClass: 'disable-wrap' },
        { text: 'Status', value: 'status', cellClass: 'disable-wrap' },
        {
          text: 'Amount',
          value: 'contribution',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
        // {
        //   text: 'Actions',
        //   value: 'id',
        //   align: 'right',
        //   cellClass: 'disable-wrap',
        //   sortable: false,
        //   filterable: false,
        // },
      ],
      title: 'Chart Of Accounts',
    }
  },

  head() {
    return {
      title: this.title,
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Account' : 'Edit Account'
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
    this.getDataFromApi()
    this.$nuxt.$emit('extensionSetting', {
      show: false,
      showBtn: false,
    })
  },

  methods: {
    newData() {
      this.editedIndex = -1
      this.$refs.forms.newData(this.form)
    },

    actions(action, item) {
      if (action === 'edit') {
        this.editItem(item)
      } else {
        this.deleteItem(item)
      }
    },

    editItem(item) {
      // this.$auth.$storage.setState('basePath', this.$route.path)

      this.$refs.ledger.openDialog('/api/transaction/ledger/' + item.id)

      // this.$router.push({
      //   path: this.$formatter.mappingAction(item.transaction_type),
      //   query: {
      //     document: item.id,
      //   },
      // })
    },

    deleteItem(item) {
      const vm = this
      this.$swal({
        title: 'Are you sure?',
        text: 'The data will be permanently deleted',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.value) {
          this.$axios
            .delete(vm.url + '/' + item.id)
            .then((res) => {
              this.$swal({
                type: 'success',
                title: 'Success...',
                text: 'Row Deleted!',
              })
              this.getDataFromApi()
            })
            .catch((err) => {
              this.$swal({
                type: 'error',
                title: 'Oops...',
                text: err.response.data.message,
              })
            })
        }
      })
    },

    emitData(data) {
      this.documentStatus = data.documentStatus
      this.itemSearch = data.itemSearch
      this.searchStatus = data.searchStatus
      this.searchItem = data.searchItem
      this.search = data.search
      this.filters = data.filters
      this.date_from = data.date_from
      this.date_to = data.date_to
      this.getDataFromApi()
    },

    getDataFromApi() {
      this.loading = true
      const vm = this
      this.$axios
        .get('/api/financial/accounts/' + this.$route.query.id, {
          params: {
            options: vm.options,
            searchItem: vm.searchItem,
            documentStatus: vm.documentStatus,
            searchStatus: vm.searchStatus,
            search: vm.search,
            date_from: vm.date_from,
            date_to: vm.date_to,
          },
        })
        .then((res) => {
          this.loading = false
          this.allData = res.data.transactions
          this.totalData = res.data.total
          this.itemSearch = res.data.filter
          this.form = Object.assign({}, res.data.data)
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

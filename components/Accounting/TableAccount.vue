<template>
  <v-row>
    <v-col cols="12" class="mt-0">
      <v-skeleton-loader v-show="loading" type="table" />
      <v-data-table
        v-show="!loading"
        v-model="selected"
        :mobile-breakpoint="0"
        :headers="headers"
        :items="allData"
        :loading="loading"
        :single-select="viewData"
        :class="viewData ? 'elevation-0' : 'elevation-1'"
        show-select
        fixed-header
        :search="search"
        :height="viewData ? '60vh' : '70vh'"
        dense
        :footer-props="{ 'items-per-page-options': [250, 500, -1] }"
      >
        <template #top>
          <div v-if="!viewData" class="pl-4 pt-2">
            <span class="font-weight-medium text-h6"
              >{{ $t('Chart Of Accounts') }}
            </span>
          </div>

          <LazyMainToolbar
            :document-status="documentStatus"
            :search-status="searchStatus"
            :item-search="itemSearch"
            :search-item="searchItem"
            :search="search"
            :show-zero-qty="true"
            title="Chart of Accounts"
            show-batch-action
            show-new-data
            show-filter
            :show-search-filter="false"
            new-data-text="New Account"
            @emitData="emitData"
            @newData="newData"
            @getDataFromApi="getDataFromApi"
          >
            <template #search>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                outlined
                dense
                clearable
                hide-details="auto"
              ></v-text-field>
            </template>
          </LazyMainToolbar>
        </template>

        <template #[`item.balance`]="{ item }">
          {{
            item.currency.currency_code +
            ' ' +
            $formatter.formatPrice(item.balance)
          }}
        </template>

        <template #[`item.code`]="{ item }">
          <a @click="viewItem(item)">
            <strong v-text="item.code"></strong>
          </a>
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
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ChartOfAccount',

  props: {
    viewData: {
      type: Boolean,
      default: false,
    },
    formType: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      selected: [],
      totalData: 0,
      editedIndex: -1,
      loading: true,
      allData: [],
      documentStatus: [],
      itemSearch: [],
      searchStatus: '',
      searchItem: '',
      search: '',
      show_zero_balance: null,
      form: {},
      defaultItem: {},
      options: {},
      items: [
        { text: 'Edit', action: 'edit' },
        { text: 'Delete', action: 'delete' },
      ],
      itemText: 'Edit',
      itemAction: 'edit',
      url: '/api/financial/accounts',
      headers: [],
      title: 'Chart Of Accounts',
      formTypeData: null,
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

  activated() {
    this.getDataFromApi()
  },

  mounted() {
    // this.getDataFromApi()
    this.mappingHeader()
  },

  methods: {
    returnSelected() {
      return this.selected
    },

    viewItem(item) {
      this.$router.push({
        path: '/app/accounting/detail',
        query: {
          id: item.id,
        },
      })
    },

    setEmptyToSelected(formTypeData) {
      this.selected = []
      this.formTypeData = this.$auth.$storage.getState('formType')
      this.getDataFromApi()
    },

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
      this.editedIndex = this.allData.indexOf(item)
      this.$refs.forms.editItem(item, this.form)
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
      this.show_zero_balance = data.show_zero_balance
      this.getDataFromApi()
    },

    mappingHeader() {
      if (this.viewData) {
        this.headers = [
          { text: 'Account Code', value: 'code' },
          { text: 'Account Name', value: 'name', cellClass: 'disable-wrap' },
          {
            text: 'Account Type',
            value: 'account_type',
            cellClass: 'disable-wrap',
          },
          { text: 'Category', value: 'category.name' },
        ]
      } else {
        this.headers = [
          { text: 'Account Code', value: 'code' },
          { text: 'Account Name', value: 'name' },
          {
            text: 'Account Type',
            value: 'account_type',
          },
          { text: 'Category', value: 'category.name' },
          {
            text: 'Balance',
            value: 'balance',
            cellClass: 'disable-wrap',
            sortable: false,
            filterable: false,
          },
          {
            text: 'Actions',
            value: 'id',
            align: 'right',
            cellClass: 'disable-wrap',
            sortable: false,
            filterable: false,
          },
        ]
      }
    },

    searchData(data) {
      this.search = data.search
    },

    getDataFromApi() {
      this.loading = true
      const vm = this

      let accountType = ''
      if (this.formTypeData === 'CS') {
        accountType = 'OPERATING_REVENUE'
      } else if (this.formTypeData === 'CP') {
        accountType =
          'OPERATING_EXPENSE, DIRECT_EXPENSE, OVERHEAD_EXPENSE, OTHER_EXPENSE, NON_CURRENT_ASSET, CURRENT_ASSET, INVENTORY'
      }

      const search = {
        searchItem: vm.searchItem,
        documentStatus: vm.documentStatus,
        searchStatus: vm.searchStatus,
        search: vm.search,
        show_zero_balance: vm.show_zero_balance,
        type: accountType
      }
      this.$axios
        .get(this.url, {
          params: {
            ...vm.options,
            ...search,
          },
        })
        .then((res) => {
          this.loading = false
          const data = res.data

          this.allData = data.data
          this.totalData = data.total
          this.itemSearch = data.filter
          this.form = Object.assign({}, data.form)
          this.defaultItem = Object.assign({}, data.form)
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

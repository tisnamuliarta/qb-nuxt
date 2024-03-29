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
          fixed-header
          height="70vh"
          show-select
          dense
          :footer-props="{ 'items-per-page-options': [20, 50, 100, -1] }"
        >
          <template #top>
            <div class="pl-4 pt-2">
              <span class="font-weight-medium text-h6">{{
                $t('Business Partner Master Data')
              }}</span>
            </div>
            <LazyMainToolbar
              :document-status="documentStatus"
              :search-status="searchStatus"
              :item-search="itemSearch"
              :search-item="searchItem"
              :search="search"
              title="Contacts"
              show-batch-action
              show-new-data
              :new-data-text="$t('New Business Partner')"
              @emitData="emitData"
              @newData="newData"
              @getDataFromApi="getDataFromApi"
            />
          </template>

          <template #[`item.name`]="{ item }">
            <a @click="viewItem(item)">
              <strong v-text="item.name"></strong>
            </a>
          </template>

          <!-- <template #[`item.name`]="{ item }">
            <a @click="openDetail(item)">
              <strong v-text="item.name"></strong>
            </a>
          </template> -->

          <template #[`item.balance`]="{ item }">
            <span v-if="item.type === 'Customer'">
              {{
                $auth.user.entity.currency.currency_symbol +
                ' ' +
                $formatter.formatPrice(item.sell_account.balance)
              }}
            </span>
            <span v-else>
              {{
                $auth.user.entity.currency.currency_symbol +
                ' ' +
                $formatter.formatPrice(item.purchase_account.balance)
              }}
            </span>
          </template>

          <template #[`item.ACTIONS`]="{ item }">
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
      </div>
    </v-flex>

    <LazyInventoryFormContact
      ref="formData"
      :form-data="form"
      :form-title="formTitle"
      :button-title="buttonTitle"
      @getDataFromApi="getDataFromApi"
    />
  </v-layout>
</template>

<script>
export default {
  name: 'CustomerList',

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
      url: '/api/bp/contacts',
      form: {},
      defaultItem: {},
      options: {},
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'type' },
        { text: 'Company', value: 'company_name' },
        {
          text: 'Email',
          value: 'email',
          sortable: false,
          filterable: false,
        },
        {
          text: 'Phone',
          value: 'phone',
          sortable: false,
          filterable: false,
        },
        {
          text: 'Balance',
          value: 'balance',
          sortable: false,
          filterable: false,
          align: 'right',
        },
        {
          text: 'Action',
          value: 'ACTIONS',
          align: 'center',
          sortable: false,
          filterable: false,
        },
      ],
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

  head() {
    return {
      title: this.$t('Business Partners'),
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? this.$t('New Business Partner')
        : this.$t('Edit Business Partner')
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
    this.$nuxt.$emit('extensionSetting', {
      show: false,
      showBtn: false,
    })
  },

  mounted() {
    this.itemText = this.items[0].text
    this.itemAction = this.items[0].action
  },

  methods: {
    viewItem(item) {
      this.$router.push({
        path: '/app/contact/detail/transaction',
        query: {
          id: item.id,
        },
      })
    },
    newData() {
      this.editedIndex = -1
      this.$refs.formData.newData(this.form, this.defaultItem)
    },

    openDetail(item) {
      this.$router.push({
        path: '/app/contact/detail',
        query: { id: item.id },
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
      this.$refs.formData.editItem(item)
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

<template>
  <v-layout>
    <v-flex sm12>
      <div class="mt-0">
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
          class="elevation-1"
          dense
          :footer-props="{ 'items-per-page-options': [20, 50, 100, -1] }"
        >
          <template #top>
            <div class="pl-4 pt-2">
              <span class="font-weight-medium text-h6">Master VAT</span>
            </div>

            <LazyMainToolbar
              title="Taxes"
              show-new-data
              show-back-link
              new-data-text="New Tax"
              @emitData="emitData"
              @newData="newData"
              @getDataFromApi="getDataFromApi"
            />
          </template>
          <template #[`item.ACTIONS`]="{ item }">
            <v-btn
              text
              small
              class="mr-2 font-weight-bold text-right pr-0"
              color="secondary"
              @click="editItem(item)"
            >
              Edit
            </v-btn>
          </template>
        </v-data-table>
      </div>
    </v-flex>

    <DialogForm
      ref="dialogForm"
      max-width="600px"
      :dialog-title="formTitle"
      button-title="Save"
    >
      <template #content>
        <v-container>
          <v-row no-gutters>
            <v-col cols="12" class="pr-1 pl-1 pb-1 pt-1 mt-1">
              <v-text-field
                v-model="form.name"
                label="Name"
                outlined
                dense
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="pr-1 pl-1 pb-1 pt-1 mt-1">
              <v-text-field
                v-model="form.code"
                label="Code"
                outlined
                dense
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="pr-1 pl-1 pb-1 pt-1 mt-1">
              <vuetify-money
                v-model="form.rate"
                :value-when-is-empty="valueWhenIsEmpty"
                :options="moneyOptions"
                label="Rate"
                outlined
                dense
                hide-details="auto"
              ></vuetify-money>
            </v-col>

            <v-col cols="12" class="pr-1 pl-1 pb-1 pt-1 mt-1">
              <v-autocomplete
                v-model="form.account_id"
                :items="itemAccounts"
                item-text="name"
                item-value="id"
                label="Accounts"
                outlined
                dense
                hide-details="auto"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template #saveData>
        <v-btn
          color="green darken-1"
          dark
          small
          :loading="submitLoad"
          @click="save()"
        >
          Save
        </v-btn>
      </template>
    </DialogForm>
  </v-layout>
</template>

<script>
export default {
  name: 'TaxesList',
  data() {
    return {
      totalData: 0,
      editedIndex: -1,
      submitLoad: false,
      statusProcessing: 'insert',
      dialog: false,
      loading: true,
      insert: true,
      url: '/api/financial/taxes',

      valueWhenIsEmpty: '0',
      moneyOptions: {
        suffix: '',
        length: 11,
        precision: 2,
      },

      documentStatus: [],
      itemSearch: [],
      searchStatus: '',
      searchItem: '',
      search: '',

      itemAccounts: [],
      allData: [],
      form: {},
      defaultItem: {},
      options: {},
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'code', value: 'code' },
        { text: 'rate', value: 'rate' },
        { text: 'Account', value: 'account.name' },
        { text: 'Action', value: 'ACTIONS', align: 'center' },
      ],
    }
  },

  head() {
    return {
      title: 'VAT',
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New' : 'Edit'
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

  mounted() {
    this.getAccounts()
  },

  methods: {
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

    getAccounts() {
      this.$axios
        .get(`/api/financial/accounts`, {
          params: {
            type: 'All',
          },
        })
        .then((res) => {
          this.itemAccounts = res.data.data
        })
        .catch((err) => {
          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })
        })
    },

    newData() {
      this.$refs.dialogForm.openDialog()
      this.statusProcessing = 'insert'
      this.form = Object.assign({}, this.defaultItem)
    },

    editItem(item) {
      this.editedIndex = this.allData.indexOf(item)
      this.form = Object.assign({}, item)
      this.statusProcessing = 'update'
      this.$refs.dialogForm.openDialog()
      this.insert = false
    },

    save(type = 'all', row = null) {
      const vm = this
      const form = this.form
      const status = this.statusProcessing

      if (status === 'insert') {
        this.store('post', this.url, form, 'insert', type)
        vm.submitLoad = false
      } else if (status === 'update') {
        this.store('put', this.url + '/' + this.form.id, form, 'update', type)
        vm.submitLoad = false
      }
    },

    store(method, url, data, type, column = 'all') {
      const vm = this
      vm.submitLoad = true
      this.$axios({ method, url, data })
        .then((res) => {
          vm.submitLoad = false
          this.$refs.dialogForm.closeDialog()
          this.getDataFromApi()
        })
        .catch((err) => {
          vm.submitLoad = false
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

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="pl-4 pt-2">
          <v-chip
            link
            class="ma-2"
            color="primary"
            label
            small
            @click="$router.push({ path: '/app/reports/list' })"
          >
            <v-icon left> mdi-arrow-left</v-icon>
            All Reports
          </v-chip>

          <span class="font-weight-medium text-h6">{{
            $route.query.name
          }}</span>
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
          @getDataFromApi="getDataFromApi"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ListReport',

  data() {
    return {
      totalData: 0,
      loading: true,
      allData: [],
      documentStatus: [],
      itemSearch: [],
      searchStatus: '',
      searchItem: '',
      search: '',
      form: {},
      date_from: null,
      date_to: null,
      url: '/api/report',
      title: 'Reports',
    }
  },

  head() {
    return {
      title: this.$route.query.name,
    }
  },

  activated() {
    this.getDataFromApi()
  },

  methods: {
    actions(action, item) {
      if (action === 'edit') {
        this.editItem(item)
      } else {
        this.deleteItem(item)
      }
    },

    editItem(item) {
      this.$auth.$storage.setState('basePath', this.$route.path)
      this.$router.push({
        path: this.$formatter.mappingAction(item.transaction_type),
        query: {
          document: item.id,
        },
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
        .get(this.url, {
          params: {
            options: vm.options,
            searchItem: vm.searchItem,
            documentStatus: vm.documentStatus,
            searchStatus: vm.searchStatus,
            search: vm.search,
            start_date: vm.date_from,
            end_date: vm.date_to,
            report_type: vm.$route.query.name,
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

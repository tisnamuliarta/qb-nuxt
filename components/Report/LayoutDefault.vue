<template>
  <v-container>
    <v-row align="center" align-content="center" justify="center">
      <v-col cols="12" :md="mdWidth">
        <v-card>
          <v-card-text>
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
                $t($route.query.name)
              }} {{ period }}</span>
            </div>

            <LazyMainToolbar
              :document-status="documentStatus"
              :search-status="searchStatus"
              :item-search="itemSearch"
              :search-item="searchItem"
              :search="search"
              title="Chart of Accounts"
              show-filter
              @emitData="emitData"
              @getDataFromApi="getDataFromApi"
            />

            <v-col cols="12" class="mt-4">
              <slot name="content"></slot>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ListReport',

  props: {
    mdWidth: {
      type: String,
      default: '12',
    },
    period: {
      type: String,
      default: '',
    },
  },

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
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
    })
    this.getDataFromApi()
  },

  methods: {
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
          this.$nuxt.$loading.finish()
          this.loading = false
          this.allData = res.data.data
          this.$emit('getData', {
            data: this.allData,
            startDate: res.data.start_date,
            endDate: res.data.end_date,
          })
          this.totalData = res.data.total
          this.itemSearch = res.data.filter
          this.form = Object.assign({}, res.data.data)
          this.defaultItem = Object.assign({}, res.data.form)
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

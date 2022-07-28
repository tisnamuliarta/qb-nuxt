<template>
  <v-container>
    <v-row>
      <v-col cols="12">
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

            <v-col cols="12" class="mt-4">
              <FormDisplayTable ref="formTableDetail"></FormDisplayTable>
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
      colHeaders: [
        'Item Code',
        'Item Name',
        'UoM',
        'Category',
        'Whs',
        'Group',
        'On Hand',
        'Committed',
        'Ordered',
        'Available',
      ],
      columns: [
        {
          data: 'code',
          wordWrap: false,
        },
        {
          data: 'name',
          wordWrap: false,
        },
        {
          data: 'unit',
          wordWrap: false,
        },
        {
          data: 'category.name',
          wordWrap: false,
        },
        {
          data: 'whs_name',
          wordWrap: false,
        },
        {
          data: 'item_group',
          wordWrap: false,
        },
        {
          data: 'on_hand_qty',
          wordWrap: false,
        },
        {
          data: 'committed_qty',
          wordWrap: false,
        },
        {
          data: 'ordered_qty',
          wordWrap: false,
        },
        {
          data: 'available_qty',
          wordWrap: false,
        },
      ],
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
          this.allData = res.data.data

          setTimeout(() => {
            vm.$refs.formTableDetail.setDataToDetails(
              res.data.data,
              vm.colHeaders,
              vm.columns
            )
          }, 300)
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

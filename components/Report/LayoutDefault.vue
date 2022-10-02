<template>
  <v-container>
    <v-row align="center" align-content="center" justify="center">
      <v-skeleton-loader v-show="loading" type="table" />
      <v-col v-show="!loading" cols="12" :md="mdWidth">
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

              <div class="text-center">
                <p class="font-weight-medium text-h5 mt-n4">
                  {{ $t($route.query.name) }}
                </p>
                <p class="font-weight-medium mt-n4">Period: {{ period }}</p>
              </div>
              <v-divider></v-divider>
            </div>

            <LazyMainToolbar
              :document-status="documentStatus"
              :search-status="searchStatus"
              :item-search="itemSearch"
              :search-item="searchItem"
              :search="search"
              show-pdf-btn
              show-print-btn
              title="Chart of Accounts"
              show-filter
              @emitData="emitData"
              @printPdf="printPdf"
              @exportExcel="exportExcel"
              @getDataFromApi="getDataFromApi"
            />

            <v-col cols="12" class="mt-1">
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
      default: '6',
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
    // this.$nextTick(() => {
    //   this.$nuxt.$loading.start()
    // })
    this.getDataFromApi()
  },

  mounted() {
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

    printPdf() {
      const vm = this
      this.$nuxt.$loading.start()
      this.$axios
        .get(`/api/report/pdf`, {
          params: {
            reportType: vm.$auth.$storage.getCookie('reportType'),
            start_date: vm.date_from,
            end_date: vm.date_to,
          },
          responseType: 'arraybuffer',
        })
        .then((response) => {
          this.$nuxt.$loading.finish()
          // const url = window.URL.createObjectURL(new Blob([response.data]))
          // const link = document.createElement('a')

          // link.href = url
          // link.setAttribute(
          //   'download',
          //   vm.$auth.$storage.getCookie('reportType') + '.pdf'
          // ) // set custom file name
          // document.body.appendChild(link)

          // link.click() // force download file without open new tab

          const blob = new Blob([response.data], {
            type: 'application/pdf',
          })
          const url = window.URL.createObjectURL(blob)
          // const link = document.createElement('a')
          // link.href = window.URL.createObjectURL(blob)
          // link.download ='approval check list '+details[0]+'.pdf'
          // document.body.appendChild(link)
          // link.click()
          // setTimeout(function () {
          //   document.body.removeChild(link)
          //   window.URL.revokeObjectURL(url)
          // }, 100)

          const theWindow = window.open(url)
          const theDoc = theWindow.document
          const theScript = document.createElement('script')
          function injectThis() {
            window.print()
          }
          theScript.innerHTML = `window.onload = ${injectThis.toString()};`
          theDoc.body.appendChild(theScript)
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

    exportExcel() {
      const vm = this
      this.$nuxt.$loading.start()
      this.$axios
        .get(`/api/report/excel`, {
          params: {
            type: vm.$auth.$storage.getCookie('reportType'),
            start_date: vm.date_from,
            end_date: vm.date_to,
          },
          responseType: 'arraybuffer',
        })
        .then((response) => {
          this.$nuxt.$loading.finish()
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')

          link.href = url
          link.setAttribute(
            'download',
            vm.$auth.$storage.getCookie('reportType') + '.xlsx'
          ) // set custom file name
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
      this.date_from = data.dateFrom
      this.date_to = data.dateTo

      // this.$nuxt.$loading.start()
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
            report_type: vm.$auth.$storage.getCookie('reportType'),
          },
        })
        .then((res) => {
          // this.$nuxt.$loading.finish()
          this.loading = false
          this.allData = res.data.data
          this.$emit('getData', {
            data: this.allData,
            startDate: res.data.start_date,
            endDate: res.data.end_date,
            width: res.data.width,
          })
          this.totalData = res.data.total
          this.itemSearch = res.data.filter
          this.form = Object.assign({}, res.data.data)
          this.defaultItem = Object.assign({}, res.data.form)
        })
        .catch((err) => {
          this.loading = false
          // this.$nuxt.$loading.finish()
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

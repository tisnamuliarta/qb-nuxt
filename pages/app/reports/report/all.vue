<template>
  <LazyReportLayoutDefault
    ref="report"
    :period="period"
    :md-width="width"
    @getData="getData"
  >
    <template #content>
      <v-simple-table dense>
        <template #default>
          <tbody v-html="allData"></tbody>
        </template>
      </v-simple-table>
    </template>
  </LazyReportLayoutDefault>
</template>

<script>
export default {
  name: 'ListReport',

  data() {
    return {
      loading: true,
      allData: [],
      period: '',
      width: '8'
    }
  },

  head() {
    return {
      title: this.$route.query.name,
    }
  },

  methods: {
    getData(data) {
      this.allData = data.data
      this.period = data.startDate + ' - ' + data.endDate
      this.width = data.width
    },
  },
}
</script>

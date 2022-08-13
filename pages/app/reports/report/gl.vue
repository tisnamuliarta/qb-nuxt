<template>
  <LazyReportLayoutDefault ref="report" @getData="getData">
    <template #content>
      <v-simple-table dense>
        <template #default>
          <thead>
            <tr>
              <th class="text-left">Description</th>
              <th class="text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>NON_OPERATING_EXPENSES</td>
              <td></td>
            </tr>

            <tr>
              <td>NON_OPERATING_REVENUES</td>
              <td></td>
            </tr>

            <tr>
              <td>OPERATING_EXPENSES</td>
              <td></td>
            </tr>

            <tr>
              <td>OPERATING_REVENUES</td>
              <td></td>
            </tr>

            <tr v-for="(item, i) in allData.accounts" :key="i + '1'">
              <td>{{ item.OPERATING_EXPENSES }}</td>
            </tr>

            <tr v-for="(item, i) in allData.balances" :key="i + '2'">
              <td>{{ item[i] }}</td>
            </tr>

            <tr v-for="(item, i) in allData.results" :key="i + '3'">
              <td>{{ item[i] }}</td>
            </tr>

            <tr v-for="(item, i) in allData.totals" :key="i + '4'">
              <td>{{ item[i] }}</td>
            </tr>
          </tbody>
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
    }
  },

  head() {
    return {
      title: this.$route.query.name,
    }
  },

  methods: {
    getData(data) {
      this.allData = data
    },
  },
}
</script>

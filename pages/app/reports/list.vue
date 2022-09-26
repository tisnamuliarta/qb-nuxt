<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="7">
        <v-card class="mx-auto">
          <v-sheet class="pa-4 primary">
            <v-text-field
              v-model="search"
              label="Search Company Directory"
              dark
              flat
              dense
              solo-inverted
              hide-details
              clearable
              clear-icon="mdi-close-circle-outline"
            ></v-text-field>
          </v-sheet>
          <v-card-text>
            <v-treeview
              :items="items"
              :search="search"
              :filter="filter"
              :open.sync="open"
              open-all
              dense
              activatable
              hoverable
            >
              <template #label="{ item }">
                <span style="cursor: pointer;" @click="openDialog(item)">{{ item.name }}</span>
              </template>
            </v-treeview>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AllSales',

  data() {
    return {
      panel: [0, 1, 2, 3, 4, 5, 6],
      itemsPerPageArray: [4, 8, 12],
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      sortBy: 'name',
      keys: ['Name', 'Calories'],
      open: [1, 2, 3, 4, 5, 6, 7, 8],
      search: null,
      caseSensitive: false,
      items: [],
    }
  },

  head() {
    return {
      title: 'Reports',
    }
  },

  computed: {
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].includes(search)
        : undefined
    },
  },

  activated() {
    this.getReport()
    this.$nuxt.$emit('extensionSetting', {
      show: false,
      showBtn: false,
    })
  },

  created() {
    this.$nuxt.$on('getDataFromApi', ($event) => this.getDataFromApi($event))
  },

  methods: {
    getReport() {
      this.$axios.get(`/api/report-list`)
        .then(res => {
          this.items = res.data.data
          this.open= [1, 2, 3, 4, 5, 6, 7, 8]
        })
    },

    openDialog(item) {
      this.$router.push({
        path: item.route,
        query: {
          name: item.alias
        }
      })
      this.$auth.$storage.setCookie('reportType', item.alias)
    },

    getDataFromApi() {
      if (this.$refs.tableDocument) {
        this.$refs.tableDocument.getDataFromApi()
      }
    },
  },
}
</script>

<template>
  <v-app-bar flat color="white" class="rounded" dense elevation="0">
    <v-btn v-if="showBatchAction" icon class="mr-0 pr-0">
      <v-icon>mdi-arrow-down-left</v-icon>
    </v-btn>

    <v-menu
      v-if="showBatchAction"
      transition="slide-y-transition"
      offset-y
      bottom
    >
      <template #activator="{ on, attrs }">
        <v-btn
          small
          color="green"
          class="ml-0 mr-2"
          dark
          elevation="0"
          v-bind="attrs"
          v-on="on"
        >
          Batch Action
          <v-btn dark small icon>
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item
          v-for="(value, i) in ['Make Inactive']"
          :key="i"
          dense
          @click="makeInActive(value, doctype)"
        >
          <v-list-item-content>
            <v-list-item-title>{{ value }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="400"
      max-width="550px"
      bottom
      offset-y
    >
      <template #activator="{ on, attrs }">
        <v-btn
          v-if="showFilter"
          small
          outlined
          color="black"
          class="d-none d-sm-flex"
          elevation="0"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Filter
          <v-btn dark color="black" class="d-none d-sm-flex" small icon>
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </v-btn>
      </template>

      <v-card rounded elevation="10">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field
                label="Transaction"
                outlined
                dense
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4"> </v-col>
            <v-col cols="12" md="4"> </v-col>

            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="searchStatusData"
                label="Status"
                :items="['All', 'Open', 'Paid', 'Draft', 'Cancel', 'Closed', 'Pending']"
                outlined
                dense
                hide-details="auto"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                label="Delivery Method"
                outlined
                dense
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4"> </v-col>

            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="form.date_filter"
                :items="itemDateFilter"
                label="Date Filter"
                return-object
                outlined
                dense
                hide-details="auto"
                @change="changeDate"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.date_from"
                label="Date From"
                outlined
                dense
                type="date"
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.date_to"
                label="Date To"
                outlined
                dense
                type="date"
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <v-col v-if="showZeroQty" cols="12" md="4">
              <v-select
                v-model="form.show_zero_balance"
                :items="['Yes', 'No']"
                label="Show Zero Balance"
                outlined
                dense
                type="date"
                hide-details="auto"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn text small> Cancel </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" small elevation="0" @click="passDataToToolbar">
            Apply
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <div class="d-none d-sm-flex ml-2">
      <v-layout wrap>
        <v-row>
          <v-col cols="12" md="12" sm="12" class="mt-0 mr-2">
            <slot name="search"></slot>
            <v-text-field
              v-if="showSearchFilter"
              v-model="searchData"
              label="search"
              class="mt-1"
              outlined
              dense
              hide-details="auto"
              @change="getDataFromApi"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-layout>
    </div>

    <v-spacer />

    <LazySetupBackList v-if="showBackLink"></LazySetupBackList>

    <v-btn
      v-if="showNewData"
      color="primary"
      class="d-none d-sm-flex"
      elevation="0"
      small
      @click="newData"
    >
      {{ newDataText }}
    </v-btn>

    <v-btn
      v-if="showNewData"
      color="primary"
      class="d-flex d-sm-none"
      elevation="0"
      small
      icon
      @click="newData"
    >
      <v-icon>mdi-plus-box</v-icon>
    </v-btn>

    <v-btn
      v-if="showNewDataMultiple"
      small
      color="primary"
      elevation="0"
      @click="newData"
    >
      {{ $t('New Transactions') }}
    </v-btn>

    <v-btn
      class="ml-1 mr-1 d-none d-sm-flex"
      :loading="loading"
      icon
      small
      @click="processAction('refresh')"
    >
      <v-icon>mdi-refresh</v-icon>
    </v-btn>

    <v-btn
      v-if="showPrintBtn"
      class="ml-1 mr-1 d-none d-sm-flex"
      :loading="loading"
      icon
      small
      @click="processAction('print')"
    >
      <v-icon>mdi-printer</v-icon>
    </v-btn>

    <v-btn
      v-if="showPdfBtn"
      class="ml-1 mr-1 d-none d-sm-flex"
      :loading="loading"
      icon
      small
      @click="processAction('export-excel')"
    >
      <v-icon>mdi-microsoft-excel</v-icon>
    </v-btn>

    <!-- <v-btn
      class="d-none d-sm-flex"
      :loading="loading"
      icon
      small
      @click="processAction('setting')"
    >
      <v-icon>mdi-cog</v-icon>
    </v-btn> -->

    <v-menu offset-y left class="d-flex d-sm-none" :nudge-width="120">
      <template #activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" class="d-flex d-sm-none" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list dense>
        <v-list-item
          v-for="(item, i) in itemsMenu"
          :key="i"
          link
          dense
          @click="processAction(item.action)"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  name: 'MainToolbar',
  props: {
    title: {
      type: String,
      default: '',
    },
    doctype: {
      type: String,
      default: '',
    },
    newDataRoute: {
      type: String,
      default: '',
    },
    newDataType: {
      type: String,
      default: '',
    },
    titleButton: {
      type: String,
      default: '',
    },
    searchItem: {
      type: String,
      default: '',
    },
    search: {
      type: String,
      default: '',
    },
    filters: {
      type: String,
      default: '',
    },
    searchStatus: {
      type: String,
      default: 'Active',
    },
    documentStatus: {
      type: Array,
      default() {
        return []
      },
    },
    buttonTitle: {
      type: String,
      default: 'New',
    },
    newDataText: {
      type: String,
      default: 'New',
    },
    showAdd: {
      type: Boolean,
      default: true,
    },
    filter: {
      type: Boolean,
      default: true,
    },
    showBatchAction: {
      type: Boolean,
      default: false,
    },
    showFilter: {
      type: Boolean,
      default: false,
    },
    showBackLink: {
      type: Boolean,
      default: false,
    },
    showNewData: {
      type: Boolean,
      default: false,
    },
    showNewDataMultiple: {
      type: Boolean,
      default: false,
    },
    showSearchFilter: {
      type: Boolean,
      default: true,
    },
    showZeroQty: {
      type: Boolean,
      default: false,
    },
    showPrintBtn: {
      type: Boolean,
      default: false,
    },
    showPdfBtn: {
      type: Boolean,
      default: false,
    },
    newDataMultipleItem: {
      type: Array,
      default() {
        return []
      },
    },
    itemSearch: {
      type: Array,
      default() {
        return []
      },
    },
  },

  data() {
    return {
      loading: false,
      menu: false,
      dialogFilter: false,
      searchStatusData: this.searchStatus,
      searchItemData: this.searchItem,
      searchData: this.search,
      items: [
        { text: 'Edit', action: 'edit' },
        { text: 'Delete', action: 'delete' },
      ],

      itemDateFilter: [],

      form: {
        date_from: null,
        date_to: null,
        show_zero_balance: null,
        date_filter: null,
      },

      itemsMenu: [
        { title: 'Refresh', icon: 'mdi-refresh', action: 'refresh' },
        { title: 'Print', icon: 'mdi-printer', action: 'print' },
        {
          title: 'Export to excel',
          icon: 'mdi-microsoft-excel',
          action: 'export-excel',
        },
        { title: 'Form Settings', icon: 'mdi-cog', action: 'setting' },
      ],
    }
  },

  watch: {
    searchData: {
      handler() {
        this.$emit('emitData', {
          search: this.searchData,
        })
      },
      deep: true,
    },
  },

  mounted() {
    this.getDateFilter()
  },

  methods: {
    newData() {
      this.$auth.$storage.setState('basePath', this.$route.path)
      this.$emit('newData')
    },

    async getDateFilter() {
      const res = await this.$axios.get(`/api/date-filter`)
      this.itemDateFilter = res.data.date_filter
    },

    changeDate() {
      this.form.date_from = this.form.date_filter.date_from
      this.form.date_to = this.form.date_filter.date_to
    },

    passDataToToolbar(data) {
      this.menu = false
      this.$emit('emitData', {
        documentStatus: data.documentStatus,
        itemSearch: data.itemSearch,
        searchStatus: this.searchStatusData,
        searchItem: data.searchItem,
        search: data.search,
        dateFrom: this.form.date_from,
        dateTo: this.form.date_to,
        show_zero_balance: this.form.show_zero_balance,
      })
    },

    getDataFromApi() {
      this.$emit('getDataFromApi', {
        search: this.search,
      })
    },

    processAction(action) {
      switch (action) {
        case 'refresh':
          this.$emit('getDataFromApi')
          break
        case 'print':
          this.$emit('printPdf')
          break
        case 'export-excel':
          this.$emit('exportExcel')
          break
        case 'setting':
          this.$emit('getDataFromApi')
          break
      }
    },

    makeInActive() {},
  },
}
</script>

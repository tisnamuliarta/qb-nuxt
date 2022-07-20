<template>
  <v-layout>
    <v-flex sm12>
      <div class="mt-0">
        <v-data-table
          :mobile-breakpoint="0"
          :headers="headers"
          :items="allData"
          :items-per-page="20"
          :options.sync="options"
          :server-items-length="totalData"
          :loading="loading"
          hide-default-footer
          class="elevation-1"
          dense
          fixed-header
          height="75vh"
          :footer-props="{ 'items-per-page-options': [20, 50, 100, -1] }"
        >
          <template #top>
            <div class="pl-4 pt-2">
              <span class="font-weight-medium text-h6"
                >{{ $t('Account Category') }}
              </span>
            </div>
            <LazyMainToolbar
              :document-status="documentStatus"
              :search-status="searchStatus"
              :item-search="itemSearch"
              :search-item="searchItem"
              :search="search"
              title="Account Category"
              show-new-data
              show-back-link
              new-data-text="New Category"
              @emitData="emitData"
              @newData="newData"
              @getDataFromApi="getDataFromApi"
            />
          </template>
          <template #[`item.id`]="{ item }">
            <v-btn
              text
              small
              color="secondary"
              class="font-weight-bold text-right"
              @click="editItem(item)"
              >Edit</v-btn
            >

            <v-btn
              text
              small
              color="red"
              class="font-weight-bold text-right"
              @click="deleteItem(item)"
              >Delete</v-btn
            >
          </template>
        </v-data-table>
      </div>
    </v-flex>

    <LazyInventoryFormItemCategory
      ref="forms"
      :form-data="form"
      :form-title="formTitle"
      :button-title="buttonTitle"
      :url="url"
      @getDataFromApi="getDataFromApi"
    ></LazyInventoryFormItemCategory>
  </v-layout>
</template>

<script>
export default {
  name: 'AccountCategory',
  data() {
    return {
      totalData: 0,
      editedIndex: -1,
      loading: true,
      allData: [],
      documentStatus: [],
      itemSearch: [],
      itemCategoryType: [],
      searchStatus: '',
      searchItem: '',
      search: '',
      form: {},
      defaultItem: {},
      options: {},
      url: '/api/inventory/item-category',
      headers: [
        { text: 'Category Name', value: 'name', cellClass: 'disable-wrap' },
        { text: 'Category Type', value: 'type' },
        { text: 'Actions', value: 'id', cellClass: 'disable-wrap' },
      ],
    }
  },

  head() {
    return {
      title: 'Product Category',
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Category' : 'Edit Category'
    },
    buttonTitle() {
      return this.editedIndex === -1 ? 'Save' : 'Update'
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

  methods: {
    newData() {
      this.editedIndex = -1
      this.$refs.forms.newData(this.form, this.itemCategoryType)
    },

    editItem(item) {
      this.editedIndex = this.allData.indexOf(item)
      this.$refs.forms.editItem(item, this.itemCategoryType)
    },

    emitData(data) {
      this.documentStatus = data.documentStatus
      this.itemSearch = data.itemSearch
      this.searchStatus = data.searchStatus
      this.searchItem = data.searchItem
      this.search = data.search
      this.filters = data.filters
      this.getDataFromApi()
    },

    deleteItem(item) {
      const vm = this
      this.$swal({
        title: 'Are you sure?',
        text: 'The data will be permanently deleted',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.value) {
          this.$axios
            .delete(vm.url + '/' + item.id, {
              params: {
                id: item.id,
              },
            })
            .then((res) => {
              this.$swal({
                type: 'success',
                title: 'Success...',
                text: 'Data Deleted!',
              })
              vm.getDataFromApi()
            })
            .catch((err) => {
              this.$swal({
                type: 'error',
                title: 'Oops...',
                text: err.response.data.message,
              })
            })
        }
      })
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
            ...status
          },
        })
        .then((res) => {
          this.loading = false
          this.allData = res.data.data
          this.totalData = res.data.total
          this.itemSearch = res.data.filter
          this.form = Object.assign({}, res.data.form)
          this.defaultItem = Object.assign({}, res.data.form)
          this.itemCategoryType = res.data.category_type_list
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

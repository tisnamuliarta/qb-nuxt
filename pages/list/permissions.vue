<template>
  <v-layout>
    <v-flex sm12>
      <div class="mt-0">
        <v-skeleton-loader v-show="loading" type="table" />
        <v-data-table
          v-show="!loading"
          item-key="menu_name"
          :mobile-breakpoint="0"
          :headers="headers"
          :items="allData"
          :items-per-page="20"
          :options.sync="options"
          :server-items-length="totalData"
          :loading="loading"
          class="elevation-1"
          fixed-header
          show-select
          height="70vh"
          :footer-props="{ 'items-per-page-options': [20, 50, 100, -1] }"
          dense
        >
          <template #top>
            <div class="pl-4 pt-2">
              <span class="font-weight-medium text-h6">Permissions</span>
            </div>

            <LazyMainToolbar
              :document-status="documentStatus"
              :search-status="searchStatus"
              :item-search="itemSearch"
              :search-item="searchItem"
              :search="search"
              :filter="false"
              title="Master Permissions"
              show-new-data
              new-data-text="New Permission"
              show-back-link
              show-batch-action
              @emitData="emitData"
              @newData="newData"
              @getDataFromApi="getDataFromApi"
            />
          </template>
          <template #[`item.ACTIONS`]="{ item }">
            <v-btn
              color="secondary"
              class="font-weight-bold text-right"
              text
              small
              @click="actions(itemAction, item)"
            >
              {{ itemText }}
            </v-btn>
            <v-menu transition="slide-y-transition" bottom>
              <template #activator="{ on, attrs }">
                <v-btn color="black" dark icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(value, i) in items"
                  :key="i"
                  @click="actions(value.action, item)"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ value.text }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </div>
    </v-flex>

    <v-dialog
      v-model="dialog"
      persistent
      no-click-animation
      max-width="600px"
      transition="dialog-top-transition"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
          <v-spacer></v-spacer>
          <v-btn icon color="red" dark @click="dialog = false">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form>
            <v-layout wrap>
              <v-flex md12 class="d-flex">
                <v-layout wrap>
                  <v-flex xs12 class="pa-1 mt-1">
                    <v-select
                      v-model="form.role"
                      :items="itemRole"
                      chips
                      deletable-chips
                      small-chips
                      label="Role"
                      multiple
                      outlined
                      dense
                      hide-details="auto"
                    ></v-select>
                  </v-flex>

                  <v-flex xs12 class="pa-1 mt-1">
                    <v-select
                      v-model="form.parent_name"
                      :items="dataParent"
                      label="Parent Name"
                      outlined
                      dense
                      hide-details="auto"
                      clearable
                    ></v-select>
                  </v-flex>

                  <v-flex md12 class="pa-1 mt-1">
                    <v-text-field
                      v-model="form.menu_name"
                      label="Name"
                      placeholder="Name"
                      outlined
                      dense
                      hide-details="auto"
                    ></v-text-field>
                  </v-flex>

                  <v-flex md12 class="pa-1 mt-1">
                    <v-text-field
                      v-model="form.icon"
                      label="Icon"
                      placeholder="Icon"
                      outlined
                      dense
                      hide-details="auto"
                    ></v-text-field>
                  </v-flex>

                  <v-flex md12 class="pa-1 mt-1">
                    <v-text-field
                      v-model="form.order_line"
                      label="Order Line"
                      placeholder="Order Line"
                      outlined
                      dense
                      hide-details="auto"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 class="pa-1 mt-1">
                    <v-radio-group
                      v-model="form.has_route"
                      row
                      hide-details="auto"
                      label="Has Route"
                    >
                      <v-radio label="Yes" value="Y" color="primary"></v-radio>
                      <v-radio label="No" value="N" color="primary"></v-radio>
                    </v-radio-group>
                  </v-flex>

                  <v-flex v-if="form.has_route === 'Y'" md12 class="pa-1">
                    <v-text-field
                      v-model="form.route_name"
                      label="Route Name"
                      placeholder="Route Name"
                      outlined
                      dense
                      hide-details="auto"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 class="pa-1">
                    <v-radio-group
                      v-model="form.has_child"
                      row
                      hide-details="auto"
                      label="Has Child"
                    >
                      <v-radio label="Yes" value="Y" color="primary"></v-radio>
                      <v-radio label="No" value="N" color="primary"></v-radio>
                    </v-radio-group>
                  </v-flex>

                  <v-flex xs12 class="pa-1">
                    <v-radio-group
                      v-model="form.is_crud"
                      row
                      hide-details="auto"
                      label="Is CRUD"
                    >
                      <v-radio
                        label="Yes"
                        value="Y"
                        color="primary"
                        @change="changeCrud('Y')"
                      ></v-radio>
                      <v-radio
                        label="No"
                        value="N"
                        color="primary"
                        @change="changeCrud('N')"
                      ></v-radio>
                    </v-radio-group>
                  </v-flex>

                  <v-flex xs12 class="pa-1 d-flex">
                    <span class="font-weight-medium">Ability</span>
                  </v-flex>
                  <v-flex xs12 class="pa-1 d-flex">
                    <v-checkbox
                      v-model="form.index"
                      :value="form.index"
                      label="Index"
                      color="primary"
                      hide-details
                    ></v-checkbox>

                    <v-checkbox
                      v-model="form.store"
                      :value="form.store"
                      label="Store"
                      color="primary"
                      hide-details
                    ></v-checkbox>

                    <v-checkbox
                      v-model="form.edits"
                      :value="form.edits"
                      label="Edits"
                      color="primary"
                      hide-details
                    ></v-checkbox>

                    <v-checkbox
                      v-model="form.erase"
                      :value="form.erase"
                      label="Erase"
                      color="primary"
                      hide-details
                    ></v-checkbox>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            dark
            small
            :loading="submitLoad"
            @click="save()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogPermission" persistent max-width="1000px">
      <v-card :loading="loadingPermission">
        <v-card-title>
          <span class="font-weight-medium">Role Permission</span>
        </v-card-title>
        <v-card-text>
          <div class="scroll-container">
            <LazyMasterPermissionList
              ref="childDetails"
            ></LazyMasterPermissionList>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            small
            color="blue darken-1"
            class="white--text"
            @click="$refs.childDetails.addLine()"
          >
            <v-icon small> mdi-plus</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            dark
            small
            @click="dialogPermission = false"
          >
            close
          </v-btn>
          <v-btn
            color="green darken-1"
            dark
            small
            :loading="loadingPermission"
            @click="saveRolePermission()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: 'MasterPermission',
  data() {
    return {
      totalData: 0,
      editedIndex: -1,
      loadNewBtn: false,
      submitLoad: false,
      dialogWindow: false,
      statusProcessing: 'insert',
      dialog: false,
      dialogPermission: false,
      message: false,
      loading: true,
      insertDivision: true,
      insert: true,

      documentStatus: [],
      itemSearch: [],
      searchStatus: '',
      searchItem: '',
      search: '',
      items: [
        { text: 'Edit', action: 'edit' },
        { text: 'Delete', action: 'delete' },
      ],
      itemText: '',
      itemAction: '',

      loadingPermission: true,
      allData: [],
      dataParent: [],
      itemApps: [],
      itemRole: [],
      department: {},
      form: {
        id: null,
        is_crud: 'N',
        order_line: null,
        has_route: 'N',
        has_child: 'N',
        route_name: 'N',
        icon: null,
        menu_name: null,
        parent_name: null,
        app_name: null,
        name: null,
        old_name: null,
        index: 'Y',
        store: '',
        edits: '',
        erase: '',
        role: [],
      },
      defaultItem: {
        id: null,
        is_crud: 'N',
        order_line: null,
        has_route: 'N',
        has_child: 'N',
        route_name: 'N',
        icon: null,
        menu_name: null,
        parent_name: null,
        app_name: null,
        name: null,
        old_name: null,
        index: 'Y',
        store: '',
        edits: '',
        erase: '',
        role: [],
      },
      options: {},
      headers: [
        {
          text: 'Name',
          value: 'menu_name',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
        {
          text: 'Parent Name',
          value: 'parent_name',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
        // { text: 'Icon', value: 'icon' },
        {
          text: 'Route',
          value: 'route_name',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
        { text: 'Has Child', value: 'has_child' },
        // { text: 'Has Route', value: 'has_route' },
        { text: 'Is CRUD', value: 'is_crud' },
        { text: 'Order Line', value: 'order_line' },
        // { text: 'Index', value: 'index', align: 'center' },
        // { text: 'Store', value: 'store', align: 'center' },
        // { text: 'Edits', value: 'edits', align: 'center' },
        // { text: 'Erase', value: 'erase', align: 'center' },
        {
          text: 'Action',
          value: 'ACTIONS',
          align: 'center',
          cellClass: 'disable-wrap',
          sortable: false,
          filterable: false,
        },
      ],
    }
  },

  head() {
    return {
      title: 'Master Permissions',
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

  activated() {
    this.getDataFromApi()
    this.getRole()
    this.itemText = this.items[0].text
    this.itemAction = this.items[0].action
  },

  methods: {
    getRole() {
      this.$axios.get(`/api/master/roles`).then((res) => {
        this.itemRole = res.data.simple
      })
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

    getDataFromApi() {
      this.loading = true
      const vm = this
      const status = {
        searchItem: vm.searchItem,
        documentStatus: vm.documentStatus,
        searchStatus: vm.searchStatus,
        search: vm.search,
        type: this.typeDocument,
      }
      this.$axios
        .get(`/api/master/permissions`, {
          params: {
            ...vm.options,
            ...status,
          },
        })
        .then((res) => {
          this.loading = false
          this.allData = res.data.data
          this.totalData = res.data.total
          this.dataParent = res.data.parent
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

    newData() {
      this.dialog = true
      this.statusProcessing = 'insert'
      this.form = Object.assign({}, this.defaultItem)
      this.message = false
    },

    actions(action, item) {
      if (action === 'edit') {
        this.editItem(item)
      } else {
        this.deleteItem(item)
      }
    },

    deleteItem(item) {
      this.$axios
        .delete(`/api/master/permissions/` + item.menu_name)
        .then((res) => {
          this.getDataFromApi()
          this.$nuxt.$emit('getMenu', 'nice payload')
        })
    },

    editItem(item) {
      this.editedIndex = this.allData.indexOf(item)
      this.form = Object.assign({}, item)
      this.statusProcessing = 'update'
      this.$axios
        .get(`/api/master/permissions/` + this.form.parent_id, {
          params: {
            menu_name: this.form.menu_name,
          },
        })
        .then((res) => {
          const form = Object.assign({}, res.data.data)
          form.old_name = res.data.data.menu_name
          form.role = JSON.parse(res.data.data.role_name)
          setTimeout(() => (this.form = Object.assign({}, form)), 150)
        })
      this.dialog = true
      this.insert = false
    },

    openDialogPermission(item) {
      this.dialogPermission = true
      this.loadingPermission = true
      this.form = Object.assign({}, item)
      this.getPermissionRole(item)
    },

    getPermissionRole(item) {
      this.$axios
        .get(`/api/master/permission-role`, {
          params: {
            role: item.name,
          },
        })
        .then((res) => {
          this.$refs.childDetails.setDataToDetails(res.data.data.rows)
        })
        .finally((res) => {
          this.loadingPermission = false
        })
    },

    saveRolePermission() {
      this.loadingPermission = true
      const details = this.$refs.childDetails.getAddData()
      this.$axios
        .post(`/api/master/permission-role`, {
          details,
          role: this.form.name,
        })
        .then((res) => {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: res.data.message,
          })
          this.getPermissionRole(this.form)
        })
        .catch((err) => {
          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })
        })
        .finally((res) => {
          this.loadingPermission = false
        })
    },

    close() {
      this.dialog = false
      this.statusProcessing = 'insert'
      setTimeout(() => {
        this.form = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save(type = 'all', row = null) {
      const form = this.form
      const status = this.statusProcessing

      if (status === 'insert') {
        this.store('post', '/api/master/permissions', form, 'insert', type)
      } else if (status === 'update') {
        this.store(
          'put',
          '/api/master/permissions/' + this.form.parent_id,
          form,
          'update',
          type
        )
      }
    },

    store(method, url, data, type, column = 'all') {
      const vm = this
      vm.submitLoad = true
      this.$axios({ method, url, data })
        .then((res) => {
          this.dialog = false
          this.submitLoad = false
          this.message = res.data.message
          setTimeout(() => (this.message = false), 8000)
          this.$nuxt.$emit('getMenu', 'nice payload')
          this.getDataFromApi()
        })
        // eslint-disable-next-line node/handle-callback-err
        .catch((err) => {
          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })

          vm.submitLoad = false
        })
    },

    changeCrud(value) {
      if (value === 'Y') {
        this.form.index = 'Y'
        this.form.store = 'Y'
        this.form.edits = 'Y'
        this.form.erase = 'Y'
      } else {
        this.form.index = ''
        this.form.store = ''
        this.form.edits = ''
        this.form.erase = ''
      }
    },
  },
}
</script>

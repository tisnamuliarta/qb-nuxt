<template>
  <v-layout>
    <v-flex sm12>
      <div class="pl-4 pt-2">
        <span class="font-weight-medium text-h6"
          >{{ $t('Account Mapping') }}
        </span>
      </div>
      <LazyMainToolbar
        title="Account Mapping"
        show-new-data
        show-back-link
        new-data-text="New Mapping"
        @getDataFromApi="getAccountMapping"
        @newData="newData"
      />
      <div class="mt-0">
        <div id="parentContainer" style="height: 70vh !important">
          <hot-table
            ref="detailsTableSimple"
            :root="detailsRoot"
            :settings="settings"
          ></hot-table>
        </div>
      </div>

      <AccountingDialogAccount
        ref="dialogAccount"
        @selectItems="selectItems"
      ></AccountingDialogAccount>
    </v-flex>
  </v-layout>
</template>

<script>
import { HotTable } from '@handsontable/vue'
// import the base only
// import * as dom from 'handsontable/helpers/dom'
// choose cell types you want to use and import them
import {
  registerCellType,
  DropdownCellType,
  NumericCellType,
  CheckboxCellType,
  HandsontableCellType,
} from 'handsontable/cellTypes'

// editor modules
import {
  registerEditor, // editors' registering function
  SelectEditor,
} from 'handsontable/editors'

// choose plugins you want to use and import them
import {
  registerPlugin,
  ManualColumnResize,
  CopyPaste,
  PersistentState,
  HiddenColumns,
  HiddenRows,
  DropdownMenu,
  AutoColumnSize,
} from 'handsontable/plugins'

import { registerRenderer } from 'handsontable/renderers'

import 'handsontable/dist/handsontable.full.css'
// register imported cell types and plugins
registerCellType(DropdownCellType)
registerCellType(HandsontableCellType)
registerCellType(NumericCellType)
registerCellType(CheckboxCellType)

registerEditor(SelectEditor)

registerPlugin(ManualColumnResize)
registerPlugin(CopyPaste)
registerPlugin(PersistentState)
registerPlugin(HiddenColumns)
registerPlugin(HiddenRows)
registerPlugin(DropdownMenu)
registerPlugin(AutoColumnSize)

registerRenderer(
  'ButtonAddRenderer',
  function (hotInstance, td, row, column, prop, value, cellProperties) {
    let button = null
    const vm = window.displayTableSimple
    button = document.createElement('button')
    button.type = 'button'
    button.innerHTML = '<span class="mdi mdi-arrow-right-bold"></span>'
    button.className = 'btnNPB'
    button.value = 'Details'

    button.addEventListener('mousedown', (event) => {
      event.preventDefault()
      vm.$refs.dialogAccount.openDialog(row)
    })

    // dom.empty(td)
    td.innerText = ''
    td.appendChild(button)
    return td
  }
)

export default {
  name: 'AccountMapping',

  components: {
    HotTable,
  },

  data() {
    return {
      url: '/api/financial/account-mapping',
      detailsRoot: 'detailsRoot',
      settings: {
        licenseKey: 'non-commercial-and-evaluation',
      },
    }
  },

  activated() {
    // this.getAccounts()
    this.getAccountMapping()
  },

  created() {
    this.setInstance()
  },

  methods: {
    setInstance() {
      window.displayTableSimple = this
    },

    newData() {
      const vm = this
      const details = {}
      const clearData = this.$refs.detailsTableSimple.hotInstance.getSourceData()
      clearData.forEach(function (item, key) {
        if (!vm.$refs.detailsTableSimple.hotInstance.isEmptyRow(key)) details[key] = item
      })

      this.$nuxt.$loading.start()
      this.$axios
        .post(this.url, details)
        .then((res) => {
          this.getAccountMapping()
        })
        .catch((err) => {
          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })
        })
        .finally(() => {
          this.$nuxt.$loading.finish()
        })
    },

    getAccountMapping() {
      this.$axios
        .get(this.url)
        .then((res) => {
          setTimeout(() => {
            this.setDataToDetails(
              res.data.data,
              res.data.colHeaders,
              res.data.columns
            )
          }, 300)
        })
        .catch((err) => {
          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })
        })
    },

    updateTableSettings(colHeaders, columns) {
      // const listVat = this.$auth.$storage.getState('tax_row')
      this.$refs.detailsTableSimple.hotInstance.updateSettings({
        licenseKey: 'non-commercial-and-evaluation',
        colHeaders,
        columns,
        // height: '70vh',
        currentRowClassName: 'currentRow',
        currentColClassName: 'currentCol',
        startRows: 2,
        rowHeaders: true,
        manualColumnResize: true,
        rowHeights: 28,
        viewportRowRenderingOffset: 1000,
        viewportColumnRenderingOffset: 100,
        colWidths: 80,
        persistentState: true,
        width: '100%',
        height: '70vh',
        stretchH: 'all',
        // nestedRows: true,
        // preventOverflow: 'horizontal',
        hiddenColumns: {
          copyPasteEnabled: false,
          indicator: false,
          columns: [0, 1],
        },
      })
    },

    setDataToDetails(data, colHeaders, columns) {
      const vm = this
      setTimeout(() => {
        this.updateTableSettings(colHeaders, columns)
        vm.$refs.detailsTableSimple.hotInstance.loadData(data)
      }, 500)
      // this.$refs.detailsTableSimple.hotInstance.batch(() => {
      //   this.updateTableSettings(colHeaders, columns)
      //   vm.$refs.detailsTableSimple.hotInstance.loadData(data)
      //   // this.$nuxt.$loading.finish()
      // })
    },

    selectItems(data) {
      const rowData = data.row
      const selected = data.selected
      this.$refs.detailsTableSimple.hotInstance.setDataAtRowProp(
        rowData,
        'account_id',
        selected[0].id
      )
      this.$refs.detailsTableSimple.hotInstance.setDataAtRowProp(
        rowData,
        'account',
        selected[0].code
      )
      this.$refs.detailsTableSimple.hotInstance.setDataAtRowProp(
        rowData,
        'account_name',
        selected[0].name
      )
    },

    openDialog(row) {
      this.$refs.dialogAccount.openDialog(row)
    },

    getForm() {
      return this.form
    },

    setForm(form) {
      this.form = Object.assign({}, form)
      this.getAccountMapping()
    },
  },
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div id="parentContainer" class="scroll-container-min">
          <hot-table
            ref="details"
            :root="detailsRoot"
            :settings="settings"
          ></hot-table>
        </div>
      </v-col>
    </v-row>
  </v-container>
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
    const vm = window.details
    button = document.createElement('button')
    button.type = 'button'
    button.innerHTML = '<span class="mdi mdi-arrow-right-bold"></span>'
    button.className = 'btnNPB'
    button.value = 'Details'

    button.addEventListener('mousedown', (event) => {
      event.preventDefault()
      vm.$emit('openDialog', row)
    })

    // dom.empty(td)
    td.innerText = ''
    td.appendChild(button)
    return td
  }
)

registerRenderer(
  'ButtonDeleteRenderer',
  function (hotInstance, td, row, column, prop, value, cellProperties) {
    let button = null
    const vm = window.details
    if (vm.form.status !== 'closed' && vm.form.status !== 'cancel') {
      button = document.createElement('button')
      button.type = 'button'
      // button.innerText = '-'
      button.innerHTML = '<span class="mdi mdi-delete"></span>'
      // button.innerHTML = 'Delete'
      button.className = 'btnDelete'
      button.value = 'Details2'

      button.addEventListener('mousedown', (event) => {
        event.preventDefault()
        vm.removeRow(row)
      })

      // dom.empty(td)
      td.innerText = ''
      td.appendChild(button)
    }
    return td
  }
)

// Deselect column after click on input.
const doNotSelectColumn = function (event, coords) {
  if (coords.row === -1 && event.target.nodeName === 'TD') {
    event.stopImmediatePropagation()
    event.stopPropagation()
    this.deselectCell()
  }
}

export default {
  name: 'FormTable',

  components: {
    HotTable,
  },

  data() {
    return {
      detailsRoot: 'detailsRoot',
      settings: {
        licenseKey: 'non-commercial-and-evaluation',
      },
    }
  },

  created() {
    this.setInstance()
  },

  methods: {
    setInstance() {
      window.details = this
    },

    removeRow(row) {
      this.$refs.details.hotInstance.alter('remove_row', row)
    },

    addLine() {
      const totalRow = this.$refs.details.hotInstance.countRows()
      this.$refs.details.hotInstance.alter('insert_row', totalRow + 1, 5)
    },

    getAddData() {
      return this.$refs.details.hotInstance.getSourceData()
    },

    checkIfEmptyRow(key) {
      return this.$refs.details.hotInstance.isEmptyRow(key)
    },

    setDataAtRowProp(row, prop, value) {
      this.$refs.details.hotInstance.setDataAtRowProp(row, prop, value)
    },

    updateTableSettings(colHeaders, columns) {
      // const listVat = this.$auth.$storage.getState('tax_row')
      this.$refs.details.hotInstance.updateSettings({
        licenseKey: 'non-commercial-and-evaluation',
        colHeaders,
        columns,
        height: '70vh',
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
        preventOverflow: 'horizontal',
        // height: '28vh',
        stretchH: 'all',
        nestedRows: true,
        // preventOverflow: 'horizontal',
        hiddenColumns: {
          copyPasteEnabled: false,
          indicator: false,
          columns: [0, 1],
        },
        beforeOnCellMouseDown: doNotSelectColumn,
        beforeRefreshDimensions() {
          return false
        }
      })
    },

    setDataToDetails(data, colHeaders, columns) {
      const vm = this
      this.$refs.details.hotInstance.batch(() => {
        this.updateTableSettings(colHeaders, columns)
        vm.$refs.details.hotInstance.loadData(data)
        this.$nuxt.$loading.finish()
      })
    },
  },
}
</script>

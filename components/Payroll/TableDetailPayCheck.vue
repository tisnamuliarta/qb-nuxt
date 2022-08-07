<template>
  <div id="parentContainer" class="scroll-container-min">
    <hot-table
      ref="details"
      :root="detailsRoot"
      :settings="settings"
    ></hot-table>
  </div>
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

// Deselect column after click on input.
const doNotSelectColumn = function (event, coords) {
  if (coords.row === -1 && event.target.nodeName === 'TD') {
    event.stopImmediatePropagation()
    event.stopPropagation()
    this.deselectCell()
  }
}

// const listVat = $auth.$storage.getState('tax_row')

export default {
  name: 'TableDetailProduction',

  components: {
    HotTable,
  },

  data() {
    return {
      commissionRate: 1,
      plannedQty: 1,
      settings: {
        licenseKey: 'non-commercial-and-evaluation',
        currentRowClassName: 'currentRow',
        currentColClassName: 'currentCol',
        startRows: 1,
        rowHeaders: true,
        manualColumnResize: true,
        rowHeights: 28,
        viewportRowRenderingOffset: 1000,
        viewportColumnRenderingOffset: 100,
        colWidths: 80,
        persistentState: true,
        width: '100%',
        height: 'auto',
        // height: '28vh',
        stretchH: 'all',
        // preventOverflow: 'horizontal',
        hiddenColumns: {
          copyPasteEnabled: false,
          indicator: false,
          columns: [0],
        },
        beforeOnCellMouseDown: doNotSelectColumn,
      },
      detailsRoot: 'detailsRoot',
      colHeaders: [],
      form: {},
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

    updateTableSettings(columns, colHeaders) {
      // const listVat = this.$auth.$storage.getState('tax_row')
      this.$refs.details.hotInstance.updateSettings({
        colHeaders,
        columns,
        licenseKey: 'non-commercial-and-evaluation',
        height: 'auto',
        beforeRefreshDimensions() {
          return false
        },
        beforeOnCellMouseDown: doNotSelectColumn,
        afterRemoveRow: (index, amount, physicalRow, source) => {
          const vm = window.details
          vm.calculateTotal()
        },
        beforeRemoveRow: (index, amount, physicalRow, source) => {
          const vm = window.details
          const id = []
          physicalRow.forEach(function (index, value) {
            const entry = vm.$refs.details.hotInstance.getDataAtCell(index, 0)
            if (entry) {
              id.push(entry)
            }
          })
          const countRows = vm.$refs.details.hotInstance.countRows()
          if (countRows === 1) {
            vm.$emit('calcTotal', {
              subTotal: 0,
              amount: 0,
              discountAmount: 0,
              taxDetail: [],
            })
          }

          if (id.length > 0) {
            vm.$emit('removeData', {
              id,
            })
          }
          return true
        },

        afterChange: (changes, source) => {
          const vm = window.details
          if (changes) {
            let propNew = 0
            changes.forEach(([row, prop, oldValue, newValue]) => {
              propNew = prop
              if (propNew === 'base_qty' || propNew === 'amount') {
                if (oldValue !== newValue) {
                  vm.calculateTotal()
                }
              }
            })
          }
        },

        beforeRender(isForced) {
          const vm = window.details
          vm.$nuxt.$loading.start()
        },

        afterRender: (isForced) => {
          const vm = window.details
          vm.$nuxt.$loading.finish()
        },

        afterLoadData: (sourceData, initialLoad, source) => {},
      })
    },

    selectItems(data) {
      let rowData = data.row
      const selected = data.selected
      const vm = this

      this.$refs.details.hotInstance.batch(() => {
        selected.forEach(function (item, index) {
          const narration = item.description ? item.description : item.name
          // const taxName = sales.includes(type) ? salesTax : null

          vm.$refs.details.hotInstance.setDataAtRowProp([
            [rowData, 'item_code', item.code],
            [rowData, 'item_id', item.id],
            [rowData, 'unit', item.unit],
            [rowData, 'whs_code', item.whs_code],
            [rowData, 'narration', narration],
            [rowData, 'base_qty', 1],
          ])
          rowData++
        })
      })
    },

    selectAccount(data) {
      const rowData = data.row
      const selected = data.selected
      this.$refs.details.hotInstance.setDataAtRowProp(
        rowData,
        'account_id',
        selected[0].id
      )
      this.$refs.details.hotInstance.setDataAtRowProp(
        rowData,
        'account_code',
        selected[0].code
      )
    },

    setDataToDetails(data, form, columns, colHeaders) {
      const vm = this
      this.form = form
      this.$refs.details.hotInstance.batch(() => {
        this.updateTableSettings(columns, colHeaders)
        const items = form.line_items.length > 0 ? form.line_items : data
        vm.$refs.details.hotInstance.loadData(items)
        // vm.calculateTotal()
        this.$nuxt.$loading.finish()
        // this.calculateTotal()
      })
      // setTimeout(() => {
      //   vm.$refs.details.hotInstance.loadData(data)
      // }, 20)
    },

    setCommission(value) {
      this.$refs.details.hotInstance.batch(() => {
        this.commissionRate = value
        this.calculateTotal()
      })
    },

    setQty(qty) {
      this.$refs.details.hotInstance.batch(() => {
        this.plannedQty = qty
        this.calculateTotal()
      })
    },

    calculateTotal() {
      const countRows = this.$refs.details.hotInstance.countRows()
      // console.log(countRows)
      let subTotal = 0
      if (countRows > 0) {
        for (let i = 0; i < countRows; i++) {
          this.$refs.details.hotInstance.batch(() => {
            const qty = parseFloat(this.plannedQty  / countRows)
            const unitPrice = parseFloat(this.commissionRate)

            this.$refs.details.hotInstance.setDataAtRowProp(
              i,
              'amount',
              unitPrice
            )

            this.$refs.details.hotInstance.setDataAtRowProp(
              i,
              'base_qty',
              qty
            )

            const subTotalRow = qty * unitPrice
            subTotal = subTotal + qty * unitPrice

            this.$refs.details.hotInstance.setDataAtRowProp(
              i,
              'sub_total',
              subTotalRow
            )
          })
        }
      }
      this.$emit('calcTotal', {
        subTotal,
      })
    },

    async getTaxRate(tax) {
      const taxRate = await this.$axios.get(`/api/financial/taxes/0`, {
        params: {
          name: tax,
        },
      })
      return taxRate.data.data.rows
    },

    getDataAtRowPro(row, prop) {
      return this.$refs.details.hotInstance.getDataAtRowProp(row, prop)
    },

    countRows() {
      return this.$refs.details.hotInstance.countRows()
    },

    checkIfEmptyRow(key) {
      return this.$refs.details.hotInstance.isEmptyRow(key)
    },

    getAddData(document) {
      if (document === '0') {
        const countRows = this.$refs.details.hotInstance.countRows()
        for (let i = 0; i < countRows; i++) {
          this.$refs.details.hotInstance.setDataAtRowProp(i, 'id', null)
        }
      }
      return this.$refs.details.hotInstance.getSourceData()
      // return this.$refs.details.hotInstance.getData()
    },
  },
}
</script>

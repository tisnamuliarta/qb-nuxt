<template>
  <div id="parentContainer" class="scroll-container-min">
    <hot-table
      ref="details"
      :root="detailsRoot"
      :settings="settings"
    ></hot-table>

    <LazyInventoryDialogItem
      ref="dialogItem"
      :view-data="true"
      :show-add-btn="false"
      @selectItems="selectItems"
    ></LazyInventoryDialogItem>

    <AccountingDialogAccount
      ref="dialogAccount"
      @selectItems="selectAccount"
    ></AccountingDialogAccount>
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
  name: 'TableDetailReceipt',

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
          columns: [0, 1, 2],
        },
        beforeOnCellMouseDown: doNotSelectColumn,
        colHeaders: [
          'Id',
          'Base ID',
          'account ID',
          '',
          'Item Code',
          'Description',
          'Qty',
          'Units',
          'Unit Price',
          'Warehouse',
          'Amount',
          '',
        ],
        columns: [
          {
            data: 'id',
            wordWrap: false,
          },
          {
            data: 'item_id',
            width: 150,
            readOnly: true,
            wordWrap: false,
          },
          {
            data: 'account_id',
            width: 150,
            readOnly: true,
            wordWrap: false,
          },
          {
            width: 20,
            wordWrap: false,
            renderer(
              hotInstance,
              td,
              row,
              column,
              prop,
              value,
              cellProperties
            ) {
              let button = null
              const vm = window.detailReceipt
              if (vm.form.status !== 'closed' && vm.form.status !== 'cancel') {
                button = document.createElement('button')
                button.type = 'button'
                button.innerHTML =
                  '<span class="mdi mdi-arrow-right-bold"></span>'
                button.className = 'btnNPB'
                button.value = 'Details'

                button.addEventListener('mousedown', (event) => {
                  const whs = vm.$refs.details.hotInstance.getDataAtRowProp(
                    row,
                    'whs_name'
                  )
                  event.preventDefault()
                  vm.$refs.dialogItem.openDialog(row, whs)
                })

                // dom.empty(td)
                td.innerText = ''
                td.appendChild(button)
                return td
              }
            },
          },
          {
            data: 'code',
            width: 120,
            readOnly: true,
            wordWrap: false,
          },
          {
            data: 'narration',
            width: 250,
            wordWrap: false,
          },
          {
            data: 'quantity',
            width: 80,
            wordWrap: false,
            type: 'numeric',
            numericFormat: {
              pattern: '0,0',
            },
          },
          {
            data: 'unit',
            className: 'htCenter',
            width: 60,
            readOnly: true,
            wordWrap: false,
          },
          {
            data: 'amount',
            width: 100,
            wordWrap: false,
            type: 'numeric',
            numericFormat: {
              pattern: '0,0.00',
            },
          },
          {
            data: 'whs_name',
            width: 100,
            height: 26,
            wordWrap: false,
            editor: 'select',
            className: 'htCenter',
            selectOptions: () => {
              const vm = window.detailReceipt
              return vm.$auth.$storage.getState('warehouse')
            },
            visibleRows: 5,
            strict: true,
            filter: false,
            allowInvalid: false,
          },
          {
            data: 'sub_total',
            width: 100,
            wordWrap: false,
            type: 'numeric',
            readOnly: true,
            numericFormat: {
              pattern: '0,0.00',
            },
          },
          {
            width: 20,
            wordWrap: false,
            renderer(
              hotInstance,
              td,
              row,
              column,
              prop,
              value,
              cellProperties
            ) {
              let button = null
              const vm = window.detailReceipt
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
            },
          },
        ],
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
      window.detailReceipt = this
    },

    removeRow(row) {
      this.$refs.details.hotInstance.alter('remove_row', row)
    },

    addLine() {
      const totalRow = this.$refs.details.hotInstance.countRows()
      this.$refs.details.hotInstance.alter('insert_row', totalRow + 1, 1)
    },

    updateTableSettings(header) {
      // const listVat = this.$auth.$storage.getState('tax_row')
      this.$refs.details.hotInstance.updateSettings({
        licenseKey: 'non-commercial-and-evaluation',
        height: 'auto',
        beforeRefreshDimensions() {
          return false
        },
        beforeOnCellMouseDown: doNotSelectColumn,
        afterRemoveRow: (index, amount, physicalRow, source) => {
          const vm = window.detailReceipt
          vm.calculateTotal()
        },
        beforeRemoveRow: (index, amount, physicalRow, source) => {
          const vm = window.detailReceipt
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
          const vm = window.detailReceipt
          if (changes) {
            let propNew = 0
            changes.forEach(([row, prop, oldValue, newValue]) => {
              propNew = prop
              if (propNew === 'quantity' || propNew === 'amount') {
                if (oldValue !== newValue) {
                  vm.calculateTotal()
                }
              }
            })
          }
        },
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
            [rowData, 'code', item.code],
            [rowData, 'item_id', item.id],
            [rowData, 'unit', item.unit],
            [rowData, 'whs_name', item.whs_name],
            [rowData, 'narration', narration],
            [rowData, 'quantity', 1],
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

    setDataToDetails(data, form) {
      const vm = this
      this.form = form
      this.$refs.details.hotInstance.batch(() => {
        this.updateTableSettings()
        const items = form.line_items.length > 0 ? form.line_items : data
        vm.$refs.details.hotInstance.loadData(items)
        // vm.calculateTotal()
        if (form.line_items.length === 0) {
          const countRows = this.$refs.details.hotInstance.countRows()
          for (let i = 0; i < countRows; i++) {
            this.$refs.details.hotInstance.setDataAtRowProp(
              i,
              'whs_name',
              vm.form.warehouse_name
            )
          }
        }
        this.$nuxt.$loading.finish()
        // this.calculateTotal()
      })
      // setTimeout(() => {
      //   vm.$refs.details.hotInstance.loadData(data)
      // }, 20)
    },

    calculateTotal() {
      const countRows = this.$refs.details.hotInstance.countRows()
      let subTotal = 0
      if (countRows > 0) {
        for (let i = 0; i < countRows; i++) {
          this.$refs.details.hotInstance.batch(() => {
            const qty = this.$refs.details.hotInstance.getDataAtRowProp(
              i,
              'quantity'
            )

            const amount = this.$refs.details.hotInstance.getDataAtRowProp(
              i,
              'amount'
            )

            const subTotalRow = qty * amount
            subTotal = subTotal + qty * amount

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

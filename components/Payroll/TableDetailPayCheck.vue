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
          columns: [0, 1],
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
      window.detailPayCheck = this
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
      // const countCols = this.$refs.details.hotInstance.countCols()
      // let columnSummary = []
      // if (countCols > 0) {
      //   for (let i = 0; i < countCols; i++) {
      //     if (i > 3) {
      //       const summary = [
      //         {
      //           // destinationRow: 0,
      //           // reversedRowCoords: true,
      //           destinationColumn: i,
      //           type: 'sum',
      //         },
      //       ]

      //       columnSummary = [...summary]
      //     }
      //   }
      // }
      // console.log(columnSummary)
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
          const vm = window.detailPayCheck
          vm.calculateTotal()
        },
        beforeRemoveRow: (index, amount, physicalRow, source) => {
          const vm = window.detailPayCheck
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
          const vm = window.detailPayCheck
          if (changes) {
            let propNew = 0
            let prevRow
            const cellChanges = []
            changes.forEach(([row, prop, oldValue, newValue]) => {
              propNew = prop
              if (
                propNew !== 'payroll_id' ||
                propNew !== 'employee_name' ||
                propNew !== 'employee_id' ||
                propNew !== 'salary' ||
                propNew !== 'sub_total'
              ) {
                const total = 0

                const cellChange = [row, prop, oldValue, newValue, total]
                if (oldValue !== newValue) {
                  prevRow = changes[0][0]
                  cellChanges.push(cellChange)
                }
              }

              // if (
              //   propNew !== 'payroll_id' ||
              //   propNew !== 'employee_name' ||
              //   propNew !== 'employee_id' ||
              //   propNew !== 'salary' ||
              //   propNew !== 'sub_total'
              // ) {
              //   if (oldValue !== newValue) {
              //     vm.calculateTotal()
              //   }
              // }
            })

            if (
              propNew !== 'payroll_id' ||
              propNew !== 'employee_name' ||
              propNew !== 'employee_id' ||
              propNew !== 'salary' ||
              propNew !== 'sub_total'
            ) {
              const clearChanges = []
              let count = 0
              let changeIt = false
              for (let j = 0, length2 = cellChanges.length; j < length2; j++) {
                const row = cellChanges[j][0]
                // console.log(row)
                if (row !== '10') {
                  changeIt = true
                  if (prevRow === row) {
                    count = count + 1
                  } else {
                    prevRow = row
                    count = 0
                  }
                  if (count === 1) {
                    clearChanges.push(cellChanges[j])
                  }
                }
              }

              if (changeIt) {
                for (
                  let k = 0, length3 = clearChanges.length;
                  k < length3;
                  k++
                ) {
                  vm.calculateTotal()
                }
              }
            }
          }
        },

        beforeRender(isForced) {
          const vm = window.detailPayCheck
          vm.$nuxt.$loading.start()
        },

        afterRender: (isForced) => {
          const vm = window.detailPayCheck
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

    setCommission(commission) {
      this.commissionRate = commission
      const countRows = this.$refs.details.hotInstance.countRows()
      if (countRows > 0) {
        for (let i = 0; i < countRows; i++) {
          this.$refs.details.hotInstance.batch(() => {
            const employee = this.$refs.details.hotInstance.getDataAtRowProp(
              i,
              'employee_name'
            )
            commission.forEach((item, index) => {
              if (employee === item.employee_name) {
                this.$refs.details.hotInstance.setDataAtRowProp(
                  i,
                  'Komisi',
                  item.amount
                )
              }
            })
          })
        }

        setTimeout(() => {
          this.calculateTotal()
        }, 500)
      }
    },

    setQty(qty) {
      this.$refs.details.hotInstance.batch(() => {
        this.plannedQty = qty
        this.calculateTotal()
      })
    },

    calculateTotal() {
      const countRows = this.$refs.details.hotInstance.countRows()
      let subTotal = 0
      if (countRows > 0) {
        for (let i = 0; i < countRows; i++) {
          this.$refs.details.hotInstance.batch(() => {
            let subTotalRow = 0
            const sourceData =
              this.$refs.details.hotInstance.getSourceDataAtRow(i)
            for (const [key] of Object.entries(sourceData)) {
              if (
                key !== 'payroll_id' &&
                key !== 'employee_id' &&
                key !== 'employee_name' &&
                key !== 'payment_method' &&
                key !== 'pay_type_id' &&
                key !== 'sub_total'
              ) {
                const amount = this.$refs.details.hotInstance.getDataAtRowProp(
                  i,
                  key
                )

                subTotal = subTotal + parseFloat(amount)
                subTotalRow = subTotalRow + parseFloat(amount)
              }
            }

            // console.log(subTotalRow)

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
      return this.$refs.details.hotInstance.getSourceData()
      // return this.$refs.details.hotInstance.getData()
    },
  },
}
</script>

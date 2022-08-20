<template>
  <div id="parentContainer" class="scroll-container-min">
    <hot-table
      ref="details"
      :root="detailsRoot"
      :settings="settings"
    ></hot-table>

    <LazyInventoryDialogResource
      ref="dialogResource"
      :view-data="true"
      :show-add-btn="false"
      @selectItems="selectItems"
    ></LazyInventoryDialogResource>

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
  'ButtonAddAccountRenderer',
  function (hotInstance, td, row, column, prop, value, cellProperties) {
    let button = null
    const vm = window.detailProduction
    if (vm.form.status !== 'closed' && vm.form.status !== 'cancel') {
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
          columns: [0, 1, 2],
        },
        beforeOnCellMouseDown: doNotSelectColumn,
        colHeaders: [
          'Id',
          'Base ID',
          'account ID',
          'Type',
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
            data: 'item_type',
            width: 60,
            height: 26,
            wordWrap: false,
            editor: 'select',
            selectOptions: ['item', 'resource'],
            visibleRows: 5,
            strict: true,
            filter: false,
            allowInvalid: false,
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
              const vm = window.detailProduction
              if (vm.form.status === 'planned') {
                button = document.createElement('button')
                button.type = 'button'
                button.innerHTML =
                  '<span class="mdi mdi-arrow-right-bold"></span>'
                button.className = 'btnNPB'
                button.value = 'Details'

                button.addEventListener('mousedown', (event) => {
                  event.preventDefault()
                  const itemType =
                    vm.$refs.details.hotInstance.getDataAtRowProp(
                      row,
                      'item_type'
                    )

                  if (!itemType) {
                    vm.$swal({
                      type: 'error',
                      title: 'Error',
                      text: 'Please select item type first!',
                    })
                  }

                  if (itemType === 'item') {
                    vm.$refs.dialogItem.openDialog(row, vm.form.warehouse_id)
                  } else if (itemType === 'resource') {
                    vm.$refs.dialogResource.openDialog(row)
                  }
                })

                // dom.empty(td)
                td.innerText = ''
                td.appendChild(button)
                return td
              }
            },
          },
          {
            data: 'item_code',
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
            data: 'base_qty',
            // readOnly: true,
            width: 80,
            wordWrap: false,
            type: 'numeric',
            numericFormat: {
              pattern: '0,0.00',
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
            // readOnly: true,
            numericFormat: {
              pattern: '0,0.00',
            },
          },
          {
            data: 'whs_code',
            width: 100,
            height: 26,
            wordWrap: false,
            editor: 'select',
            className: 'htCenter',
            selectOptions: () => {
              const vm = window.detailProduction
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
              const vm = window.detailProduction
              if (vm.form.status === 'planned') {
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
        // cells(row, col, prop) {
        //   // const vm = window.detailProduction
        //   const cellProperties = {}
        //   const itemType = this.instance.getDataAtRowProp(row, 'item_type')

        //   if (itemType === 'resource') {
        //     if (prop === 'base_qty') {
        //       cellProperties.readOnly = true
        //     }
        //     if (prop === 'amount') {
        //       cellProperties.readOnly = true
        //     }
        //   } else if (itemType === 'item') {
        //     if (prop === 'base_qty') {
        //       cellProperties.readOnly = false
        //     }
        //     if (prop === 'amount') {
        //       cellProperties.readOnly = false
        //     }
        //   }
        //   return cellProperties
        // },
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
      window.detailProduction = this
    },

    removeRow(row) {
      this.$refs.details.hotInstance.alter('remove_row', row)
    },

    addLine() {
      const totalRow = this.$refs.details.hotInstance.countRows()
      this.$refs.details.hotInstance.alter('insert_row', totalRow + 1, 1)
      this.$refs.details.hotInstance.setDataAtRowProp([
        [totalRow, 'item_type', 'resource', 'edit'],
      ])
    },

    updateTableSettings(header) {
      // const listVat = this.$auth.$storage.getState('tax_row')
      this.$refs.details.hotInstance.batch(() => {
        this.$refs.details.hotInstance.updateSettings({
          licenseKey: 'non-commercial-and-evaluation',
          height: 'auto',
          beforeRefreshDimensions() {
            return false
          },
          beforeOnCellMouseDown: doNotSelectColumn,
          afterRemoveRow: (index, amount, physicalRow, source) => {
            const vm = window.detailProduction
            vm.calculateTotal()
          },
          beforeRemoveRow: (index, amount, physicalRow, source) => {
            const vm = window.detailProduction
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
            const vm = window.detailProduction
            if (changes) {
              let propNew = 0
              let prevRow
              const cellChanges = []
              // changes.forEach(([row, prop, oldValue, newValue]) => {
              //   propNew = prop
              //   const cellChange = [row, prop, oldValue, newValue, 0]
              //   if (propNew === 'base_qty' || propNew === 'amount') {
              //     if (oldValue !== newValue) {
              //       cellChanges.push(cellChange)
              //       // vm.calculateTotal()
              //     }
              //   }
              // })

              // if (propNew === 'base_qty' || propNew === 'amount') {
              //   for (
              //     let j = 0, length2 = cellChanges.length;
              //     j < length2;
              //     j++
              //   ) {
              //     vm.calculateTotal()
              //   }
              // }

              changes.forEach(([row, prop, oldValue, newValue]) => {
                propNew = prop
                if (propNew === 'base_qty' || propNew === 'amount') {
                  const tblQty = vm.$refs.details.hotInstance.getDataAtCell(
                    row,
                    7
                  )
                  const qty = tblQty || 0

                  const tblUnitPrice =
                    vm.$refs.details.hotInstance.getDataAtCell(row, 9)
                  const unitPrice = tblUnitPrice || 0
                  const total = qty * unitPrice

                  const cellChange = [row, prop, oldValue, newValue, total]
                  if (oldValue !== newValue) {
                    prevRow = changes[0][0]
                    cellChanges.push(cellChange)
                  }
                }
              })

              if (propNew === 'base_qty' || propNew === 'amount') {
                const clearChanges = []
                let count = 0
                let changeIt = false
                for (
                  let j = 0, length2 = cellChanges.length;
                  j < length2;
                  j++
                ) {
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
        })
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
          const itemType =
            item.resource_type === undefined ? 'item' : 'resource'
          const amount = itemType === 'item' ? item.purchase_price : 0
          vm.$refs.details.hotInstance.setDataAtRowProp([
            [rowData, 'item_type', itemType, 'edit'],
            [rowData, 'amount', amount, 'edit'],
            [rowData, 'item_code', item.code, 'edit'],
            [rowData, 'item_id', item.id, 'edit'],
            [rowData, 'unit', item.unit, 'edit'],
            [rowData, 'whs_code', item.whs_code, 'edit'],
            [rowData, 'narration', narration, 'edit'],
            [rowData, 'base_qty', 1, 'edit'],
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
      let productCost = 0
      let componentCost = 0
      let countResource = 0

      if (countRows > 0) {
        this.$refs.details.hotInstance.batch(() => {
          this.$refs.details.hotInstance.suspendExecution()
          for (let i = 0; i < countRows; i++) {
            const itemType = this.$refs.details.hotInstance.getDataAtRowProp(
              i,
              'item_type'
            )

            if (itemType === 'resource') {
              countResource++
            }
          }

          for (let i = 0; i < countRows; i++) {
            const itemType = this.$refs.details.hotInstance.getDataAtRowProp(
              i,
              'item_type'
            )
            const itemCode = this.$refs.details.hotInstance.getDataAtRowProp(
              i,
              'item_code'
            )
            let qty = 0
            let unitPrice = 0
            if (itemType === 'resource') {
              if (itemCode) {
                qty = parseFloat(this.plannedQty / countResource)
                unitPrice = parseFloat(this.commissionRate / countResource)
                this.$refs.details.hotInstance.setDataAtCell([
                  // [i, 'base_qty', qty, 'edit'],
                  // [i, 'amount', unitPrice, 'edit'],
                  [i, 7, qty, 'edit'],
                  [i, 9, unitPrice, 'edit'],
                ])
              } else {
                qty = this.$refs.details.hotInstance.getDataAtRowProp(
                  i,
                  'base_qty'
                )
                unitPrice = this.$refs.details.hotInstance.getDataAtRowProp(
                  i,
                  'amount'
                )
              }
              componentCost = componentCost + qty * unitPrice
            } else {
              qty = this.$refs.details.hotInstance.getDataAtRowProp(
                i,
                'base_qty'
              )
              unitPrice = this.$refs.details.hotInstance.getDataAtRowProp(
                i,
                'amount'
              )

              productCost = productCost + qty * unitPrice
            }

            const subTotalRow = qty * unitPrice
            subTotal = subTotal + qty * unitPrice

            this.$refs.details.hotInstance.setDataAtRowProp([
              [i, 'sub_total', subTotalRow, 'edit'],
            ])
          }
          this.$refs.details.hotInstance.resumeExecution()
        })
      }
      this.$emit('calcTotal', {
        subTotal,
        productCost,
        componentCost,
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

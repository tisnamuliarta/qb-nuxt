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
  name: 'TableDetail',

  components: {
    HotTable,
  },

  data() {
    return {
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
          columns: [1, 2, 3],
        },
        beforeOnCellMouseDown: doNotSelectColumn,
        dataSchema: {
          id: null,
          item_id: null,
          sku: null,
          name: null,
          description: null,
          quantity: 0,
          unit: null,
          default_currency_symbol: null,
          vat_inclusive: 0,
          price: 0,
          discount_rate: 0,
          tax_name: '',
          total: 0,
        },
        colHeaders: [
          '#',
          'Id',
          'Item ID',
          'Item Code',
          'Item Code',
          'Description',
          'Qty',
          'Units',
          'Currency',
          'Vat Inclusive',
          'Unit Price',
          'Discount',
          'Tax',
          'Warehouse',
          'Amount',
          '',
        ],
        columns: [
          // TODO
          {
            width: 30,
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
              const vm = window.details
              if (vm.form.status !== 'closed' && vm.form.status !== 'cancel') {
                button = document.createElement('button')
                button.type = 'button'
                button.innerHTML =
                  '<span class="mdi mdi-arrow-right-bold"></span>'
                button.className = 'btnNPB'
                button.value = 'Details'

                button.addEventListener('mousedown', (event) => {
                  event.preventDefault()
                  const warehouse =
                    vm.$refs.details.hotInstance.getDataAtRowProp(
                      row,
                      'whs_name'
                    )
                  vm.$refs.dialogItem.openDialog(row, warehouse)
                })

                // dom.empty(td)
                td.innerText = ''
                td.appendChild(button)
                return td
              }
            },
          },
          {
            data: 'id',
            wordWrap: false,
          },
          {
            data: 'item_id',
            wordWrap: false,
          },
          {
            data: 'base_line_id',
            width: 150,
            readOnly: true,
            wordWrap: false,
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
            data: 'default_currency_symbol',
            width: 60,
            readOnly: true,
            wordWrap: false,
            className: 'htCenter',
          },
          {
            data: 'vat_inclusive',
            type: 'checkbox',
            className: 'htCenter',
            checkedTemplate: 1,
            uncheckedTemplate: 0,
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
            data: 'discount_rate',
            width: 100,
            wordWrap: false,
            type: 'numeric',
            numericFormat: {
              pattern: '0,0.00',
            },
          },
          {
            data: 'tax_name',
            width: 100,
            // type: 'dropdown',
            height: 26,
            wordWrap: false,
            editor: 'select',
            className: 'htCenter',
            selectOptions: () => {
              const vm = window.details
              return vm.$auth.$storage.getState('tax')
            },
            visibleRows: 5,
            strict: true,
            filter: false,
            allowInvalid: false,
          },
          {
            data: 'whs_name',
            width: 100,
            height: 26,
            wordWrap: false,
            editor: 'select',
            className: 'htCenter',
            selectOptions: () => {
              const vm = window.details
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
            width: 40,
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
      window.details = this
    },

    removeRow(row) {
      this.$refs.details.hotInstance.alter('remove_row', row)
    },

    addLine() {
      const vm = this
      this.$refs.details.hotInstance.batch(() => {
        const totalRow = this.$refs.details.hotInstance.countRows()
        this.$refs.details.hotInstance.alter('insert_row', totalRow + 1, 1)
        this.$refs.details.hotInstance.setDataAtRowProp([
          [totalRow, 'whs_name', vm.form.warehouse_name],
        ])
      })
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
              if (
                propNew === 'quantity' ||
                propNew === 'amount' ||
                propNew === 'discount_rate' ||
                propNew === 'tax_name'
              ) {
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
      const type = this.form.transaction_type
      const vm = this
      // const purchase = ['PQ', 'PO', 'GR', 'BL','PY', 'DN', 'GN'];
      const sales = ['SQ', 'SO', 'SD', 'IN', 'RC', 'CN', 'SR']
      this.$refs.details.hotInstance.batch(() => {
        selected.forEach(function (item, index) {
          const salesTax = item.sales_tax != null ? item.sales_tax.name : null
          const price = sales.includes(type)
            ? item.sale_price
            : item.purchase_price

          const narration = item.description ? item.description : item.name
          // const taxName = sales.includes(type) ? salesTax : null

          vm.$refs.details.hotInstance.setDataAtRowProp([
            [rowData, 'code', item.code],
            [rowData, 'base_line_id', 0],
            [rowData, 'unit', item.unit],
            [rowData, 'narration', narration],
            [rowData, 'default_currency_symbol', vm.form.default_currency_code],
            [rowData, 'item_id', item.id],
            [rowData, 'amount', price],
            [rowData, 'tax_name', salesTax],
            [rowData, 'whs_name', item.whs_name],
            [rowData, 'quantity', 1],
          ])
          rowData++
        })
      })
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
      })
      // setTimeout(() => {
      //   vm.$refs.details.hotInstance.loadData(data)
      // }, 20)
    },

    calculateTotal() {
      const countRows = this.$refs.details.hotInstance.countRows()
      // console.log(countRows)
      let subTotal = 0
      let discountAmount = 0
      const taxDetail = []
      let amount = 0
      let amountRow = 0
      if (countRows > 0) {
        for (let i = 0; i < countRows; i++) {
          this.$refs.details.hotInstance.batch(() => {
            const qty = this.$refs.details.hotInstance.getDataAtRowProp(
              i,
              'quantity'
            )
            const unitPrice = this.$refs.details.hotInstance.getDataAtRowProp(
              i,
              'amount'
            )
            const discount = this.$refs.details.hotInstance.getDataAtRowProp(
              i,
              'discount_rate'
            )
            const tax = this.$refs.details.hotInstance.getDataAtRowProp(
              i,
              'tax_name'
            )

            const subTotalRow = qty * unitPrice
            subTotal = subTotal + qty * unitPrice

            const discountPerLine = parseFloat(
              (discount / 100) * subTotalRow
            ).toFixed(2)
            discountAmount =
              parseFloat(discountAmount) + parseFloat(discountPerLine)

            amountRow = subTotalRow - discountPerLine

            if (tax) {
              let taxRate = 0
              this.$auth.$storage
                .getState('tax_row')
                .forEach(function (item, index) {
                  if (item.name === tax) {
                    taxRate = parseFloat(item.rate)
                  }
                })

              const taxRow = (parseFloat(taxRate) / 100) * amountRow
              taxDetail.push({
                name: tax,
                amount: taxRow,
              })
            }

            amount = amount + (subTotalRow - discountPerLine)

            this.$refs.details.hotInstance.setDataAtRowProp(
              i,
              'sub_total',
              amountRow
            )
          })
        }
      }
      this.$emit('calcTotal', {
        subTotal,
        amount,
        discountAmount,
        taxDetail,
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

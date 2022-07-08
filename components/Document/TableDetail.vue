<template>
  <div>
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
    if (vm.form.status !== 'closed' && vm.form.status !== 'cancel') {
      button = document.createElement('button')
      button.type = 'button'
      button.innerHTML = '<span class="mdi mdi-arrow-right-bold"></span>'
      button.className = 'btnNPB'
      button.value = 'Details'

      button.addEventListener('mousedown', (event) => {
        event.preventDefault()
        vm.$refs.dialogItem.openDialog(row)
      })

      // dom.empty(td)
      td.innerText = ''
      td.appendChild(button)
      return td
    }
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
        startRows: 2,
        rowHeaders: true,
        manualColumnResize: true,
        rowHeights: 28,
        viewportRowRenderingOffset: 1000,
        viewportColumnRenderingOffset: 100,
        colWidths: 80,
        persistentState: true,
        width: '100%',
        height: '28vh',
        stretchH: 'all',
        // preventOverflow: 'horizontal',
        hiddenColumns: {
          copyPasteEnabled: false,
          indicator: false,
          columns: [1, 2, 3],
        },
        dataSchema: {
          id: null,
          item_id: null,
          sku: null,
          name: null,
          description: null,
          quantity: 0,
          unit: null,
          default_currency_symbol: null,
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
          'Item Name',
          'Description',
          'Qty',
          'Units',
          'Currency',
          'Unit Price',
          'Discount',
          'Tax',
          'Amount',
          '',
        ],
        columns: [
          // TODO
          {
            width: 30,
            wordWrap: false,
            renderer: 'ButtonAddRenderer',
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
            data: 'sku',
            width: 150,
            readOnly: true,
            wordWrap: false,
          },
          {
            data: 'name',
            width: 140,
            readOnly: true,
            wordWrap: false,
          },
          {
            data: 'narration',
            width: 350,
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
            width: 100,
            readOnly: true,
            wordWrap: false,
          },
          {
            data: 'default_currency_symbol',
            width: 100,
            readOnly: true,
            wordWrap: false,
            align: 'right',
          },
          {
            data: 'price',
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
            type: 'dropdown',
            height: 26,
            wordWrap: false,
            source(query, process) {
              const vm = window.details
              const data = vm.$auth.$storage.getLocalStorage('tax')
              process(data)
            },
            strict: true,
            filter: false,
            allowInvalid: false,
          },
          {
            data: 'amount',
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
            renderer: 'ButtonDeleteRenderer',
          },
        ],

        beforeRefreshDimensions() {
          return false
        },
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

    updateTableSettings(header) {
      this.$refs.details.hotInstance.updateSettings({
        licenseKey: 'non-commercial-and-evaluation',
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
                propNew === 'price' ||
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
      const type = this.form.type
      const vm = this
      this.$refs.details.hotInstance.batch(() => {
        selected.forEach(function (item, index) {
          const price =
            type.substr(0, 1) === 'S' ? item.sale_price : item.purchase_price
          const taxName =
            type.substr(0, 1) === 'S' ? item.sell_tax_name : item.buy_tax_name

          vm.$refs.details.hotInstance.setDataAtRowProp([
            [rowData, 'name', item.name],
            [rowData, 'sku', item.code],
            [rowData, 'unit', item.unit],
            [rowData, 'description', item.description],
            [
              rowData,
              'default_currency_symbol',
              vm.form.default_currency_symbol,
            ],
            [rowData, 'item_id', item.id],
            [rowData, 'price', price],
            [rowData, 'tax_name', taxName],
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
        const countRows = this.$refs.details.hotInstance.countRows()
        for (let i = 0; i < countRows; i++) {
          this.$refs.details.hotInstance.setDataAtRowProp(
            i,
            'default_currency_symbol',
            vm.form.default_currency_symbol
          )
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
              'price'
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
                .getLocalStorage('tax_row')
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
              'amount',
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

<template>
  <div>
    <div ref="table"></div>

    <LazyInventoryDialogItem
      ref="dialogItem"
      :view-data="true"
      :show-add-btn="false"
      @selectItems="selectItems"
    ></LazyInventoryDialogItem>
  </div>
</template>

<script>
import { TabulatorFull as Tabulator } from 'tabulator-tables' // import Tabulator library
// import 'tabulator-tables/src/scss/themes/tabulator_simple.scss'
import 'tabulator-tables/dist/css/tabulator_simple.css'

// Create Date Editor
// const dateEditor = function (cell, onRendered, success, cancel) {
//   // cell - the cell component for the editable cell
//   // onRendered - function to call when the editor has been rendered
//   // success - function to call to pass thesuccessfully updated value to Tabulator
//   // cancel - function to call to abort the edit and return to a normal cell

//   // create and style input
//   const cellValue = luxon.DateTime.fromFormat(
//       cell.getValue(),
//       'dd/MM/yyyy'
//     ).toFormat('yyyy-MM-dd');
//     const input = document.createElement('input')

//   input.setAttribute('type', 'date')

//   input.style.padding = '4px'
//   input.style.width = '100%'
//   input.style.boxSizing = 'border-box'

//   input.value = cellValue

//   onRendered(function () {
//     input.focus()
//     input.style.height = '100%'
//   })

//   function onChange() {
//     if (input.value != cellValue) {
//       success(
//         luxon.DateTime.fromFormat(input.value, 'yyyy-MM-dd').toFormat(
//           'dd/MM/yyyy'
//         )
//       )
//     } else {
//       cancel()
//     }
//   }

//   // submit new value on blur or change
//   input.addEventListener('blur', onChange)

//   // submit new value on enter
//   input.addEventListener('keydown', function (e) {
//     if (e.keyCode == 13) {
//       onChange()
//     }

//     if (e.keyCode == 27) {
//       cancel()
//     }
//   })

//   return input
// }

const printIcon = function (cell, formatterParams) {
  // plain text value
  return "<span class='mdi mdi-delete'></span>"
}

const addItemIcon = function (cell, formatterParams) {
  // plain text value
  return "<span class='mdi mdi-arrow-right-bold'></span>"
}

export default {
  name: 'TabulatorFull',
  data() {
    return {
      tabulator: null, // variable to hold your table
      tableData: [], // data for table to display
    }
  },
  mounted() {
    const vm = this
    // instantiate Tabulator when element is mounted
    this.tabulator = new Tabulator(this.$refs.table, {
      data: this.tableData, // link data to table
      reactiveData: true, // enable data reactivity
      height: '100%',
      layout: 'fitColumns',
      resizableColumnFit: true,
      columns: [
        {
          formatter: addItemIcon,
          hozAlign: 'center',
          width: 40,
          cellClick(e, cell) {
            // const row = cell.getRow()
            console.log(cell.getRow())
            vm.$refs.dialogItem.openDialog(cell.getRow().getData().index)
          },
          headerSort: false,
        },
        {
          formatter: 'rownum',
          hozAlign: 'center',
          width: 40,
          headerSort: false,
        },
        { title: 'Item Code', field: 'sku', resizable: true },
        {
          title: 'Description',
          field: 'description',
          editor: 'input',
          resizable: true,
          headerSort: false,
        },
        {
          title: 'Quantity',
          field: 'quantity',
          hozAlign: 'right',
          editor: 'number',
          headerSort: false,
        },
        { title: 'Unit', field: 'unit' },
        {
          title: 'Currency',
          field: 'default_currency_symbol',
          headerSort: false,
        },
        {
          title: 'Discount',
          field: 'discount_rate',
          hozAlign: 'right',
          editor: 'number',
          headerSort: false,
        },
        {
          title: 'Tax',
          field: 'tax_name',
          hozAlign: 'right',
          editor: 'number',
          headerSort: false,
        },
        {
          title: 'Total',
          field: 'total',
          hozAlign: 'right',
          editor: 'number',
          headerSort: false,
        },
        {
          formatter: printIcon,
          hozAlign: 'center',
          width: 40,
          headerSort: false,
          cellClick(e, cell) {
            vm.deleteRow(cell.getRow())
          },
        },
      ],
    })
  },

  methods: {
    deleteRow(row) {
      this.tabulator.deleteRow(row)
    },

    addLine(row) {
      for (let index = 0; index < row; index++) {
        this.tabulator.addRow({
          index,
          sku: null,
          description: null,
          unit: null,
          default_currency_symbol: null,
          quantity: null,
          discount_rate: null,
          tax_name: null,
          total: null,
        })
      }
    },

    selectItems(data) {
      console.log(data)
      let rowData = data.row
      const selected = data.selected
      // const type = this.form.type
      const vm = this
      selected.forEach(function (item, index) {
        vm.tabulator.updateRow(rowData, item)
        rowData++
      })
    },
  },
}
</script>

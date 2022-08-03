const formatter = {
  name: 'Formatter',
  formatPrice(value) {
    const val = (value / 1).toFixed(2).replace('.', ',')
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  },

  formatCheckBox(value) {
    if (value === '1') {
      return 'On'
    } else if (value === '0') {
      return 'Off'
    } else if (value) {
        return 'On'
      } else {
        return 'Off'
      }
  },

  statusColor(status) {
    switch (status) {
      case 'open':
      case 'planned':
        return 'blue darken-3'
      case 'partial':
      case 'released':
        return 'orange'
      case 'paid':
        return 'green'
      case 'closed':
        return 'green'
      case 'overdue':
        return 'red'
      case 'canceled':
        return 'red'
    }
  },

  mappingAction(type) {
    switch (type) {
      case 'SQ':
        return '/app/form/sales/quote'
      case 'SO':
        return '/app/form/sales/order'
      case 'SD':
        return '/app/form/sales/delivery'
      case 'IN':
        return '/app/form/sales/invoice'
      case 'RC':
        return '/app/form/sales/payment'
      case 'CN':
        return '/app/form/sales/creditmemo'
      case 'SR':
        return '/app/form/sales/return'
      case 'PQ':
        return '/app/form/purchase/quote'
      case 'PO':
        return '/app/form/purchase/order'
      case 'GR':
        return '/app/form/purchase/receipt'
      case 'BL':
        return '/app/form/purchase/invoice'
      case 'PY':
        return '/app/form/purchase/payment'
      case 'DN':
        return '/app/form/purchase/creditmemo'
      case 'GN':
        return '/app/form/purchase/return'
      case 'GI':
        return '/app/form/inventory/issue'
      case 'GE':
        return '/app/form/inventory/receipt'
    }
  },
}

export default ({app}, inject) => {
  inject('formatter', formatter)
}

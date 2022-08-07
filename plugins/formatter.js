export default ({app}, inject) => {
  const i18n = app.i18n

  inject('formatter', {
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

    appendAction(type) {
      switch (type) {
        case 'PQ':
          return [
            {
              text: 'Copy to ' + i18n.t('Purchase Order'),
              action: 'PO',
              type: 'document',
            },
            {
              text: 'Copy to ' + i18n.t('Goods Receipt PO'),
              action: 'GR',
              type: 'document',
            },
            {
              text: 'Copy to ' + i18n.t('A/P Invoice'),
              action: 'BL',
              type: 'transaction',
            },
          ]

        case 'PO':
          return [
            {
              text: 'Copy to ' + i18n.t('Goods Receipt PO'),
              action: 'GR',
              type: 'document',
            },
            {
              text: 'Copy to ' + i18n.t('A/P Invoice'),
              action: 'BL',
              type: 'transaction',
            },
          ]

        case 'GR':
          return [
            {
              text: 'Copy to ' + i18n.t('A/P Invoice'),
              action: 'BL',
              type: 'transaction',
            },
            {
              text: 'Copy to ' + i18n.t('Goods Return'),
              action: 'BL',
              type: 'document',
            },
          ]

        case 'BL':
          return [
            {
              text: 'Copy to ' + i18n.t('Outgoing Payment'),
              action: 'PY',
              type: 'transaction',
            },
          ]

        case 'PY':
          return [
            {
              text: 'Copy to ' + i18n.t('A/P Credit Memo'),
              action: 'DN',
              type: 'transaction',
            },
          ]

        case 'DN':
          return [
            {
              text: 'Copy to ' + i18n.t('Goods Return'),
              action: 'GN',
              type: 'document',
            },
          ]

        case 'SQ':
          return [
            {
              text: 'Copy to ' + i18n.t('Sales Order'),
              action: 'SO',
              type: 'document',
            },
            {
              text: 'Copy to ' + i18n.t('Sales Delivery'),
              action: 'SD',
              type: 'document',
            },
            {
              text: 'Copy to ' + i18n.t('A/R Invoice'),
              action: 'IN',
              type: 'transaction',
            },
          ]

        case 'SO':
          return [
            {
              text: 'Copy to ' + i18n.t('Sales Delivery'),
              action: 'SD',
              type: 'document',
            },
            {
              text: 'Copy to ' + i18n.t('A/R Invoice'),
              action: 'IN',
              type: 'transaction',
            },
          ]

        case 'SD':
          return [
            {
              text: 'Copy to ' + i18n.t('A/R Invoice'),
              action: 'IN',
              type: 'transaction',
            },
            {
              text: 'Copy to ' + i18n.t('Sales Return'),
              action: 'SR',
              type: 'document',
            },
          ]

        case 'IN':
          return [
            {
              text: 'Copy to ' + i18n.t('Incoming Payment'),
              action: 'RC',
              type: 'transaction',
            },
          ]

        case 'RC':
          return [
            {
              text: 'Copy to ' + i18n.t('A/R Credit Memo'),
              action: 'CN',
              type: 'transaction',
            },
          ]

        case 'CN':
          return [
            {
              text: 'Copy to ' + i18n.t('Sales Return'),
              action: 'SR',
              type: 'document',
            },
          ]
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
        case 'PI':
          return '/app/form/inventory/issue'
        case 'GE':
        case 'PR':
          return '/app/form/inventory/receipt'
        case 'PE':
          return '/app/form/production/order'
      }
    },
  })
}

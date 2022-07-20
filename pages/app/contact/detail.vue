<template>
  <div>
    <NuxtChild keep-alive :keep-alive-props="{ exclude: ['modal'] }" />
  </div>
</template>

<script>
export default {
  name: 'AllSales',

  head() {
    return {
      title: 'Business Partner Details',
    }
  },

  activated() {
    this.$nuxt.$emit('extensionSetting', {
      tabs: [
        {
          title: this.$t('Transaction List'),
          route: '/app/contact/detail/transaction',
        },
        {
          title: this.$t('Details'),
          route: '/app/contact/detail/info',
        },
      ],
      show: true,
      showBtn: true,
      itemBtn: [
        {
          text: 'Sales Quotations',
          type: 'SQ',
          route: '/app/form/sales/quote',
        },
        { text: 'Sales Order', type: 'SO', route: '/app/form/sales/order' },
        {
          text: 'Sales Delivery',
          type: 'SD',
          route: '/app/form/sales/delivery',
        },
        { text: 'A/R Invoice', type: 'SI', route: '/app/form/sales/invoice' },
        {
          text: 'Incoming Payment',
          type: 'SP',
          route: '/app/form/sales/payment',
        },
        {
          text: 'A/R Credit Memo',
          type: 'ARCM',
          route: '/app/form/sales/creditmemo',
        },
        { text: 'Sales Return', type: 'SR', route: '/app/form/sales/return' },
      ],
    })
  },

  created() {
    this.$nuxt.$on('getDataFromApi', ($event) => this.getDataFromApi($event))
  },

  methods: {
    getDataFromApi() {
      if (this.$refs.tableDocument) {
        this.$refs.tableDocument.getDataFromApi()
      }
    },
  },
}
</script>

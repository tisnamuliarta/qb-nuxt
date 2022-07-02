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
      title: 'All Sales',
    }
  },

  activated() {
    this.$nuxt.$emit('extensionSetting', {
      tabs: [
        {
          title: this.$t('Sales Overview'),
          route: '/app/sales/list/',
        },
        {
          title: this.$t('Sales Quotations'),
          route: '/app/sales/list/quotation',
        },
        {
          title: this.$t('Sales Order'),
          route: '/app/sales/list/salesorder',
        },
        {
          title: this.$t('Sales Delivery'),
          route: '/app/sales/list/delivery',
        },
        {
          title: this.$t('A/R Invoice'),
          route: '/app/sales/list/invoice',
        },
        {
          title: this.$t('Incoming Payment'),
          route: '/app/sales/list/payment',
        },
        {
          title: this.$t('Sales Return'),
          route: '/app/sales/list/return',
        },
        {
          title: this.$t('A/R Credit Memo'),
          route: '/app/sales/list/creditmemo',
        },
      ],
      show: true,
      showBtn: false,
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

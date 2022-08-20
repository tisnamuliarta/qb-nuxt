<template>
  <div>
    <NuxtChild keep-alive :keep-alive-props="{ exclude: ['modal'] }" />
  </div>
</template>

<script>
export default {
  name: 'AllPurchase',

  head() {
    return {
      title: 'All Purchase',
    }
  },

  activated() {
    this.$nuxt.$emit('extensionSetting', {
      tabs: [
        // {
        //   title: this.$t('Purchase Quotations'),
        //   route: '/app/purchase/list/quotation',
        // },
        {
          title: this.$t('Purchase Order'),
          route: '/app/purchase/list/purchaseorder',
          icon: 'mdi-store-edit'
        },
        {
          title: this.$t('Goods Receipt PO'),
          route: '/app/purchase/list/receipt',
          icon: 'mdi-truck-fast'
        },
        {
          title: this.$t('A/P Invoice'),
          route: '/app/purchase/list/invoice',
          icon: 'mdi-receipt'
        },
        {
          title: this.$t('A/P Credit Memo'),
          route: '/app/purchase/list/creditmemo',
          icon: 'mdi-keyboard-return'
        },
        {
          title: this.$t('Goods Return'),
          route: '/app/purchase/list/return',
          icon: 'mdi-truck-remove'
        },
      ],
      show: true,
      showBtn: false,
      itemBtn: [
        {
          text: this.$t('Purchase Quotations'),
          type: 'PQ',
          route: '/app/form/purchase/quote',
        },
        {
          text: this.$t('Purchase Order'),
          type: 'PO',
          route: '/app/form/purchase/order',
        },
        {
          text: this.$t('Goods Receipt PO'),
          type: 'GR',
          route: '/app/form/purchase/receipt',
        },
        {
          text: this.$t('A/P Invoice'),
          type: 'PI',
          route: '/app/form/purchase/invoice',
        },
        {
          text: this.$t('Outgoing Payment'),
          type: 'PP',
          route: '/app/form/purchase/payment',
        },
        {
          text: this.$t('A/P Credit Memo'),
          type: 'APCM',
          route: '/app/form/purchase/creditmemo',
        },
        {
          text: this.$t('Goods Return'),
          type: 'GR',
          route: '/app/form/purchase/return',
        },
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

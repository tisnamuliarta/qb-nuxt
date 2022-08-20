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
          title: this.$t('Bank Transactions'),
          route: '/app/bank/transaction/',
          icon: 'mdi-bank'
        },
        {
          title: this.$t('Bank Deposit'),
          route: '/app/bank/transaction/deposit',
          icon: 'mdi-bank-check'
        },
        {
          title: this.$t('Incoming Payment'),
          route: '/app/bank/transaction/salespayment',
          icon: 'mdi-bank-transfer-in',
        },
        {
          title: this.$t('Outgoing Payment'),
          route: '/app/bank/transaction/purchasepayment',
          icon: 'mdi-bank-transfer-out',
        },
        {
          title: this.$t('Cash Sale'),
          route: '/app/bank/transaction/cash-sale',
          icon: 'mdi-credit-card-plus-outline',
        },
        {
          title: this.$t('Cash Purchase'),
          route: '/app/bank/transaction/cash-purchase',
          icon: 'mdi-credit-card-minus-outline',
        },
      ],
      show: true,
      showBtn: false,
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

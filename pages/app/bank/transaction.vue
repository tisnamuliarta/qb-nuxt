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
        },
        {
          title: this.$t('Bank Deposit'),
          route: '/app/bank/transaction/deposit',
        },
        {
          title: this.$t('Incoming Payment'),
          route: '/app/bank/transaction/salespayment',
        },
        {
          title: this.$t('Outgoing Payment'),
          route: '/app/bank/transaction/purchasepayment',
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

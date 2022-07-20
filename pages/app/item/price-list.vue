<template>
  <div>
    <InventoryTablePriceList></InventoryTablePriceList>
  </div>
</template>

<script>
export default {
  name: 'ItemMaster',

  head() {
    return {
      title: this.$t('Price List')
    }
  },

  activated() {
    this.$nuxt.$emit('extensionSetting', {
      show: false,
      showBtn: false,
    })
  },
}
</script>

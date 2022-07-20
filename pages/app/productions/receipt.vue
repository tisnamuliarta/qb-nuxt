<template>
  <div>
    <InventoryTableItem></InventoryTableItem>
  </div>
</template>

<script>
export default {
  name: 'ItemMaster',

  head() {
    return {
      title: this.$t('Item Master Data')
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

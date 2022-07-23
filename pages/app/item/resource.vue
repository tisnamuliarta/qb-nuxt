<template>
  <div>
    <InventoryTableResource></InventoryTableResource>
  </div>
</template>

<script>
export default {
  name: 'ItemMaster',

  head() {
    return {
      title: this.$t('Resources')
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

<template>
  <div>
    <LazyInventoryTableContact ref="contact"></LazyInventoryTableContact>
  </div>
</template>

<script>
export default {
  name: 'CustomerList',

  head() {
    return {
      title: this.$t('Business Partners'),
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

<template>
  <div>
    <InventoryTableContact></InventoryTableContact>
  </div>
</template>

<script>
export default {
  name: "CustomerDetail",

  activated() {
    this.$nuxt.$emit('extensionSetting', {
      show: false,
      showBtn: false,
    })
  },
}
</script>

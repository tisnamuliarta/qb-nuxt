<template>
  <div>
    <AccountingTableAccount ref="tableAccount"></AccountingTableAccount>
  </div>
</template>

<script>
export default {
  name: 'ListAccount',

  activated() {
    this.$nuxt.$emit('extensionSetting', {
      show: false,
      showBtn: false,
    })
  },
}
</script>

<template>
  <div>
    <NuxtChild keep-alive :keep-alive-props="{ exclude: ['modal'] }" />
  </div>
</template>

<script>
export default {
  name: 'ReconcileList',
  data() {
    return {
      url: '/api/report',
      title: 'Reports',
    }
  },

  head() {
    return {
      title: this.title,
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

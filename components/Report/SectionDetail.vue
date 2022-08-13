<template>
  <v-simple-table dense>
    <template #default>
      <tr v-for="(item, index) in items" :key="index">
        <td colspan="2">
          {{ index }}
          <v-simple-table dense class="v-data-table-custom">
            <template #default>
              <tbody>
                <tr v-for="(value, idx) in item.accounts" :key="idx">
                  <td>
                    <span>{{ value.name }}</span>
                    <!-- <span @click="viewItem(value)">{{ value.name }}</span> -->
                  </td>
                  <td class="text-right">
                    {{
                      $auth.user.entity.currency.currency_symbol +
                      ' ' +
                      $formatter.formatPrice(value.closingBalance)
                    }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </td>
      </tr>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  props: {
    items: {
      type: Object,
      default() {
        return {}
      },
    },
  },

  methods: {
    viewItem(item) {
      this.$router.push({
        path: '/app/accounting/detail',
        query: {
          id: item.id,
        },
      })
    },
  },
}
</script>

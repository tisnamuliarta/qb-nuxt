<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" md="3">
        <LazyFormListAction
          title="SALES"
          :items="itemSales"
          @openAction="openAction"
        ></LazyFormListAction>
      </v-col>

      <v-col cols="12" md="3">
        <LazyFormListAction
          title="PURCHASING"
          :items="itemPurchase"
          @openAction="openAction"
        ></LazyFormListAction>
      </v-col>

      <v-col cols="12" md="3">
        <LazyFormListAction
          title="EMPLOYEE"
          :items="itemEmployee"
          @openAction="openAction"
        ></LazyFormListAction>
      </v-col>

      <v-col cols="12" md="3">
        <LazyFormListAction
          title="OTHER"
          :items="itemOther"
          @openAction="openAction"
        ></LazyFormListAction>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'NewForm',

  data() {
    return {
      dialog: false,
      itemSales: [
        // {
        //   text: this.$t('Sales Quotations'),
        //   type: 'SQ',
        //   route: '/app/form/sales/quote',
        // },
        {
          text: this.$t('Sales Order'),
          type: 'SO',
          route: '/app/form/sales/order',
        },
        {
          text: this.$t('Sales Delivery'),
          type: 'SD',
          route: '/app/form/sales/delivery',
        },
        {
          text: this.$t('A/R Invoice'),
          type: 'SI',
          route: '/app/form/sales/invoice',
        },
        {
          text: this.$t('Incoming Payment'),
          type: 'SP',
          route: '/app/form/sales/payment',
        },
        {
          text: this.$t('A/R Credit Memo'),
          type: 'ARCM',
          route: '/app/form/sales/creditmemo',
        },
        {
          text: this.$t('Sales Return'),
          type: 'SR',
          route: '/app/form/sales/return',
        },
        {
          text: this.$t('Cash Sale'),
          type: 'CS',
          route: '/app/form/sales/cash',
        },
      ],

      itemPurchase: [
        // {
        //   text: this.$t('Purchase Quotations'),
        //   type: 'PQ',
        //   route: '/app/form/purchase/quote',
        // },
        {
          text: this.$t('Purchase Order'),
          type: 'PO',
          route: '/app/form/purchase/order',
        },
        {
          text: this.$t('Goods Receipt PO'),
          type: 'GRPO',
          route: '/app/form/purchase/receipt',
        },
        {
          text: this.$t('A/P Invoice'),
          type: 'PI',
          route: '/app/form/purchase/invoice',
        },
        {
          text: this.$t('Outgoing Payment'),
          type: 'PP',
          route: '/app/form/purchase/payment',
        },
        {
          text: this.$t('A/P Credit Memo'),
          type: 'APCM',
          route: '/app/form/purchase/creditmemo',
        },
        {
          text: this.$t('Goods Return'),
          type: 'GR',
          route: '/app/form/purchase/return',
        },
        {
          text: this.$t('Cash Purchase'),
          type: 'CP',
          route: '/app/form/purchase/cash',
        },
      ],

      itemEmployee: [
        {
          text: this.$t('Single time activity'),
          type: '',
          route: '/app/form/employee/timeactivity',
        },
        {
          text: this.$t('Weekly timesheet'),
          type: '',
          route: '/app/form/employee/timesheet',
        },
      ],

      itemOther: [
        {
          text: this.$t('Tasks'),
          type: 'TASK',
          route: '/app/form/project/task',
        },
        {
          text: this.$t('Bank Deposit'),
          type: 'DEPOSIT',
          route: '/app/form/accounting/deposit',
        },
        {
          text: this.$t('Transfer'),
          type: 'TRANSFER',
          route: '/app/form/accounting/transfer',
        },
        {
          text: this.$t('Journal Entry'),
          type: 'JE',
          route: '/app/form/accounting/journal',
        },
        // {
        //   text: this.$t('Statement'),
        //   type: 'STATEMENT',
        //   route: '/app/form/accounting/statements',
        // },
        {
          text: this.$t('Goods Receipt'),
          type: 'GR',
          route: '/app/form/inventory/receipt',
        },
        {
          text: this.$t('Goods Issue'),
          type: 'GI',
          route: '/app/form/inventory/issue',
        },
        // {
        //   text: this.$t('Expenses'),
        //   type: 'EXPENSE',
        //   route: '/app/form/purchase/expense',
        // },
      ],
    }
  },

  methods: {
    openDialog() {
      this.dialog = true
    },

    openAction(data) {
      this.$auth.$storage.setState('basePath', this.$route.path)
      this.$emit('openAction', {
        item: data.item,
      })
      this.dialog = false
    },
  },
}
</script>

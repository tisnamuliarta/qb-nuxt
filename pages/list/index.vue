<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <span class="text-h4">List</span>
      </v-col>

      <v-col cols="12" md="10">
        <v-expansion-panels ref="tableDocument" v-model="panel" multiple>
          <v-expansion-panel v-for="(item, i) in items" :key="i">
            <v-expansion-panel-header>{{
              item.header
            }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list link dense>
                <v-list-item
                  v-for="(value, index) in item.items"
                  :key="index"
                  :to="item.route"
                  two-line
                  link
                  dense
                  class="pt-0 pb-0"
                  @click="$router.push({ path: value.route })"
                >
                  <v-list-item-content>
                    <v-list-item-title
                      class="font-weight-bold"
                      v-text="value.name"
                    ></v-list-item-title>

                    <v-list-item-subtitle
                      v-text="value.desc"
                    ></v-list-item-subtitle>

                    <v-divider></v-divider>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AllList',

  data() {
    return {
      panel: [0, 1, 2, 3, 4, 5, 6],
      items: [
        {
          header: 'Accounting',
          items: [
            {
              name: 'Chart of accounts',
              route: '/app/accounting/account',
              desc: this.$t('Displays your accounts. Balance sheet accounts track your assets and liabilities, and income and expense accounts categorize your transactions. From here, you can add or edit accounts.'),
            },
            {
              name: 'Account Category',
               route: '/list/account-category',
              desc: this.$t('Display list of account category'),
            },
            {
              name: 'Taxes',
               route: '/list/tax',
              desc: this.$t('Display list of sales tax'),
            },
            {
              name: 'Reporting Period',
               route: '/list/reporting-period',
              desc: this.$t('Display list of reporting period'),
            },
            {
              name: 'Account Mappings',
               route: '/list/account-mapping',
              desc: this.$t('Display list of account mappings'),
            },
          ],
        },

        {
          header: 'General',
          items: [
            {
              name: 'Users',
              route: '/list/users',
              desc: this.$t('Display list of users'),
            },
            {
              name: 'Permissions',
              route: '/list/permissions',
              desc: this.$t('Display list of permissions'),
            },
            {
              name: 'Roles',
              route: '/list/roles',
              desc: this.$t('Display list of roles'),
            },
          ],
        },

        {
          header: 'Transaction',
          items: [
            {
              name: 'Currency',
              route: '/list/currency',
              desc: this.$t('Display list of currency'),
            },
            {
              name: 'Product and services',
              route: '/app/item/list',
              desc: this.$t('Displays the products and services you sell. From here, you can edit information about a product or service, such as its description, or the rate you charge.'),
            },
            {
              name: 'Product category',
              route: '/list/item-category',
              desc: this.$t('A means of classifying items that you sell to customers. Provide a way for you to quickly organize what you sell, and save you time when completing sales transaction forms.'),
            },
            {
              name: 'Product unit',
              route: '/list/item-unit',
              desc: this.$t('Display list of item unit.'),
            },
            {
              name: 'Payment Term',
              route: '/list/paymentterm',
              desc: this.$t('Displays the list of terms that determine the due dates for payments from customers, or payments to vendors. Terms can also specify discounts for early payment. From here, you can add or edit terms.'),
            },
            {
              name: 'Payment Method',
              route: '/list/paymentmethod',
              desc: this.$t('Displays Cash, Check, and any other ways you categorize payments you receive from customers. That way, you can print deposit slips when you deposit the payments you have received.'),
            },
            // {
            //   name: 'Recurring',
            //   route: '/list/recurring',
            //   desc: 'Displays a list of transactions that have been saved for reuse. From here, you can schedule transactions to occur either automatically or with reminders. You can also save unscheduled transactions to use at any time.',
            // },
          ],
        },

        {
          header: 'Payroll',
          items: [
            {
              name: 'Work Location',
              route: '/list/work-location',
              desc: this.$t('Displays the list of work location.'),
            },
          ],
        },

        {
          header: 'Inventory',
          items: [
            {
              name: 'Warehouse',
              route: '/list/warehouse',
              desc: this.$t('Displays the list of Warehouse.'),
            },
          ],
        },

        {
          header: 'Other',
          items: [
            {
              name: 'Attachment',
              route: '/list/attachment',
              desc: this.$t('Displays the list of all attachments uploaded. From here you can add, edit, download, and export your attachments. You can also see all transactions linked to a particular attachment.'),
            },
          ],
        },
      ],
    }
  },

  head() {
    return {
      title: 'All Lists',
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

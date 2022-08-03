<template>
  <div>
    <DialogForm
      ref="dialogForm"
      max-width="1200px"
      :dialog-title="$t('Journal Entry')"
      button-title="Save"
      original="top"
    >
      <template #content>
        <v-container>
          <v-row>
            <v-col cols="12" class="mt-0">
              <v-data-table
                :mobile-breakpoint="0"
                :headers="headers"
                :items="allData"
                :items-per-page="150"
                :options.sync="options"
                :server-items-length="totalData"
                :loading="loading"
                class="elevation-0"
                show-select
                fixed-header
                height="60vh"
                hide-default-footer
                dense
                :footer-props="{
                  'items-per-page-options': [150, 250, 500, -1],
                }"
              >
                <template #[`item.amount_credit`]="{ item }">
                  <span v-if="item.amount_credit">
                    {{
                      $auth.user.entity.currency.currency_symbol +
                      ' ' +
                      $formatter.formatPrice(item.amount_credit)
                    }}
                  </span>
                </template>

                <template #[`item.amount_debit`]="{ item }">
                  <span v-if="item.amount_debit">
                    {{
                      $auth.user.entity.currency.currency_symbol +
                      ' ' +
                      $formatter.formatPrice(item.amount_debit)
                    }}
                  </span>
                </template>

                <template #[`body.append`]>
                  <tr class="black--text">
                    <th class="title"></th>
                    <th class="title"></th>
                    <th class="title"></th>
                    <th class="title"></th>
                    <th class="title"></th>
                    <th class="title text-right">
                      {{
                        $auth.user.entity.currency.currency_symbol +
                        ' ' +
                        $formatter.formatPrice(sumField('amount_debit'))
                      }}
                    </th>
                    <th class="title text-right">
                      {{
                        $auth.user.entity.currency.currency_symbol +
                        ' ' +
                        $formatter.formatPrice(sumField('amount_credit'))
                      }}
                    </th>
                  </tr>
                  <tr>
                    <td>Notes: </td>
                    <td colspan="3">
                      <strong>{{ transaction.narration }}</strong>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </DialogForm>
  </div>
</template>

<script>
export default {
  name: 'DialogItem',

  props: {
    viewData: {
      type: Boolean,
      default: true,
    },
    showAddBtn: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      row: null,
      url: '',
      allData: [],
      transaction: [],
      totalData: 0,
      loading: false,
      options: {},
      headers: [
        { text: 'Posting Date', value: 'posting_date' },
        { text: 'Account Code', value: 'post_account.code' },
        { text: 'Account Category', value: 'post_account.account_type' },
        { text: 'Account Name', value: 'post_account.name' },
        {
          text: 'Debit',
          value: 'amount_debit',
          class: 'text-center',
          cellClass: 'disable-wrap text-right',
        },
        {
          text: 'Credit',
          value: 'amount_credit',
          class: 'text-center',
          cellClass: 'disable-wrap text-right',
        },
      ],
    }
  },

  methods: {
    sumField(key) {
      // sum data in give key (property)
      return this.allData.reduce(
        (a, b) => parseFloat(a) + parseFloat(b[key] || 0),
        0
      )
    },

    openDialog(url) {
      this.$refs.dialogForm.openDialog()
      this.url = url
      this.getDataFromApi()
    },

    getDataFromApi() {
      this.loading = true
      this.$axios
        .get(this.url)
        .then((res) => {
          this.loading = false
          const data = res.data

          this.allData = data.data
          this.transaction = data.transaction
          this.totalData = data.total
        })
        .catch((err) => {
          this.loading = false
          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })
        })
    },
  },
}
</script>

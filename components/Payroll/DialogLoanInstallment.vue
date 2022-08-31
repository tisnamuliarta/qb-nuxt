<template>
  <div>
    <DialogForm
      ref="dialogForm"
      max-width="800px"
      dialog-title="Payroll Summary"
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
                <template #[`item.base_amount`]="{ item }">
                  <span v-if="item.base_amount">
                    {{
                      $auth.user.entity.currency.currency_symbol +
                      ' ' +
                      $formatter.formatPrice(item.base_amount)
                    }}
                  </span>
                </template>

                <template #[`item.installment`]="{ item }">
                  <span v-if="item.installment">
                    {{
                      $auth.user.entity.currency.currency_symbol +
                      ' ' +
                      $formatter.formatPrice(item.installment)
                    }}
                  </span>
                </template>

                <template #[`item.interest`]="{ item }">
                  <span v-if="item.interest">
                    {{
                      $auth.user.entity.currency.currency_symbol +
                      ' ' +
                      $formatter.formatPrice(item.interest)
                    }}
                  </span>
                </template>

                <template #[`item.reminder_amount`]="{ item }">
                  <span v-if="item.reminder_amount">
                    {{
                      $auth.user.entity.currency.currency_symbol +
                      ' ' +
                      $formatter.formatPrice(item.reminder_amount)
                    }}
                  </span>
                </template>

                <!-- <template #[`body.append`]>
                  <tr class="black--text">
                    <th class="title"></th>
                    <th class="title">Total</th>
                    <th class="title"></th>
                    <th class="title text-right">
                      {{
                        $auth.user.entity.currency.currency_symbol +
                        ' ' +
                        $formatter.formatPrice(sumField('amount_allowance'))
                      }}
                    </th>
                    <th class="title text-right">
                      {{
                        $auth.user.entity.currency.currency_symbol +
                        ' ' +
                        $formatter.formatPrice(sumField('amount_deduction'))
                      }}
                    </th>
                    <th class="title text-right">
                      {{
                        $auth.user.entity.currency.currency_symbol +
                        ' ' +
                        $formatter.formatPrice(sumField('amount'))
                      }}
                    </th>
                  </tr>
                </template> -->
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template #saveData>
        <v-btn
          :loading="loading"
          small
          dense
          color="primary"
          @click="printDocument(item)"
          >Print</v-btn
        >
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
      item: [],
      transaction: [],
      totalData: 0,
      loading: false,
      options: {},
      headers: [
        { text: this.$t('Transaction Date'), value: 'transaction_date' },
        { text: this.$t('Principle'), value: 'base_amount', align: 'right' },
        { text: this.$t('Interest'), value: 'interest', align: 'right' },
        { text: this.$t('Installment'), value: 'installment', align: 'right' },
        { text: this.$t('Reminder'), value: 'reminder_amount', align: 'right' },
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

    openDialog(item) {
      this.$refs.dialogForm.openDialog()
      this.url = `/api/payroll/loan-installment/` + item.id
      this.item = item
      this.getDataFromApi()
    },

    printDocument(item) {
      this.loading = true
      this.$axios
        .get(`/api/payroll/print/` + item.id, {
          params: {
            item,
          },
          responseType: 'arraybuffer',
        })
        .then((response) => {
          this.loading = false
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')

          link.href = url
          link.setAttribute('download', item.transaction_no + '.pdf') // set custom file name
          document.body.appendChild(link)

          link.click() // force download file without open new tab
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

    getDataFromApi() {
      this.loading = true
      this.$axios
        .get(this.url)
        .then((res) => {
          this.loading = false
          const data = res.data

          this.allData = data.data
          this.transaction = data.data
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

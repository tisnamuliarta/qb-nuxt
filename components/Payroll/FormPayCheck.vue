<template>
  <v-row dense>
    <v-col cols="12" md="9" sm="8">
      <v-row dense>
        <v-col cols="12" md="3" sm="12">
          <v-autocomplete
            v-model="form.account_id"
            :items="itemAccounts"
            :label="$t('Pay from')"
            item-value="id"
            item-text="name"
            outlined
            dense
            hide-details="auto"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" md="2" sm="12">
          <v-autocomplete
            v-model="form.pay_period"
            :items="itemPayPeriod"
            :label="$t('End Pay Period')"
            return-object
            item-value="id"
            item-text="name"
            outlined
            dense
            hide-details="auto"
            @change="changePeriodDate"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" lg="2" md="2" sm="6">
          <v-text-field
            v-model="form.transaction_date"
            :label="$t('Pay date')"
            persistent-hint
            outlined
            dense
            hide-details="auto"
            type="date"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="2" sm="12">
          <v-autocomplete
            v-model="form.status"
            :items="['draft','closed','cancel']"
            label="Status"
            outlined
            dense
            hide-details="auto"
          ></v-autocomplete>
        </v-col>
        <!-- <v-col cols="12" md="2"></v-col> -->
      </v-row>
    </v-col>

    <v-spacer></v-spacer>
    <v-col cols="12" md="3" xl="2" sm="4" class="text-right">
      <v-row dense>
        <v-col cols="12" class="pt-0">
          <p class="mb-0">Amount</p>
          <span class="text-right font-weight-bold text-h4">
            {{
              isNaN(form.main_account_amount)
                ? 0
                : $formatter.formatPrice(form.main_account_amount)
            }}
          </span>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" class="mt-1">
      <v-card flat>
        <div class="scroll-container-min">
          <LazyPayrollTableDetailPayCheck
            ref="childDetails"
            @calcTotal="calcTotal"
          ></LazyPayrollTableDetailPayCheck>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'FormPayCheck',

  props: {
    formType: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      tab: null,
      menu: '',
      menu2: '',
      menu3: '',
      menu4: '',
      logo: '',
      search: null,
      selectedItem: 1,
      dialog: false,
      checkbox: false,
      deposit: false,
      tax: true,
      withholding: false,
      submitLoad: false,
      showLoading: false,
      form: {},
      itemCategory: [],
      itemUnit: [],
      itemPayPeriod: [],
      itemContact: [],
      itemAccounts: [],
      itemTag: [],
      itemPaymentTerm: [],
      itemWarehouse: [],
      itemFiles: [],
      taxDetails: [],
      itemSalesPersons: [],
      statusProcessing: 'insert',
      valueWhenIsEmpty: '0',
      tempTotalTax: 0,
      subTotalMinDiscount: 0,
      taxAmount: 0,
      taxDiscount: 0,
      amountBeforeTax: 0,
      withholdingAmount: 0,
      commission: 0,
      moneyOptions: {
        locale: 'en',
        prefix: '',
        length: 11,
        precision: 0,
      },

      moneyOptionTotal: {
        locale: 'en',
        prefix: '',
        length: 14,
        precision: 2,
      },

      moneyOptionTotalDiscount: {
        locale: 'en',
        prefix: '',
        length: 14,
        precision: 0,
      },
    }
  },

  activated() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
    })
    this.getMasterData()
  },

  mounted() {
    this.getMasterData()
  },

  methods: {
    async changePeriodDate() {
       const res = await this.$axios.get(`/api/payroll/employee-commission`, {
        params: {
          'date_period': this.form.pay_period
        }
      })

      this.$refs.childDetails.setCommission(res.data.data)
    },

    changeQty() {
      this.$refs.childDetails.setQty(this.form.planned_qty)
    },

    checkDisable() {
      return this.form.status === 'closed' || this.form.status === 'cancel'
    },

    statusColor(status) {
      switch (status) {
        case 'planned':
          return 'blue darken-3'
        case 'partial':
          return 'orange'
        case 'released':
          return 'orange'
        case 'closed':
          return 'green'
        case 'overdue':
          return 'red'
        case 'cancel':
          return 'red'
      }
    },

    calcTotal(data) {
      try {
        this.form.main_account_amount = data.subTotal
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },

    showLoad(value) {
      this.showLoading = value
    },

    // Setting the data to the child component.
    setData(form, columns, colHeaders) {
      this.showLoading = true
      setTimeout(() => {
        this.$refs.childDetails.setDataToDetails(
          [
            {
              quantity: null,
            },
          ],
          form,
          columns,
          colHeaders
        )
      }, 500)

      this.form = Object.assign({}, form)

      if (this.form.tax_details) {
        this.form.tax_details = this.reduceArrayTax(this.form.tax_details)
      }

      this.moneyOptionTotal.prefix = this.form.default_currency_symbol
      this.moneyOptionTotalDiscount.prefix = this.form.default_currency_symbol
      this.moneyOptions.prefix = this.form.default_currency_symbol
      this.statusProcessing = 'insert'
    },

    eventGetFiles(data) {
      this.itemFiles = data.row
    },

    // The above code is fetching data from the server and storing it in the local storage.
    async getMasterData() {
      this.$nuxt.$loading.start()
      try {
        const resItemPayPeriod = await this.$axios.get(
          `/api/payroll/pay-period`, {
            params: {
              pay_schedule_id: 1
            }
          }
        )
        const resAccount = await this.$axios.get(`/api/financial/accounts`, {
          params: {
            type: 'BANK',
          },
        })

        this.itemAccounts = resAccount.data.data
        this.itemPayPeriod = resItemPayPeriod.data.data
      } catch (err) {
        this.$swal({
          type: 'error',
          title: 'Error',
          text: err.response.data.error,
        })
      }
    },
    checkDocument() {
      const routeType = this.$route.query.type
      switch (routeType) {
        case 'SQ':
        case 'PQ':
          return false
        default:
          return true
      }
    },

    // Getting the data from the child component and adding it to the form object.
    returnData(document) {
      const vm = this
      const details = {}
      const clearData = vm.$refs.childDetails.getAddData(document)
      clearData.forEach(function (item, key) {
        if (!vm.$refs.childDetails.checkIfEmptyRow(key)) details[key] = item
      })

      this.form.line_items = details
      return this.form
    },

    changeValue(key, value) {
      this.form[key] = value
    },
  },
}
</script>

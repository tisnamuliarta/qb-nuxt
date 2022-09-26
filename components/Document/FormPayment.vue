<template>
  <v-row dense>
    <v-col cols="12" md="9" sm="8">
      <v-row dense>
        <v-col cols="12" md="4" sm="12">
          <v-autocomplete
            v-model="form.contact_id"
            :items="itemContact"
            label="Customer/Vendor"
            return-object
            item-value="id"
            item-text="name"
            outlined
            dense
            hide-details="auto"
            @change="getInvoice"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" lg="2" md="2" sm="6">
          <v-select
            v-model="form.payment_term_id"
            :items="itemPaymentMethod"
            item-value="id"
            item-text="name"
            label="Payment Method"
            outlined
            dense
            hide-details="auto"
          ></v-select>
        </v-col>

        <v-col cols="12" lg="2" md="2" sm="6">
          <v-text-field
            v-model="form.transaction_date"
            label="Transaction Date"
            persistent-hint
            outlined
            dense
            hide-details="auto"
            type="date"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4" sm="12">
          <v-autocomplete
            v-model="form.deposit_account_id"
            :items="itemAccounts"
            label="Deposit Account"
            return-object
            item-value="id"
            item-text="name"
            outlined
            dense
            hide-details="auto"
          ></v-autocomplete>
        </v-col>
        <!-- <v-col cols="12" md="2"></v-col> -->

        <v-col cols="12" md="4" sm="6">
          <v-text-field
            v-model="form.reference_no"
            label="No Contract"
            outlined
            dense
            hide-details="auto"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-col>

    <v-spacer></v-spacer>
    <v-col cols="12" md="3" xl="2" sm="4" class="text-right">
      <v-row dense>
        <v-col cols="12" class="pt-0">
          <p class="mb-0">Amount Due</p>
          <span class="text-right font-weight-bold text-h4">
            {{
              isNaN(form.main_account_amount)
                ? 0
                : $formatter.formatPrice(form.main_account_amount)
            }}
          </span>
        </v-col>

        <v-col cols="12">
          <v-chip label :color="statusColor(form.status)" dark>
            {{ form.status }}</v-chip
          >
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" class="mt-2">
      <div class="scroll-container-min">
        <LazyPaymentTablePayment
          ref="childDetails"
          @calcTotal="calcTotal"
        ></LazyPaymentTablePayment>
      </div>
    </v-col>

    <v-col cols="12" md="4" lg="4">
      <v-col cols="12" md="12">
        <v-textarea
          v-model="form.narration"
          rows="2"
          label="Memo"
          outlined
          dense
          hide-details="auto"
        ></v-textarea>
      </v-col>

      <v-col cols="12" md="12">
        <DocumentFieldUpload
          ref="uploadField"
          :form-data="form"
          form-type="document"
          @eventGetFiles="eventGetFiles"
        ></DocumentFieldUpload>
      </v-col>
    </v-col>

    <v-spacer />

    <v-col cols="12" md="6" lg="5">
      <v-row dense>
        <v-col cols="12">
          <v-row dense>
            <v-spacer />
            <v-col cols="12" md="4" class="text-right pa-1">
              <span class="font-weight-bold subtitle-1">Subtotal</span>
            </v-col>
            <v-col cols="12" md="4" class="text-right pa-1">
              <span class="font-weight-bold subtitle-1">
                {{
                  isNaN(form.sub_total)
                    ? 0
                    : $formatter.formatPrice(form.sub_total)
                }}
              </span>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-row dense>
            <v-spacer />
            <v-col cols="12" md="4" class="text-right pa-1">
              <span class="font-weight-bold subtitle-1">Total</span>
            </v-col>
            <v-col cols="12" md="4" class="text-right pa-1">
              <span class="font-weight-bold subtitle-1">
                {{
                  isNaN(form.main_account_amount)
                    ? 0
                    : $formatter.formatPrice(form.main_account_amount)
                }}
              </span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'FormDocument',

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
      itemContact: [],
      itemAccounts: [],
      itemTag: [],
      itemPaymentMethod: [],
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
      discountAmount: 0,
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
    this.getMasterData()
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
    })
  },

  // The above code is calling the methods that are defined in the methods section of the Vue instance.
  mounted() {
    setTimeout(() => {
      this.getMasterData()
    }, 500)
  },

  methods: {
    checkDisable() {
      return this.form.status === 'closed' || this.form.status === 'cancel'
    },

    statusColor(status) {
      switch (status) {
        case 'open':
          return 'blue darken-3'
        case 'partial':
          return 'orange'
        case 'paid':
          return 'green'
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
        this.form.main_account_amount = data.amount
        this.form.sub_total = data.amount

      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },

    showLoad(value) {
      this.showLoading = value
    },

    // Setting the data to the child component.
    setData(form) {
      this.showLoading = true
      setTimeout(() => {
        this.$refs.childDetails.setDataToDetails(
          [
            {
              item_number: null,
              narration: null,
              qty: null,
              unit: null,
            },
          ],
          form
        )
      }, 500)

      this.form = Object.assign({}, form)
      // console.log(this.form)

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
        const resItemCategory = await this.$axios.get(
          `/api/master/categories`,
          {
            params: {
              type: 'Item Category',
            },
          }
        )
        const resAccount = await this.$axios.get(`/api/financial/accounts`, {
          params: {
            type: 'BANK',
          },
        })

        const resContact = await this.$axios.get(`/api/bp/contacts`, {
          params: {
            type: this.formType,
          },
        })

        const resPaymentTerm = await this.$axios.get(
          `/api/financial/payment-methods`
        )

        this.itemCategory = resItemCategory.data.simple
        this.itemAccounts = resAccount.data.data
        this.itemContact = resContact.data.data
        this.itemPaymentMethod = resPaymentTerm.data.data
      } catch (err) {
        this.$swal({
          type: 'error',
          title: 'Error',
          text: err.response.data.error,
        })
      }
    },

    changePaymentTerm() {
      this.$axios
        .get(`/api/financial/payment-terms/` + this.form.payment_term_id)
        .then((res) => {
          // eslint-disable-next-line no-extend-native
          Date.prototype.addDays = function (days) {
            const date = new Date(this.valueOf())
            date.setDate(date.getDate() + days)
            return date
          }
          // Add 7 Days
          const start = this.$moment(this.form.transaction_date)
          // const date = new Date(this.form.transaction_date)
          this.form.due_date = start
            .add(res.data.data.value, 'days')
            .format('YYYY-MM-DD')
        })
    },

    formatDate(date) {
      const d = new Date(date)
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()
      const year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [year, month, day].join('-')
    },

    changeContact() {
      const contact = this.form.contact_id
      this.form.contact_id = contact.id
      this.form.contact_address = contact.address
        ? contact.address
        : this.form.contact_address

      this.form.shipping_address = contact.shipping_address
        ? contact.shipping_address
        : this.form.shipping_address
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

    getInvoice() {
      this.form.contact_id = this.form.contact_id.id
      const id = this.form.contact_id
      this.$axios(`/api/transaction/invoice`, {
        params: {
          type: this.formType,
          contact: id
        },
      }).then((res) => {
        setTimeout(() => {
          this.$refs.childDetails.setDataToDetails(
            [
              {
                amount: null,
              },
            ],
            res.data.data
          )
        }, 500)
      })
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

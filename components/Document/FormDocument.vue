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
            @change="changeContact"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" md="2" sm="6">
          <v-select
            v-model="form.payment_term_id"
            :items="itemPaymentTerm"
            item-value="id"
            item-text="name"
            label="Payment Term"
            outlined
            dense
            hide-details="auto"
            @change="changePaymentTerm"
          ></v-select>
        </v-col>

        <v-col cols="12" md="2" sm="4">
          <v-text-field
            v-model="form.transaction_date"
            label="Transaction Date"
            persistent-hint
            outlined
            dense
            hide-details="auto"
            type="date"
            @change="changePaymentTerm"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="2" sm="4">
          <v-text-field
            v-model="form.due_date"
            label="Due Date"
            persistent-hint
            outlined
            dense
            type="date"
            hide-details="auto"
          ></v-text-field>
        </v-col>
        <!-- <v-col cols="12" md="2"></v-col> -->

        <v-col cols="12" md="4">
          <v-textarea
            v-model="form.contact_address"
            rows="2"
            label="Billing Address"
            outlined
            dense
            hide-details="auto"
          ></v-textarea>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="form.reference_no"
            label="No Contract"
            outlined
            dense
            hide-details="auto"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="8">
          <v-combobox
            v-model="form.tags"
            :items="itemTag"
            :search-input.sync="search"
            hide-selected
            label="Tags"
            hide-details
            dense
            multiple
            persistent-hint
            small-chips
            outlined
          >
            <template #no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    No results matching "<strong>{{ search }}</strong
                    >". Press <kbd>enter</kbd> to create a new one
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>
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
              isNaN(form.balance_due)
                ? 0
                : $formatter.formatPrice(form.balance_due)
            }}
          </span>
        </v-col>
        <v-col cols="12">
          <v-autocomplete
            v-model="form.sales_person"
            :items="itemSalesPersons"
            item-value="user_id"
            item-text="first_name"
            label="Sales Person"
            outlined
            dense
            multiple
            persistent-hint
            small-chips
            hide-details="auto"
          ></v-autocomplete>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12">
      <v-card flat>
        <!-- <LazyFormAgGrid ref="agGrid"></LazyFormAgGrid> -->
        <!-- <lazyTabulator ref="tabulator" /> -->
        <LazyDocumentTableDetail
          ref="childDetails"
          @calcTotal="calcTotal"
        ></LazyDocumentTableDetail>
        <!-- <div class="scroll-container-min">
          <LazyDocumentTableDetail
            ref="childDetails"
            @calcTotal="calcTotal"
          ></LazyDocumentTableDetail>
        </div> -->
        <v-card-actions>
          <v-btn
            small
            depressed
            outlined
            @click="$refs.childDetails.addLine(5)"
          >
            Add Line
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col cols="12" md="4" lg="4">
      <v-col cols="12" md="12">
        <v-textarea
          v-model="form.footer"
          rows="2"
          label="Message"
          outlined
          dense
          hide-details="auto"
        ></v-textarea>
      </v-col>

      <v-col cols="12" md="12">
        <v-textarea
          v-model="form.notes"
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

        <!-- <v-col cols="12">
          <v-row dense>
            <v-spacer />
            <v-col cols="12" md="4">
              <vuetify-money
                v-model="form.discount_per_line"
                :value-when-is-empty="valueWhenIsEmpty"
                :options="moneyOptionTotal"
                readonly
                label="Discount Per Lines"
                outlined
                dense
                class="text-money"
                hide-details="auto"
              ></vuetify-money>
            </v-col>
          </v-row>
        </v-col> -->

        <v-col cols="12">
          <v-row dense class="align-right">
            <v-spacer />
            <v-col cols="12" md="4" class="pa-1">
              <v-select
                v-model="form.discount_type"
                :items="['Value', 'Percent']"
                label="Discount Type"
                outlined
                dense
                hide-details="auto"
              ></v-select>
            </v-col>

            <v-col cols="12" md="3" class="pa-1">
              <vuetify-money
                v-model="form.discount_rate"
                :value-when-is-empty="valueWhenIsEmpty"
                :options="moneyOptionTotalDiscount"
                label="Discount Rate"
                outlined
                dense
                class="text-money"
                hide-details="auto"
              ></vuetify-money>
            </v-col>

            <v-col cols="12" md="4" class="text-right pa-1">
              <span class="font-weight-bold subtitle-1">
                {{
                  isNaN(form.discount_amount)
                    ? 0
                    : $formatter.formatPrice(form.discount_amount)
                }}
              </span>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-row v-for="(item, index) in form.tax_details" :key="index" dense>
            <v-spacer />
            <v-col cols="12" md="4" class="text-right pa-1">
              <span class="font-weight-bold subtitle-1">{{ item.name }}</span>
            </v-col>
            <v-col cols="12" md="4" class="text-right pa-1">
              <span class="font-weight-bold subtitle-1">
                {{
                  isNaN(item.amount) ? 0 : $formatter.formatPrice(item.amount)
                }}
              </span>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-row dense>
            <v-spacer />
            <v-col cols="12" md="4" class="text-right pa-1">
              <span class="font-weight-bold subtitle-1">Shipping</span>
            </v-col>
            <v-col cols="12" md="4" class="pa-1">
              <vuetify-money
                v-model="form.shipping_fee"
                :value-when-is-empty="valueWhenIsEmpty"
                :options="moneyOptionTotal"
                label="Shipping Fee"
                outlined
                dense
                class="text-money"
                hide-details="auto"
              ></vuetify-money>
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
                  isNaN(form.main_account_amount) ? 0 : $formatter.formatPrice(form.main_account_amount)
                }}
              </span>
            </v-col>
          </v-row>
        </v-col>

        <!-- <v-col cols="12">
          <v-row dense>
            <v-col cols="12" md="2">
              <v-checkbox
                v-model="form.withholding_info"
                dense
                hide-details
                label="Withholding"
                class="mt-0"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="3">
              <v-select
                v-show="form.withholding_info"
                v-model="form.withholding_type"
                :items="['Amount', 'Percent']"
                label="Type"
                outlined
                dense
                hide-details="auto"
              ></v-select>
            </v-col>

            <v-col cols="12" md="3">
              <vuetify-money
                v-show="form.withholding_info"
                v-model="form.withholding_rate"
                :value-when-is-empty="valueWhenIsEmpty"
                :options="moneyOptionTotal"
                label="Rate"
                outlined
                dense
                class="text-money"
                hide-details="auto"
              ></vuetify-money>
            </v-col>

            <v-col cols="12" md="4">
              <vuetify-money
                v-show="form.withholding_info"
                v-model="form.withholding_amount"
                :value-when-is-empty="valueWhenIsEmpty"
                :options="moneyOptionTotal"
                readonly
                label="Amount"
                outlined
                dense
                class="text-money"
                hide-details="auto"
              ></vuetify-money>
            </v-col>

            <v-col v-show="form.withholding_info" cols="12" md="12">
              <v-select
                v-model="form.withholding_account_id"
                :items="itemAccounts"
                item-value="id"
                item-text="name"
                label="Withholding Account"
                outlined
                dense
                hide-details="auto"
              ></v-select>
            </v-col>
          </v-row>
        </v-col> -->

        <v-col cols="12">
          <v-row dense>
            <v-spacer />
            <v-col cols="12" md="4" class="text-right pa-1">
              <span class="font-weight-bold subtitle-1">Deposit</span>
            </v-col>
            <v-col cols="12" md="4" class="pa-1">
              <vuetify-money
                v-model="form.deposit_amount"
                :value-when-is-empty="valueWhenIsEmpty"
                :options="moneyOptionTotal"
                label="Amount"
                outlined
                dense
                class="text-money"
                hide-details="auto"
              ></vuetify-money>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-row dense>
            <v-spacer />
            <v-col cols="12" md="4" class="text-right pa-1">
              <span class="font-weight-bold subtitle-1">Balance Due</span>
            </v-col>
            <v-col cols="12" md="4" class="text-right pa-1">
              <span class="font-weight-bold subtitle-1">
                {{
                  isNaN(form.balance_due)
                    ? 0
                    : $formatter.formatPrice(form.balance_due)
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

  computed: {
    depositAmount() {
      return this.form.deposit_amount
    },
    discountRate() {
      return this.form.discount_rate
    },
    discountType() {
      return this.form.discount_type
    },
    withholdingType() {
      return this.form.withholding_type
    },
    withholdingRate() {
      return this.form.withholding_rate
    },
    shippingFee() {
      return this.form.shipping_fee
    },
  },

  watch: {
    shippingFee: {
      handler() {
        this.changeCalculation()
      },
      deep: true,
    },
    depositAmount: {
      handler() {
        this.changeCalculation()
      },
      deep: true,
    },
    withholdingType: {
      handler() {
        this.changeCalculation()
      },
      deep: true,
    },
    discountType: {
      handler() {
        this.changeCalculation()
      },
      deep: true,
    },
    discountRate: {
      handler() {
        this.changeCalculation()
      },
      deep: true,
    },
    withholdingRate: {
      handler() {
        this.changeCalculation()
      },
      deep: true,
    },
  },

  activated() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
    })
  },

  // The above code is calling the methods that are defined in the methods section of the Vue instance.
  mounted() {
    this.getMasterData()
  },

  methods: {
    checkDisable() {
      return this.form.status === 'closed' || this.form.status === 'cancel'
    },

    calcTotal(data) {
      try {
        this.form.discount_per_line = data.discountAmount
        this.form.sub_total = data.subTotal
        this.form.tax_details = this.reduceArrayTax(data.taxDetail)
        this.taxDetails = data.taxDetail
        this.form.main_account_amount = data.amount + this.tempTotalTax
        this.form.balance_due = this.form.main_account_amount
        this.subTotalMinDiscount =
          parseFloat(this.form.sub_total) -
          parseFloat(this.form.discount_per_line)
        // this.taxAmount = this.tempTotalTax

        if (this.form.sub_total === 0) {
          this.form.discount_rate = 0
          this.form.discount_amount = 0
        }

        this.changeCalculation(data)
      } catch (e) {
        console.log(e)
      }
    },

    // Calculating the tax amount, discount amount, total amount, balance due, etc.
    changeCalculation(data) {
      // this.taxDetails = (data) ? data.taxDetail : []
      // calculate discount
      if (this.taxDetails.length > 0) {
        this.form.tax_details = this.reduceArrayTax(this.taxDetails)
      }
      this.form.discount_amount = 0
      if (this.form.discount_type === 'Percent') {
        if (this.form.discount_rate > 0) {
          this.subTotalMinDiscount =
            parseFloat(this.form.sub_total) -
            parseFloat(this.form.discount_per_line)
          this.form.discount_amount =
            (this.form.discount_rate / 100) * this.subTotalMinDiscount
          this.taxDiscount = (this.form.discount_rate / 100) * this.tempTotalTax
        }
      } else {
        this.form.discount_amount = parseFloat(this.form.discount_rate)
        if (this.tempTotalTax > 0) {
          this.taxDiscount = this.tempTotalTax - this.form.discount_amount
        }
      }

      this.taxAmount =
        parseFloat(this.tempTotalTax) - parseFloat(this.taxDiscount)

      this.taxAmount = this.taxAmount === undefined ? 0 : this.taxAmount

      // calculate tax details
      if (
        this.taxDetails.length > 0 &&
        parseFloat(this.form.discount_rate) > 0
      ) {
        this.form.tax_details = this.reduceArrayTaxAfterDiscount(
          this.taxDetails
        )
      }

      // calculate total amount
      this.form.main_account_amount =
        parseFloat(this.form.sub_total) -
        parseFloat(this.form.discount_per_line) -
        parseFloat(this.form.discount_amount) +
        parseFloat(this.taxAmount)

      // calculate amount before tax for tax withholding
      this.amountBeforeTax = this.form.main_account_amount - this.taxAmount

      // calculate tax withholding
      if (this.form.withholding_type === 'Percent') {
        if (this.form.withholding_rate > 0) {
          this.form.withholding_amount =
            (this.form.withholding_rate / 100) * this.amountBeforeTax
        }
      } else {
        this.form.withholding_amount = parseFloat(this.form.withholding_rate)
      }

      this.form.balance_due =
        this.form.main_account_amount -
        this.form.deposit_amount -
        this.form.withholding_amount -
        parseFloat(this.form.shipping_fee)
    },

    // Reducing the array of tax details and returning the result.
    reduceArrayTaxAfterDiscount(taxDetails) {
      const result = []
      const vm = this
      // console.log(taxDetails)
      taxDetails.reduce(function (res, value) {
        if (!res[value.name]) {
          res[value.name] = { name: value.name, amount: 0 }
          result.push(res[value.name])
        }

        if (parseFloat(vm.form.discount_rate) > 0) {
          let taxDiscountValue = 0
          if (vm.form.discount_type === 'Percent') {
            taxDiscountValue =
              (parseFloat(vm.form.discount_rate) / 100) *
              parseFloat(value.amount)
          } else {
            taxDiscountValue = parseFloat(vm.form.discount_rate)
          }
          res[value.name].amount =
            parseFloat(value.amount) - parseFloat(taxDiscountValue)
        }
        return res
      }, {})

      return result
    },

    reduceArrayTax(taxDetails) {
      const result = []
      const vm = this
      let totalTax = 0
      taxDetails.forEach(function (item, index) {
        totalTax += parseFloat(item.amount)
      })
      vm.tempTotalTax = totalTax

      taxDetails.reduce(function (res, value) {
        if (!res[value.name]) {
          res[value.name] = { name: value.name, amount: 0 }
          result.push(res[value.name])
        }
        res[value.name].amount += value.amount

        return res
      }, {})

      return result
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
        const resItemUnit = await this.$axios.get(`/api/inventory/item-units`, {
          params: {
            type: 'Item Category',
          },
        })
        const resAccount = await this.$axios.get(`/api/financial/accounts`, {
          params: {
            type: 'All',
          },
        })

        const resContact = await this.$axios.get(`/api/bp/contacts`, {
          params: {
            type: this.$route.query.type,
          },
        })

        const resPaymentTerm = await this.$axios.get(
          `/api/financial/payment-terms`,
          {
            params: {
              type: 'All',
            },
          }
        )

        const resTax = await this.$axios.get(`/api/financial/taxes`, {
          params: {
            type: 'All',
          },
        })

        const resEmployee = await this.$axios.get(`/api/payroll/employees`, {
          params: {
            type: 'All',
          },
        })

        this.itemCategory = resItemCategory.data.data.simple
        this.itemUnit = resItemUnit.data.data.simple
        this.itemAccounts = resAccount.data.data.rows
        this.itemContact = resContact.data.data.rows
        this.itemPaymentTerm = resPaymentTerm.data.data.auto_complete
        this.$auth.$storage.setLocalStorage('tax', resTax.data.data.simple)
        this.$auth.$storage.setLocalStorage('tax_row', resTax.data.data.rows)
        this.$auth.$storage.setLocalStorage(
          'salesPerson',
          resEmployee.data.data.rows
        )
        this.itemSalesPersons = resEmployee.data.data.rows
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
            .add(res.data.data.rows.value, 'days')
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

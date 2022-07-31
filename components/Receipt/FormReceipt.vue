<template>
  <v-row dense>
    <v-col cols="12" md="9" sm="8">
      <v-row dense>
        <v-col cols="12" md="4" sm="12">
          <v-text-field
            v-model="form.reference_no"
            label="Reference"
            outlined
            dense
            hide-details="auto"
          ></v-text-field>
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
            v-model="form.warehouse_id"
            :items="itemWarehouse"
            label="Warehouse"
            item-value="id"
            item-text="name"
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

        <v-col cols="12">
          <v-chip label :color="statusColor(form.status)" dark>
            {{ form.status }}</v-chip
          >
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" class="mt-1">
      <v-card flat>
        <div class="scroll-container-min">
          <LazyReceiptTableDetail
            ref="childDetails"
            @calcTotal="calcTotal"
          ></LazyReceiptTableDetail>
        </div>
        <v-card-actions>
          <v-btn
            small
            depressed
            outlined
            @click="$refs.childDetails.addLine(1)"
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
      itemProduct: [],
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
  },

  // The above code is calling the methods that are defined in the methods section of the Vue instance.
  mounted() {
    this.getMasterData()
  },

  methods: {
    changeItem() {
      const item = this.form.item_id
      this.form.item_id = item.id
      this.form.commission_rate = item.commision_rate
      this.$refs.childDetails.setCommission(item.commision_rate)
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
        // this.taxAmount = this.tempTotalTax
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
              quantity: null,
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
        const resItemProduct = await this.$axios.get(`/api/inventory/items`)
        const resWarehouse = await this.$axios.get(`/api/inventory/warehouse`)
        const resAccount = await this.$axios.get(`/api/financial/accounts`, {
          params: {
            type: 'All',
          },
        })

        this.itemAccounts = resAccount.data.data
        this.itemProduct = resItemProduct.data.data
        this.itemWarehouse = resWarehouse.data.data
        this.$auth.$storage.removeState('tax')
        this.$auth.$storage.removeState('warehouse')
        this.$auth.$storage.setState('warehouse', resWarehouse.data.simple)
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

<template>
  <div>
    <DialogForm
      ref="dialogForm"
      max-width="500px"
      :dialog-title="formTitle"
      button-title="Save"
    >
      <template #content>
        <v-form class="pt-2">
          <v-container>
            <v-row dense>
              <v-col cols="12" md="12">
                <v-autocomplete
                  v-model="form.employee_id"
                  :items="itemEmployee"
                  :label="$t('Employees')"
                  item-text="full_name"
                  item-value="id"
                  outlined
                  dense
                  hide-details="auto"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.transaction_date"
                  :label="$t('Loan Request Date')"
                  outlined
                  type="date"
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.reference_no"
                  :label="$t('Reference')"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="12">
                <v-autocomplete
                  v-model="form.loan_type"
                  :items="itemLoanType"
                  :label="$t('Loan Type')"
                  item-text="name"
                  item-value="name"
                  outlined
                  dense
                  hide-details="auto"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="12">
                <vuetify-money
                  v-model="form.amount"
                  :options="moneyOptions"
                  :label="$t('Amount')"
                  outlined
                  type="number"
                  dense
                  hide-details="auto"
                ></vuetify-money>
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="form.interest_type"
                  :label="$t('Interest Type')"
                  :items="['none', 'flat', 'percent']"
                  outlined
                  dense
                  hide-details="auto"
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="6">
                <vuetify-money
                  v-model="form.interest_rate"
                  :options="moneyOptionTotal"
                  :label="$t('Interest Rate')"
                  outlined
                  type="number"
                  dense
                  hide-details="auto"
                ></vuetify-money>
              </v-col>

              <v-col cols="12" md="6">
                <vuetify-money
                  v-model="form.installment_amount"
                  :options="moneyOptionTotal"
                  :label="$t('Installment Amount')"
                  outlined
                  type="number"
                  dense
                  hide-details="auto"
                ></vuetify-money>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.installment_start_date"
                  :label="$t('Installment Start Date')"
                  outlined
                  type="date"
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <vuetify-money
                  v-model="form.admin_charge"
                  :options="moneyOptionTotal"
                  :label="$t('Admin Charge')"
                  outlined
                  type="number"
                  dense
                  hide-details="auto"
                ></vuetify-money>
              </v-col>

              <v-col cols="12" md="6">
                <vuetify-money
                  v-model="form.outstanding_loan"
                  :options="moneyOptionTotal"
                  :label="$t('Outstanding Loan')"
                  outlined
                  type="number"
                  dense
                  hide-details="auto"
                ></vuetify-money>
              </v-col>

              <v-col cols="12" md="12">
                <v-text-field
                  v-model="form.narration"
                  :label="$t('Notes')"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </template>
      <template #saveData>
        <v-btn
          color="green darken-1"
          dark
          small
          :loading="submitLoad"
          @click="save()"
        >
          {{ buttonTitle }}
        </v-btn>
      </template>
    </DialogForm>
  </div>
</template>

<script>
export default {
  name: 'FormEmployee',

  props: {
    formTitle: {
      type: String,
      default: '',
    },
    buttonTitle: {
      type: String,
      default: '',
    },
    formData: {
      type: Object,
      default() {
        return {}
      },
    },
    formUrl: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      dialog: false,
      submitLoad: false,
      show: false,
      form: this.formData,
      defaultItem: this.formData,
      itemLoanType: [],
      statusProcessing: 'insert',
      menu3: '',
      menu4: '',
      valueWhenIsEmpty: '0',
      url: '/api/payroll/loan',
      moneyOptions: {
        suffix: '',
        length: 11,
        precision: 2,
        empty: 0
      },
      moneyOptionTotal: {
        suffix: '',
        length: 11,
        precision: 0,
        empty: 0
      },
      tab: null,
      itemEmployee: [],
      itemPaymentMethod: [],
      itemPayFrequency: [],
      itemPaySchedule: [],
      itemPayType: [],
      items: [
        { tab: 'Personal Info', href: '#tab-1' },
        { tab: 'Payment method', href: '#tab-2' },
        { tab: 'Employment details', href: '#tab-3' },
        { tab: 'Pay types', href: '#tab-4' },
      ],
    }
  },

  mounted() {
    this.getMasterData()
  },

  methods: {
    async getMasterData() {
      try {
        const resLoanType = await this.$axios.get(`/api/payroll/loan-type`)

        this.itemLoanType = resLoanType.data.data
      } catch (err) {
        this.$swal({
          type: 'error',
          title: 'Error',
          text: err.response.data.error,
        })
      }
    },

    setItemEmployee(data) {
      this.itemEmployee = data
    },

    setPaymentMethod(data) {
      this.itemPaymentMethod = data
    },

    setPayFrequency(data) {
      this.itemPayFrequency = data
    },

    setPayType(data) {
      this.itemPayType = data
    },

    setPaySchedule(data) {
      this.itemPaySchedule = data
    },

    newData(form) {
      this.$refs.dialogForm.openDialog()
      this.statusProcessing = 'insert'
      this.form = Object.assign({}, form)
    },

    editItem(item) {
      this.form = Object.assign({}, item)
      this.statusProcessing = 'update'
      this.$refs.dialogForm.openDialog()
    },

    addLine(type) {
      if (type === 'email') {
        this.form.emails.push({
          email: null,
        })
      } else if (type === 'bank') {
        this.form.banks.push({
          name: null,
          branch: null,
          contact_account_name: null,
          contact_account_number: null,
        })
      }
    },

    removeLine(index, type, item) {
      if (type === 'email') {
        this.form.emails.splice(index, 1)
        this.$axios.delete(`/api/bp/delete-email/` + item.email)
      } else if (type === 'bank') {
        this.form.banks.splice(index, 1)
        this.$axios.delete(`/api/bp/delete-bank/` + item.id)
      }
    },

    close() {
      this.$refs.dialogForm.closeDialog()
      this.statusProcessing = 'insert'
      setTimeout(() => {
        this.form = Object.assign({}, this.defaultItem)
      }, 300)
    },

    save() {
      const vm = this
      const status = this.statusProcessing

      if (status === 'insert') {
        this.store('post', this.url, this.form)
        vm.submitLoad = false
      } else if (status === 'update') {
        this.store('put', this.url + '/' + this.form.id, this.form)
        vm.submitLoad = false
      }
    },

    store(method, url, data) {
      const vm = this
      vm.submitLoad = true
      this.$axios({ method, url, data })
        .then((res) => {
          this.$refs.dialogForm.closeDialog()
          this.$emit('getDataFromApi')
        })
        .catch((err) => {
          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })

          vm.submitLoad = false
        })
    },
  },
}
</script>

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

              <v-col cols="12" md="12">
                <v-text-field
                  v-model="form.transaction_date"
                  :label="$t('Transaction Date')"
                  outlined
                  type="date"
                  dense
                  hide-details="auto"
                ></v-text-field>
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

              <v-col cols="12" md="12">
                <v-text-field
                  v-model="form.narration"
                  :label="$t('Notes')"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="12">
                <v-text-field
                  v-model="form.reference_no"
                  label="Reference"
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
      itemWorkLocation: [],
      statusProcessing: 'insert',
      menu3: '',
      menu4: '',
      valueWhenIsEmpty: '0',
      url: '/api/payroll/loan',
      moneyOptions: {
        suffix: '',
        length: 11,
        precision: 2,
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
        const resEmployee = await this.$axios.get(`/api/payroll/work-locations`)

        this.itemWorkLocation = resEmployee.data.data
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

<template>
  <div>
    <DialogForm
      ref="dialogForm"
      max-width="600px"
      :dialog-title="formTitle"
      button-title="Save"
    >
      <template #content>
        <v-form class="pt-2">
          <v-container>
            <v-row dense>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.first_name"
                  :label="$t('First name')"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.middle_name"
                  :label="$t('Middle name')"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.last_name"
                  :label="$t('Last name')"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="8">
                <v-text-field
                  v-model="form.email"
                  label="Email"
                  outlined
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-card flat>
                  <v-tabs v-model="tab">
                    <v-tab
                      v-for="item in items"
                      :key="item.tab"
                      :href="item.href"
                    >
                      {{ item.tab }}
                    </v-tab>
                  </v-tabs>

                  <v-tabs-items v-model="tab">
                    <v-tab-item value="tab-1">
                      <v-row dense class="mt-2">
                        <v-col cols="12" md="5">
                          <v-text-field
                            v-model="form.birth_date"
                            :label="$t('Birth Date')"
                            prepend-icon="mdi-calendar"
                            type="date"
                            persistent-hint
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="5">
                          <v-select
                            v-model="form.gender"
                            :items="itemGender"
                            item-text="name"
                            item-value="id"
                            :label="$t('Gender')"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-select>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-text-field
                            v-model="form.address"
                            :label="$t('Address')"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-text-field
                            v-model="form.city"
                            :label="$t('City')"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-text-field
                            v-model="form.zip_code"
                            :label="$t('Zip Code')"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-text-field
                            v-model="form.home_phone"
                            :label="$t('Home Phone')"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-text-field
                            v-model="form.work_phone"
                            :label="$t('Work Phone')"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-text-field
                            v-model="form.mobile_phone"
                            :label="$t('Mobile Phone')"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-text-field
                            v-model="form.national_id"
                            label="National ID"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-tab-item>

                    <!-- payment  -->
                    <v-tab-item value="tab-2">
                      <v-row dense class="mt-2">
                        <v-col cols="12" md="12">
                          <v-autocomplete
                            v-model="form.payment_method"
                            :items="itemPaymentMethod"
                            :label="$t('Payment Method')"
                            item-text="name"
                            item-value="id"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-autocomplete>
                        </v-col>

                        <v-col
                          v-if="form.payment_method === 2"
                          cols="12"
                          md="7"
                        >
                          <v-text-field
                            v-model="form.bank_account_name"
                            :label="$t('Bank Account Name')"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>

                        <v-col
                          v-if="form.payment_method === 2"
                          cols="12"
                          md="7"
                        >
                          <v-text-field
                            v-model="form.bank_account_number"
                            :label="$t('Bank Account Number')"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-tab-item>

                    <v-tab-item value="tab-3">
                      <v-row dense class="mt-2">
                        <v-col cols="12" md="12">
                          <v-text-field
                            v-model="form.hire_date"
                            :label="$t('Hire Date')"
                            prepend-icon="mdi-calendar"
                            type="date"
                            persistent-hint
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-select
                            v-model="form.work_location_id"
                            :items="itemWorkLocation"
                            item-text="name"
                            item-value="id"
                            :label="$t('Work Location')"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-select>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-text-field
                            v-model="form.employee_id"
                            label="Employee ID"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-tab-item>

                    <v-tab-item value="tab-4">
                      <v-row dense class="mt-2">
                        <v-col cols="12" md="12">
                          <v-autocomplete
                            v-model="form.pay_schedule_id"
                            :items="itemPaySchedule"
                            :label="$t('Pay Schedule')"
                            item-text="name"
                            item-value="id"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-autocomplete>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-autocomplete
                            v-model="form.pay_type"
                            :items="itemPayType"
                            :label="$t('Pay Type')"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-autocomplete>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-autocomplete
                            v-model="form.pay_frequency"
                            :items="itemPayFrequency"
                            :label="$t('Pay Frequency')"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-autocomplete>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-text-field
                            v-model="form.salary"
                            :label="$t('Salary')"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-text-field
                            v-model="form.per_hour_rate"
                            :label="$t('Per Hour Rate')"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-text-field
                            v-model="form.hour_per_day"
                            :label="$t('Hour per day')"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="12">
                          <v-text-field
                            v-model="form.day_per_week"
                            :label="$t('Day per week')"
                            outlined
                            dense
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-tab-item>
                  </v-tabs-items>
                </v-card>
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
      url: '/api/payroll/employees',
      moneyOptions: {
        suffix: '',
        length: 11,
        precision: 2,
      },
      tab: null,
      itemGender: [],
      itemPaymentMethod: [],
      itemPayFrequency: [],
      itemPaySchedule: [],
      itemPayType: [],
      items: [
        { tab: this.$t('Personal Info'), href: '#tab-1' },
        { tab: this.$t('Payment Method'), href: '#tab-2' },
        { tab: this.$t('Employment details'), href: '#tab-3' },
        { tab: this.$t('Pay types'), href: '#tab-4' },
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

    setItemGender(data) {
      this.itemGender = data
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

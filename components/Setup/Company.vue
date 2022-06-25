<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-row no-gutters>
        <v-col cols="12" md="2" class="pa-1">
          <span class="text-subtitle-1">Company Logo</span>
        </v-col>

        <v-col cols="12" md="2" class="pa-1">
          <v-img
            v-if="companyNameView"
            max-width="250"
            max-height="150"
            :src="logo"
          ></v-img>
          <DocumentFieldUpload
            v-else
            ref="uploadField"
            form-type="company_logo"
            :form-data="form"
            @eventGetFiles="eventGetFiles"
          ></DocumentFieldUpload>
        </v-col>

        <v-col v-if="companyNameView" cols="12" md="1" class="pa-1 text-right">
          <v-btn icon small @click="companyNameView = false">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <hr />
    </v-col>

    <v-col cols="12" md="12">
      <LazySetupSectionCompanyName :form="form" :logo="logo" />
      <hr />
    </v-col>

    <v-col cols="12" md="12">
      <LazySetupSectionCompanyInfo :form="form" />
      <hr />
    </v-col>

    <v-col cols="12" md="12">
      <LazySetupSectionCompanyAddress :form="form" />
      <hr />
    </v-col>

    <v-col cols="12" md="12">
      <LazySetupSectionCompanyBank :form="form" />
      <hr />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'CompanySetup',

  props: {
    formData: {
      type: Object,
      default() {
        return {}
      },
    },
  },

  data() {
    return {
      form: this.formData,
      logo: '',
      url: '',
      itemCurrency: [],
      companyNameView: true,
      companyNameEdit: false,
    }
  },

  mounted() {
    this.companyNameView = true
  },

  methods: {
    save() {
      this.companyNameView = true
    },

    getCurrency() {
      this.$axios.get(`/api/financial/currency`).then((res) => {
        this.itemCurrency = res.data.data.rows
      })
    },

    eventGetFiles(data) {
      this.form.company_logo = data.row
      this.logo = this.url + '/files/logo/' + this.form.company_logo
      this.companyNameView = true
    },

    changeCurrency() {
      const currency = this.form.company_currency_code
      this.form.company_currency_symbol = currency.symbol
      this.form.company_currency_code = currency.code
    },

    getForm() {
      const data = new FormData()
      Object.entries(this.form).forEach((entry) => {
        const [key, value] = entry
        data.append(key, value)
      })
      return data
    },

    setForm(form, url) {
      this.form = Object.assign({}, form)
      this.url = url
      this.logo = url + '/files/logo/' + this.form.company_logo
    },
  },
}
</script>

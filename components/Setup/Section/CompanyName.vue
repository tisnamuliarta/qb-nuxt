<template>
  <v-row no-gutters>
    <v-col cols="12" md="2" class="pa-1">
      <span class="text-subtitle-1">Company Name</span>
    </v-col>
    <v-col cols="12" md="8" class="pa-1">
      <FormSectionView v-if="companyNameView">
        <template #content>
          <v-row no-gutters @click="companyNameView = false">
            <v-col cols="12" md="4" class="pa-2 font-weight-medium"
            >Company Name</v-col
            >
            <v-col cols="12" md="8" class="pa-2">
              <span class="text-subtitle-2" v-text="form.company_name"></span>
            </v-col>

            <v-col cols="12" md="4" class="pa-2 font-weight-medium"
            >Legal Name</v-col
            >
            <v-col cols="12" md="8" class="pa-2">
              <span class="text-subtitle-2" v-text="form.company_name"></span>
            </v-col>

            <v-col cols="12" md="4" class="pa-2 font-weight-medium"
            >Tax Number</v-col
            >
            <v-col cols="12" md="8" class="pa-2">
              <span class="text-subtitle-2" v-text="form.company_tax_number"></span>
            </v-col>
          </v-row>
        </template>
      </FormSectionView>

      <FormSectionEdit ref="sectionEdit" v-else @save="save" @cancel="cancel">
        <template #content>
          <v-row no-gutters>
            <v-col cols="12" md="5" class="pa-2">
              <v-list-item two-line class="pa-0">
                <v-list-item-content>
                  <v-list-item-title>Company Name</v-list-item-title>
                  <v-list-item-subtitle
                  >Show in sales order and purchase
                    forms</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col cols="12" md="7" class="pa-2">
              <v-text-field
                label="Company Name"
                v-model="form.company_name"
                filled
                dense
                hide-details="auto"
              />
            </v-col>

            <v-col cols="12" md="5" class="pa-2">Legal Name</v-col>
            <v-col cols="12" md="7" class="pa-2">
              <v-text-field
                label="Company Name"
                v-model="form.company_name"
                filled
                dense
                hide-details="auto"
              />
            </v-col>

            <v-col cols="12" md="5" class="pa-2">Tax Number</v-col>
            <v-col cols="12" md="7" class="pa-2">
              <v-text-field
                label="Tax Number"
                v-model="form.company_tax_number"
                filled
                dense
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </template>
      </FormSectionEdit>
    </v-col>
    <v-col v-if="companyNameView" cols="12" md="1" class="pa-1 text-right">
      <v-btn icon small @click="companyNameView = false">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default() {
        return {}
      },
    },

    logo: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      companyNameView: true,
    }
  },

  methods: {
    save() {
      this.$refs.sectionEdit.save(this.form)
      this.companyNameView = true
    },

    cancel() {
      this.companyNameView = true
    },
  },
}
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12" md="2" class="pa-1">
      <span class="text-subtitle-1">Projects</span>
    </v-col>
    <v-col cols="12" md="8" class="pa-1">
      <FormSectionView v-if="companyNameView">
        <template #content>
          <v-row no-gutters @click="companyNameView = false">
            <v-col cols="12" md="4" class="pa-2 font-weight-medium">
              Organize all job-related activity in one place
            </v-col>
            <v-col cols="12" md="8" class="pa-2">
              <span
                class="text-subtitle-2"
                v-text="$formatter.formatCheckBox(formData.advanced_project)"
              ></span>
            </v-col>
          </v-row>
        </template>
      </FormSectionView>

      <FormSectionEdit v-else ref="sectionEdit" @save="save" @cancel="cancel">
        <template #content>
          <v-row no-gutters>
            <v-col cols="12" md="5" class="pa-2">
              <v-checkbox
                v-model="formData.advanced_project"
                label="Organize all job-related activity in one place"
                hide-details="auto"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="7" class="pa-2">
              <span
                class="text-subtitle-2"
                v-text="$formatter.formatCheckBox(formData.advanced_project)"
              ></span>
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
      formData: this.form,
      companyNameView: true,
      itemPaymentTerm: [],
      itemDeliveryMethod: ['Print Later', 'Send Later', 'None'],
    }
  },

  methods: {
    save() {
      this.$refs.sectionEdit.save(this.formData)
      this.companyNameView = true
    },

    cancel() {
      this.companyNameView = true
    },
  },
}
</script>

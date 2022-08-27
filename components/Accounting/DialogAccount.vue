<template>
  <div>
    <DialogForm
      ref="dialogForm"
      max-width="1000px"
      :dialog-title="$t('Chart Of Accounts')"
      button-title="Save"
      original="top"
    >
      <template #content>
        <v-container>
          <AccountingTableAccount
            ref="tableItem"
            :view-data="viewData"
            :form-type="formType"
            :show-add-btn="showAddBtn"
          ></AccountingTableAccount>
        </v-container>
      </template>

      <template #saveData>
        <v-btn color="green darken-1" dark small @click="selectData">
          Select Item
          <v-icon>mdi-arrow-down-right</v-icon>
        </v-btn>
      </template>
    </DialogForm>
  </div>
</template>

<script>
export default {
  name: 'DialogItem',

  props: {
    viewData: {
      type: Boolean,
      default: true,
    },
    showAddBtn: {
      type: Boolean,
      default: true,
    },
    formType: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      row: null,
    }
  },

  methods: {
    openDialog(row, formTypeData) {
      this.$refs.dialogForm.openDialog()
      setTimeout(() => {
        this.$refs.tableItem.setEmptyToSelected(formTypeData)
      }, 150)
      this.row = row
    },

    selectData() {
      this.$emit('selectItems', {
        row: this.row,
        selected: this.$refs.tableItem.returnSelected(),
      })
      this.$refs.dialogForm.closeDialog()
    },
  },
}
</script>

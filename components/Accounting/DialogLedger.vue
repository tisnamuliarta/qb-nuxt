<template>
  <div>
    <DialogForm
      ref="dialogForm"
      max-width="1000px"
      :dialog-title="$t('Journal Entry')"
      button-title="Save"
      original="top"
    >
      <template #content>
        <v-container>
          <v-row>
            <v-col cols="12" class="mt-0">
              <v-data-table
                :mobile-breakpoint="0"
                :headers="headers"
                :items="allData"
                :items-per-page="150"
                :options.sync="options"
                :server-items-length="totalData"
                :loading="loading"
                class="elevation-0"
                show-select
                fixed-header
                height="60vh"
                hide-default-footer
                dense
                :footer-props="{
                  'items-per-page-options': [150, 250, 500, -1],
                }"
              >
                <template #[`item.entity_id`]="{ item }">
                  <span v-if="item.entry_type === 'D'">
                    {{
                      $auth.user.entity.currency.currency_symbol +
                      ' ' +
                      $formatter.formatPrice(item.amount)
                    }}
                  </span>
                </template>

                <template #[`item.id`]="{ item }">
                  <span v-if="item.entry_type === 'C'">
                    {{
                      $auth.user.entity.currency.currency_symbol +
                      ' ' +
                      $formatter.formatPrice(item.amount)
                    }}
                  </span>
                </template>

                <template  #[`body.append`]>
                  <tr class="pink--text">
                    <th class="title"></th>
                    <th class="title">{{ sumField('calories') }}</th>
                    <th class="title">{{ sumField('fat') }}</th>
                    <th class="title">{{ sumField('carbs') }}</th>
                    <th class="title">{{ sumField('protein') }}</th>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
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
  },

  data() {
    return {
      row: null,
      url: '',
      allData: [],
      totalData: 0,
      loading: false,
      options: {},
      headers: [
        { text: 'Account Code', value: 'post_account.code' },
        { text: 'Account Name', value: 'post_account.name' },
        { text: 'Debit', value: 'entity_id', cellClass: 'disable-wrap' },
        { text: 'Credit', value: 'id', cellClass: 'disable-wrap' },
      ],
    }
  },

  methods: {
    sumField(key) {
        // sum data in give key (property)
        return this.allData.reduce((a, b) => a + (b[key] || 0), 0)
    },

    openDialog(url) {
      this.$refs.dialogForm.openDialog()
      this.url = url
      this.getDataFromApi()
    },

    getDataFromApi() {
      this.loading = true
      this.$axios
        .get(this.url)
        .then((res) => {
          this.loading = false
          const data = res.data

          this.allData = data.data
          this.totalData = data.total
        })
        .catch((err) => {
          this.loading = false
          this.$swal({
            type: 'error',
            title: 'Error',
            text: err.response.data.message,
          })
        })
    },
  },
}
</script>

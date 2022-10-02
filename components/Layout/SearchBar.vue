<template>
  <v-dialog v-model="dialog" scrollable max-width="500px">
    <v-card>
      <v-card-text>
        <v-text-field
          v-model="select"
          :loading="loading"
          :search-input.sync="search"
          cache-items
          class="mt-3 mb-3"
          flat
          hide-no-data
          hide-details
          label="Search Transactions"
          append-icon="mdi-magnify"
          solo-inverted
        ></v-text-field>

        <v-list two-line>
          <v-list-item-group
            v-model="selected"
            active-class="pink--text"
            multiple
          >
            <div v-for="(item, index) in items" :key="index">
              <v-list-item>
                <template #default="{ active }">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>

                    <v-list-item-subtitle
                      class="text--primary"
                      v-text="item.headline"
                    ></v-list-item-subtitle>

                    <v-list-item-subtitle
                      v-text="item.subtitle"
                    ></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-list-item-action-text
                      v-text="item.action"
                    ></v-list-item-action-text>

                    <v-icon v-if="!active" color="grey lighten-1">
                      mdi-star-outline
                    </v-icon>

                    <v-icon v-else color="yellow darken-3"> mdi-star </v-icon>
                  </v-list-item-action>
                </template>
              </v-list-item>

              <v-divider
                v-if="index < items.length - 1"
                :key="index"
              ></v-divider>
            </div>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      dialog: false,
      selected: [2],
      select: '',
      loading: false,
      items: [
        {
          action: '15 min',
          headline: 'Brunch this weekend?',
          subtitle: `I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
          title: 'Ali Connors',
        },
        {
          action: '2 hr',
          headline: 'Summer BBQ',
          subtitle: `Wish I could come, but I'm out of town this weekend.`,
          title: 'me, Scrott, Jennifer',
        },
      ],
    }
  },

  methods: {
    openDialog() {
      this.dialog = true
    },
  },
}
</script>

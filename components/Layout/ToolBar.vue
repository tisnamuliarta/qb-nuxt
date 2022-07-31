<template>
  <div>
    <!--    <v-menu offset-y left :nudge-width="700">-->
    <!--      <template #activator="{ on }">-->
    <!--        <v-btn-->
    <!--          color="primary"-->
    <!--          small-->
    <!--          icon-->
    <!--          v-on="on"-->
    <!--        >-->
    <!--          <v-icon>mdi-plus-circle</v-icon>-->
    <!--        </v-btn>-->
    <!--      </template>-->

    <!--      <v-card>-->
    <!--        <LazyFormNew ref="formNew" @openAction="openAction" />-->
    <!--      </v-card>-->
    <!--    </v-menu>-->

    <v-menu
      v-model="menu2"
      transition="slide-y-transition"
      bottom
      offset-y
      left
      :nudge-width="400"
    >
      <template #activator="{ on }">
        <v-btn small icon class="mr-2" v-on="on">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>

      <v-card>
        <LazyFormSearch ref="formSetting" @openAction="openAction" />
      </v-card>
    </v-menu>

    <v-tooltip bottom>
      <template #activator="{ on }">
        <v-btn small icon class="mr-2" v-on="on">
          <v-icon>mdi-bell</v-icon>
        </v-btn>
      </template>
      <span>Notifications</span>
    </v-tooltip>

    <!-- <v-tooltip bottom>
      <template #activator="{ on }">
        <v-btn small icon class="mr-2" v-on="on" @click="$router.push('/dashboard/settings/setup')">
          <v-icon>mdi-cog</v-icon>
        </v-btn
        >
      </template>
      <span>Settings</span>
    </v-tooltip> -->

    <v-menu
      v-model="menu"
      transition="slide-y-transition"
      bottom
      offset-y
      left
      close-on-content-click
      :nudge-width="700"
    >
      <template #activator="{ on }">
        <v-btn small icon class="mr-2" v-on="on">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>

      <v-card>
        <LazyFormSetting ref="formSetting" @openAction="openAction" />
      </v-card>
    </v-menu>

    <v-menu offset-y left :nudge-width="150">
      <template #activator="{ on }">
        <v-btn
          x-small
          color="green"
          depressed
          fab
          class="white--text"
          v-on="on"
        >
          {{ $auth.loggedIn ? $auth.user.name.substring(0, 1) : '' }}
        </v-btn>
      </template>

      <v-card>
        <v-list dense nav>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ $auth.user.name }}</v-list-item-title>
              <v-list-item-subtitle>{{
                $auth.user.position
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list dense nav>
          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-login-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Sign out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'ToolBar',

  data() {
    return {
      username: '',
      menu: false,
      menu2: false,
    }
  },

  mounted() {
    this.username = this.$auth.user.name.substring(0, 1)
  },

  methods: {
    openAction(data) {
      this.menu = false
      if (data.item.route) {
        this.$emit('openAction', data)
      } else {
        this.$router.push({
          path: '/app/settings',
        })
      }
    },

    async logout() {
      await this.$auth.logout()
      this.$auth.$storage.removeLocalStorage('app.default_name')
      this.$auth.$storage.removeLocalStorage('employee')
      this.$auth.$storage.removeLocalStorage('country')

      localStorage.removeItem('roles')
      localStorage.removeItem('permissions')
    },
  },
}
</script>

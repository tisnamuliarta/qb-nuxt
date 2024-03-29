<template>
  <v-app>
    <v-app-bar
      app
      :color="dark ? undefined : 'white'"
      class="v-bar--underline v-toolbar-flat"
      flat
    >
      <v-app-bar-nav-icon @click="changeDrawer()"></v-app-bar-nav-icon>

      <v-toolbar-title class="ml-0 pl-0">
        <span
          class="font-weight-bold hidden-sm-and-down"
          style="cursor: pointer"
          @click="$router.push('/home/business-overview')"
          v-text="companyName"
        ></span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <LazyLayoutToolBar ref="toolbar" @openAction="openAction" />

      <template v-if="showExtension" #extension>
        <v-tabs
          v-model="activeExtension"
          align-with-title
          color="black"
          slider-color="green"
          show-arrows
          style="margin-left: 10px"
          slider-size="4"
        >
          <v-tab
            v-for="(item, key) in extensionTabs"
            :key="key"
            @click="$router.push(item.route)"
          >
            <v-icon v-if="item.icon" class="mr-2">{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-tab>
        </v-tabs>

        <v-spacer />

        <v-menu
          v-if="showExtensionButton"
          transition="slide-y-transition"
          :close-on-content-click="false"
          offset-y
          bottom
        >
          <template #activator="{ on, attrs }">
            <v-btn small color="primary" elevation="0" v-bind="attrs" v-on="on">
              New Transactions
              <v-btn dark small icon>
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item
              v-for="(value, i) in extensionMenu"
              :key="i"
              dense
              @click="
                $router.push({
                  path: value.route,
                  query: {
                    document: 0,
                    type: value.type,
                  },
                })
              "
            >
              <v-list-item-content>
                <v-list-item-title>{{ value.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <!-- <LazyLayoutNavigationDrawer
      ref="navDrawer"
      :drawer="drawer"
      @openAction="openAction"
    /> -->

    <v-navigation-drawer
      id="nav"
      v-model="drawer"
      class="blue-grey darken-4"
      dark
      app
      :temporary="$route.name === 'dashboard-settings-setup'"
    >
      <v-list dense nav>
        <NuxtLink to="/home/business-overview">
          <v-skeleton-loader
            v-show="loadImage"
            type="avatar"
            class="mx-auto logo mb-3"
          >
          </v-skeleton-loader>
          <img v-show="!loadImage" :src="logo" class="mt-1 mb-3" height="50" />
        </NuxtLink>

        <div class="text-center" style="margin-bottom: 10px; margin-top: -10px;">
          <v-menu
            v-model="menu"
            class="text-center"
            transition="slide-y-transition"
            bottom
            offset-y
            left
            close-on-content-click
            :nudge-width="600"
          >
            <template #activator="{ on }">
              <v-btn
                rounded
                small
                color="primary"
                class="text-center"
                elevation="2"
                v-on="on"
              >
                <!-- <v-icon>mdi-new-box</v-icon> -->
                {{ $t('New Transactions') }}
              </v-btn>
            </template>

            <v-card class="rounded-lg" elevation="18">
              <LazyFormNew ref="formNew" @openAction="openAction" />
            </v-card>
          </v-menu>
        </div>

        <v-divider></v-divider>

        <v-list-group
          v-for="item in items"
          :key="item.menu"
          active-class="border"
          :prepend-icon="item.icon"
          append-icon="mdi-menu-down"
        >
          <template #activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.menu"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="(child, i) in item.children"
            :key="i"
            link
            :to="child.route_name"
            style="padding-left: 64px"
          >
            <v-list-item-content>
              <v-list-item-title v-text="child.menu"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon v-if="child.icon">
              <v-icon v-text="child.icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-main class="grey lighten-4">
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>

      <v-container fluid>
        <!-- <Nuxt/> -->
        <Nuxt
          keep-alive
          :keep-alive-props="{ exclude: ['pages/sales/quote.vue'] }"
        />
      </v-container>
    </v-main>

    <v-snackbar v-model="snackbar" top centered color="primary" elevation="24">
      {{ message }}
      <template #action="{ attrs }">
        <v-btn color="pink" small icon v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <!-- <LazySetupListSetting ref="settingForm" /> -->

    <v-idle
      :loop="true"
      :reminders="[10, 15]"
      :wait="5"
      :duration="3600"
      @idle="onIdle"
      @remind="onRemind"
    />

    <!-- <v-footer color="grey lighten-3" padless>
      <v-col class="text-center" cols="12">
        Copyright © {{ new Date().getFullYear() }} —
        <strong> {{ company.company_name }} </strong>
      </v-col>
    </v-footer> -->
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  middleware: 'auth',
  data() {
    return {
      snackbar: false,
      overlay: false,
      clipped: false,
      drawer: false,
      fixed: false,
      menu: false,
      dark: undefined,
      message: '',
      items: [],
      company: [],
      miniVariant: false,
      right: true,
      logo: '',
      rightDrawer: false,
      loadImage: false,
      companyName: '',
      showExtension: false,
      showExtensionButton: false,
      extensionMenu: [],
      extensionTabs: '',
      activeExtension: 0,
    }
  },

  mounted() {
    // enable using draggable dialogs
    // this.activateMultipleDraggableDialogs()
    this.drawer = !this.$vuetify.breakpoint.mdAndDown
    this.drawer =
      this.$route.name === 'dashboard-documents-form' ? false : this.drawer
    // this.changeDrawer()
  },

  created() {
    this.menus()
    this.rolePermission()
    this.getCompany()
    this.$nuxt.$on('getMenu', ($event) => this.menus($event))
    this.$nuxt.$on('getLogo', ($event) => this.getLogo($event))
    this.$nuxt.$on('getCompany', ($event) => this.getCompany($event))
    this.$nuxt.$on('snackbar', ($event) => this.openSnackbar($event))
    // this.$nuxt.$on('openSetting', ($event) => this.openSetting($event))
    this.$nuxt.$on('showLoading', ($event) => this.showLoading($event))
    this.$nuxt.$on('hideLoading', ($event) => this.hideLoading($event))
    this.$nuxt.$on('extensionActive', ($event) => this.extensionActive($event))
    this.$nuxt.$on('extensionSetting', ($event) =>
      this.extensionSetting($event)
    )
    this.getLogo()
  },

  methods: {
    onIdle() {
      this.$swal({
        type: 'warning',
        title: 'Warning',
        text: 'You have been logged out',
      })
      this.logout()
    },
    onRemind(time) {
      this.$swal({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'warning',
        type: 'warning',
        title: 'Warning',
        text: time,
      })
    },

    openSnackbar(data) {
      if (data) {
        this.snackbar = true
        this.message = data
      }
    },

    openSetting(data) {
      this.$refs.settingForm.openDialog(data, 0, null)
    },

    showLoading() {
      this.overlay = true
    },

    hideLoading() {
      this.overlay = false
    },

    openAction(data) {
      this.menu = false
      if (data.item.route) {
        this.overlay = true
        this.$router.push({
          path: data.item.route,
          query: {
            document: 0,
          },
        })
        this.overlay = false
      } else if (data.item.type === 'function') {
        this[data.item.action]()
      } else {
        this.$refs.settingForm.openDialog(data, 0, null)
      }
    },

    extensionSetting(data) {
      this.showExtension = data.show
      this.showExtensionButton = data.showBtn
      this.extensionTabs = data.tabs
      this.extensionMenu = data.itemBtn
    },

    extensionActive(data) {
      this.activeExtension = parseInt(data.active)
    },

    changeDrawer() {
      this.drawer = !this.drawer
      // this.$refs.navDrawer.setDrawer(this.drawer)
    },

    getLogo() {
      this.loadImage = true
      this.$axios.get(`/api/logo`).then((res) => {
        this.logo = res.data.logo
        // this.$refs.navDrawer.setLogo(this.logo)
        this.loadImage = false
      })
    },

    getCompany() {
      this.$axios
        .get(`/api/settings`, {
          params: {
            page: 'company',
          },
        })
        .then((res) => {
          this.$auth.$storage.setState('company', res.data.form)
          this.company = this.$auth.$storage.getState('company')
          this.companyName = res.data.form.company_name
        })
    },

    async logout() {
      await this.$auth.logout()
      this.$auth.$storage.removeLocalStorage('app.default_name')
      this.$auth.$storage.removeLocalStorage('employee')
      this.$auth.$storage.removeLocalStorage('country')

      localStorage.removeItem('roles')
      localStorage.removeItem('permissions')
    },

    rolePermission() {
      this.$axios.post('/api/auth/roles').then((res) => {
        this.$gates.setRoles(res.data)
      })
      this.$axios.post('/api/auth/permissions').then((res) => {
        this.$gates.setPermissions(res.data)
      })
    },

    menus() {
      const appName = this.$auth.$storage.getLocalStorage('app.default_name')
      this.$axios
        .get(`/api/menus`, {
          params: {
            appName,
            locale: this.$i18n.locale,
          },
        })
        .then((res) => {
          this.items = res.data.menus
          // this.$refs.navDrawer.setItems(this.items)
        })
        .catch((err) => {
          if (
            err.response.data.message ===
            'Call to a member function getAllPermissions() on null'
          ) {
            this.logout()
          }
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

<style scoped>
.v-toolbar-flat {
  box-shadow: 0 1px 0 0 rgb(0 0 0 / 20%), 0 0 0 0 rgb(0 0 0 / 14%),
    0 0 0 0 rgb(0 0 0 / 12%) !important;
}
</style>

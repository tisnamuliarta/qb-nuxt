<template>
  <v-row no-gutters align="center" align-content="center" justify="center">
    <v-col cols="12" sm="6" md="5" lg="4" xl="3" align-self="center">
      <v-form @keyup.native.enter="login">
        <v-card class="mt-3" elevation="0">
          <v-row no-gutters>
            <v-col cols="12" md="12">
              <v-card-text class="pb-0 mt-4">
                <v-row no-gutters>
                  <v-col cols="7">
                    <span class="text-h6">Sign In to your account</span> <br />
                    <span>Enter details below</span>
                  </v-col>
                  <v-col cols="5" class="text-right">
                    <img
                      :src="logo"
                      class="align-items-center justify-center logo"
                      alt="Logo"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-divider />
                  </v-col>

                  <v-col cols="12" class="mb-4 mt-4">
                    <v-text-field
                      v-model="form.username"
                      filled
                      label="Username"
                      required
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="mb-4">
                    <v-text-field
                      v-model="form.password"
                      :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
                      :type="show ? 'text' : 'password'"
                      filled
                      label="Password"
                      required
                      hide-details="auto"
                      @click:append="show = !show"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" class="mb-1">
                    <v-select
                      v-model="form.localeApp"
                      label="Language"
                      :items="language"
                      item-text="text"
                      item-value="value"
                      filled
                      hide-details
                    ></v-select>
                  </v-col>

                  <v-col cols="12" class="mb-1">
                    <v-checkbox
                      v-model="form.remember"
                      label="Remember Me"
                      color="success"
                      off-icon="mdi-checkbox-blank-outline"
                      on-icon="mdi-checkbox-marked"
                      hide-details
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  elevation="0"
                  class="mr-2"
                  :loading="loading"
                  @click="login"
                >
                  Sign In
                </v-btn>
              </v-card-actions>
            </v-col>

            <!-- <v-col cols="12" md="6" class="d-sm-none d-none d-md-flex">
              <v-divider vertical></v-divider>
              <v-img :src="bgLogin"></v-img>
            </v-col> -->
          </v-row>
        </v-card>
      </v-form>

      <v-snackbar
        v-model="snackbar"
        bottom
        multi-line
        transition="slide-y-transition"
      >
        {{ text }}

        <template #action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'AuthLogin',
  layout: 'auth',
  middleware: 'guest',
  data() {
    return {
      form: {
        username: '',
        password: '',
        remember: false,
        localeApp: 'id',
        app_name: process.env.appName,
      },
      defaultForm: {
        username: '',
        password: '',
        remember: false,
        localeApp: 'id',
        app_name: process.env.appName,
      },
      language: [
        { text: 'English', value: 'en' },
        { text: 'Indonesia', value: 'id' },
      ],
      snackbar: false,
      text: '',
      appName: process.env.appName,
      select: null,
      show: false,
      loading: false,
      checkbox: null,
      loadImage: false,
      eye: true,
      remember: false,
      busy: false,
      message: '',
      logo: '',
      bgLogin: '',
      error: false,
      apps: [],
    }
  },

  head() {
    return {
      title: 'Login',
    }
  },

  mounted() {
    // this.$nextTick(() => {
    //   this.$nuxt.$loading.start()
    // })
    this.getLogo()
  },

  methods: {
    getLogo() {
      this.$axios
        .get(`/api/logo`)
        .then((res) => {
          this.logo = res.data.default
          this.bgLogin = res.data.bgLogin
        })
        .finally(() => {
          this.$nuxt.$loading.finish()
        })
    },

    clear() {
      this.form = Object.assign({}, this.defaultForm)
    },

    login() {
      this.loading = true
      this.$auth
        .loginWith('local', {
          data: this.form,
        })
        .then((response) => {
          this.loading = false
          this.$i18n.setLocale(this.form.localeApp)
          // this.$router.push('/dashboard')
          // Otherwise, go to home page
          window.location.href = '/qbi/home/business-overview'
          // // Then check callback rediect
          // if (this.$auth.$state.redirect) {
          //   // If rediect to login page from page that is required authentication (auth midleware), go that page
          //   window.location.href = this.$auth.$state.redirect
          // } else if (this.$route.query.service) {
          //   window.location.href = this.$route.query.service
          // } else {
          //   // Otherwise, go to home page
          //   window.location.href = '/qbi/home/business-overview'
          // }
        })
        .catch((err) => {
          this.loading = false
          this.snackbar = true
          this.text = err.response.data.message
          // this.$swal({
          //   type: 'error',
          //   title: 'Error',
          //   text: err.response.data.message,
          // })
        })
    },
  },
}
</script>

<style scoped>
.logo {
  width: 150px;
  margin: 0 auto;
  text-align: center;
}
</style>

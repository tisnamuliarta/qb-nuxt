import colors from 'vuetify/es5/util/colors'

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  ssr: false,

  env: {
    baseApi: process.env.BASE_API,
  },

  publicRuntimeConfig: {
    baseApi: process.env.BASE_API,
    nodeEnv: 'dev',
  },
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    titleTemplate: '%s',
    title: process.env.APP_NAME || '',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.APP_NAME || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/icon.png' }],
  },
  /*
   ** Customize the progress-bar color
   */
  // loading: {
  //   color: 'green',
  //   height: '5px',
  //   throttle: 0,
  // },

  loading: '~/components/Common/LoadingBar.vue',

  loadingIndicator: {
    name: 'three-bounce',
    color: 'green',
    background: 'white'
  },

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  /*
   ** Global CSS
   */
  css: ['@mdi/font/scss/materialdesignicons.scss', '~/assets/css/style.scss'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: '~/plugins/helper.js' },
    { src: '~/plugins/formatter.js' },
    { src: '~/plugins/dragable.js' },
    { src: '~/plugins/vidle.js' },
    { src: '~/plugins/vue-gates.js' },
    // { src: '~/plugins/vue-graph.js' },
    { src: '~/plugins/vuetify-money.js' },
    { src: '~/plugins/axios-host.js' },
    { src: '~/plugins/hotkey.js' },
    // { src: '~/plugins/vue-mask.js' },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    'nuxt-compress',
    'nuxt-webpack-optimisations',
    '@nuxtjs/moment',
    // 'nuxt-vite',
    // '@nuxtjs/web-vitals',
    // '@nuxt/image',
    // '@nuxtjs/google-fonts',
  ],

  webpackOptimisations: {
    features: {
      hardSourcePlugin: process.env.NODE_ENV === 'development',
      parallelPlugin: process.env.NODE_ENV === 'development',
    },
    measure: true,
  },

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth-next',
    'nuxt-sweetalert2',
    'cookie-universal-nuxt',
    '@nuxtjs/i18n',
    // 'nuxt-lodash',
    // 'nuxt-seo-meta',
    // '@luxdamore/nuxt-prune-html',
    // 'nuxt-precompress',a
  ],

  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.js',
      },
      {
        code: 'id',
        file: 'id.js',
      },
    ],
    lazy: true,
    strategy: 'no_prefix',
    baseUrl: '/',
    langDir: 'lang/',
    defaultLocale: 'en',
  },

  auth: {
    // localStorage: {
    //   prefix: process.env.AUTH_PREFIX,
    // },
    localStorage: false,
    cookie: {
      prefix: process.env.AUTH_PREFIX,
    },
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'token',
          global: true,
          maxAge: 60 * 60 * 8,
          // required: true,
          // type: 'Bearer'
        },
        refreshToken: {
          property: 'token',
          data: 'token',
          maxAge: 60 * 60 * 24 * 30,
        },
        user: {
          property: 'user',
          autoFetch: true,
        },
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/auth/user', method: 'get' },
          refresh: { url: '/api/auth/refresh', method: 'post' },
        },
      },
    },
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      home: false,
    },
  },
  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
    meta: {
      name: process.env.APP_NAME
    }
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    debug: false,
    credentials: true,
    // baseURL: location.protocol + '//' + location.hostname + process.env.BASE_API, // Used as fallback if no runtime config is provided
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    defaultAssets: false,
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.green.darken3,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          primary: colors.green,
          accent: colors.grey.darken3,
          secondary: colors.blue,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent4,
        },
      },
    },
  },

  router: {
    base: process.env.BASE_ROUTE
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
   build: {
    // analyze: true,
    // parallel: true,
    // hardSource: true,
    // cache: true,
    // devtools: true,
    // corejs: 'auto',
    // transpile: ['@visable-vue', 'vee-validate/dist/rules', 'v-tooltip'],
  },
}

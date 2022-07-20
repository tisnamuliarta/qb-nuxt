export default function ({$axios, $config: { baseApi, nodeEnv }}) {
  if (process.client) {
    if (nodeEnv === 'dev') {
      $axios.defaults.baseURL = window.location.protocol + '//' + window.location.hostname + baseApi
    } else {
      $axios.defaults.baseURL = window.location.protocol + '//' + window.location.host + baseApi
    }
  }
}

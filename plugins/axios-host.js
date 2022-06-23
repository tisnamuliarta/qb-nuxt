export default function ({$axios, $config: { myPublicVariable }}) {
  if (process.client) {
    $axios.defaults.baseURL = window.location.protocol + '//' + window.location.hostname + myPublicVariable
  }
}

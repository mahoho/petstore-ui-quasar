<template>
  <div id="axios-interceptors" />
</template>

<script>

export default {
  name: "AxiosInterceptors",
  mounted() {
    this.$axios.interceptors.response.use((response) => {
      this.handleResponse(response)

      return response
    }, (error) => {
      this.handleResponse(error.response)

      return Promise.reject(error)
    })
  },
  methods: {
    handleResponse (response) {
      if (!response) {
        return
      }

      function statusCodes () {
        return {
          '100': 'Continue',
          '101': 'Switching Protocols',
          '102': 'Processing',

          '200': 'OK',
          '201': 'Created',
          '202': 'Accepted',
          '203': 'Non-authoritative Information',
          '204': 'No Content',
          '205': 'Reset Content',
          '206': 'Partial Content',
          '207': 'Multi-Status',
          '208': 'Already Reported',
          '226': 'IM Used',

          '300': 'Multiple Choices',
          '301': 'Moved Permanently',
          '302': 'Found',
          '303': 'See Other',
          '304': 'Not Modified',
          '305': 'Use Proxy',
          '307': 'Temporary Redirect',
          '308': 'Permanent Redirect',

          '400': 'Bad Request',
          '401': 'Unauthorized',
          '402': 'Payment Required',
          '403': 'Forbidden',
          '404': 'Not Found',
          '405': 'Method Not Allowed',
          '406': 'Not Acceptable',
          '407': 'Proxy Authentication Required',
          '408': 'Request Timeout',
          '409': 'Conflict',
          '410': 'Gone',
          '411': 'Length Required',
          '412': 'Precondition Failed',
          '413': 'Payload Too Large',
          '414': 'Request-URI Too Long',
          '415': 'Unsupported Media Type',
          '416': 'Requested Range Not Satisfiable',
          '417': 'Expectation Failed',
          '418': 'I\'m a teapot',
          '421': 'Misdirected Request',
          '422': 'Unprocessable Entity',
          '423': 'Locked',
          '424': 'Failed Dependency',
          '426': 'Upgrade Required',
          '428': 'Precondition Required',
          '429': 'Too Many Requests',
          '431': 'Request Header Fields Too Large',
          '444': 'Connection Closed Without Response',
          '451': 'Unavailable For Legal Reasons',
          '499': 'Client Closed Request',

          '500': 'Internal Server Error',
          '501': 'Not Implemented',
          '502': 'Bad Gateway',
          '503': 'Service Unavailable',
          '504': 'Gateway Timeout',
          '505': 'HTTP Version Not Supported',
          '506': 'Variant Also Negotiates',
          '507': 'Insufficient Storage',
          '508': 'Loop Detected',
          '510': 'Not Extended',
          '511': 'Network Authentication Required',
          '599': 'Network Connect Timeout Error',
        }
      }
      function handleValidationErrors (response) {
        if (!response.data) {
          return null
        }

        // Attempt to parse Laravel-structured validation errors.
        try {
          let messages = {}

          for (var key in response.data.errors) {
            messages[key] = response.data.errors[key].join(',')
          }

          return messages
        } catch (e) {
          return response.data
        }
      }

      // var categories = ['informational', 'success', 'redirection', 'client-error', 'server-error']
      var status = response.status
      var codes = statusCodes()

      if (!codes[status]) {
        return false
      }

      // var statusCategory = parseInt(status.toString().charAt(0))
      // var category = categories[statusCategory - 1]
      // var sluggedCode = slugify(codes[status])
      var data = { status: status, code: codes[status], body: response.data }

      // Parse the validation errors.
      if (parseInt(status) === 422) {
        data.body = handleValidationErrors(response)
      }

      // v.$emit('response', data)
      // v.$emit('response:' + category, data)
      // v.$emit('response:' + sluggedCode, data)
      // v.$emit('response:' + status, data)
      // v.$emit('response:' + statusCategory + 'xx', data)
      let pathname = window.location.hash ? window.location.hash.replace('#', '') : window.location.pathname;

      let location = window.location.href

      let doNotRedirectUrls = ['/login', '/register', '/reset_password', '/forgot_password']

      let redirect = true

      for(let path of doNotRedirectUrls){
        if(location.indexOf(path) > -1){
          redirect = false
          break
        }
      }

      if (status === 401 && redirect) {
        this.$store.commit('mainStore/user', {});
        this.$router.replace('/login')
      }

      // access denied
      if (status === 403 && ['/dashboard'].indexOf(pathname) === -1) {
        this.$router.replace('/dashboard')
      }

      // login failed
      if (status === 406) {
        return this.notifyError(data.body.error)
      }

      // custom error message
      if (status === 411) {
        return this.notifyError(data.body.message)
      }

      if (status === 410 && location.indexOf('/waiting_for_verification') === -1 && !redirect) {
        return this.$router.replace('/waiting_for_verification')
      }

      // validation errors
      if (status === 422) {
        let validationErrors = data.body.errors
        let field
        let error = ''

        for (field in validationErrors) {
          error += field + ': ' + validationErrors[field] + '\n'
        }

        return this.notifyError(error)
      }

      // server errors
      if (status === 500) {
        let error = data.body.message

        if (data.body.file) {
          error += ' on ' + data.body.file + ':' + data.body.line
        }

        return this.notifyError(error)
      }

      return true
    },

    notifyError (error) {
      this.$q.notify({
        message: error,
        type: 'negative',
        // color: 'danger'
      })
    }
  }
}
</script>

<style scoped>

</style>

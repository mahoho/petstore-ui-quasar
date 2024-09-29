<template>
  <q-page class="flex flex-center login-page">
    <form @submit.prevent="sendLink" class="login-form text-center">
      <div class="header">
        <img src="~assets/images/logo.png"
             class="logo"
             alt="Logo"
        />
      </div>
      <div class="content">
        <div class="title q-mb-md">
          Forgot password?
        </div>

        <div class="inputs">
          <div class="form-input">
            <input type="email"
                   required
                   autofocus
                   name="email"
                   v-model="email"
                   placeholder="Your email"
                   class="bordered-input"
            />
          </div>

        </div>

        <div class="text-primary" v-show="sent">
          Request sent. Please check you email.
        </div>

        <div class="login-buttons">
          <q-btn color="primary" type="submit" label="Reset" />
        </div>

        <router-link to="/login" class="q-my-md block">
          Back to Log in
        </router-link>
      </div>
    </form>
  </q-page>
</template>

<script>

export default {
  name: 'ForgotPasswod',
  data: function () {
    return {
      email: '',
      sent: false,
    }
  },
  mounted () {

  },
  methods: {
    sendLink () {
      this.$q.loading.show()

      this.$axios.post(this.$apiUrl + '/auth/requestResetPassword', {
        email: this.email,
        admin: 1
      }).then((r) => {
        this.sent = true
      }).finally(() => {
        this.$q.loading.hide()
      })
    }
  }
}
</script>

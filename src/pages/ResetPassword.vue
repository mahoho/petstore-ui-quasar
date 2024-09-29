<template>
  <q-page class="flex flex-center login-page">
    <form @submit.prevent="reset"
          class="text-center login-form">
      <div class="header">
        <img src="~assets/images/logo.png"
             class="logo"
             alt="Logo"
        />
      </div>
      <div class="content reset">
        <div class="title q-mb-md">
          Reset password
        </div>
        <div class="inputs">
          <input type="password"
                 required
                 name="password"
                 v-model="userData.password"
                 placeholder="Your password"
                 class="bordered-input"
          />
          <input type="password"
                 required
                 name="password_confirmation"
                 v-model="userData.password_confirmation"
                 placeholder="Confirm your password"
                 class="bordered-input"
          />
        </div>
        <div class="login-buttons">
          <q-btn color="primary" type="submit" label="Reset" class="q-mb-md" />
          <router-link to="/login" class="block">
            Back to login
          </router-link>
        </div>
      </div>
    </form>
  </q-page>
</template>

<script>
import { setAccessToken } from '../boot/axios'

export default {
  name: 'ResetPassword',
  data: function () {
    return {
      userData: {
        password: '',
        token: '',
        password_confirmation: '',
      }
    }
  },
  mounted () {
    this.userData.token = this.$route.params.token;
  },
  methods: {
    reset () {
      this.$q.loading.show()

      this.$axios.post(this.$apiUrl + '/auth/resetPassword', this.userData).then((r) => {
        setAccessToken(r.data.access_token)

        this.syncUser(false)

        this.$router.replace('/dashboard')
      }).finally(() => {
        this.$q.loading.hide()
      })
    }
  }
}
</script>

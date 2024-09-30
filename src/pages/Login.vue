<template>
  <q-page class="flex flex-center login-page">
    <form @submit.prevent="login"
          class="login-form text-center">
      <div class="header">
        <img src="~assets/images/logo.png"
             class="logo"
             alt="Logo"
        />
      </div>
      <div class="content">
        <div class="inputs">
          <div class="form-input">
            <q-input type="text"
                     :rules="requiredRules"
                     name="email"
                     v-model="email"
                     label="Your Username"
                     filled
                     class="q-mb-md"
                      hide-bottom-space
                     dense
            />
          </div>

          <div class="form-input">
            <q-input type="password"
                     :rules="requiredRules"
                     name="password"
                     v-model="password"
                     placeholder="Your password"
                     class="q-mb-md"
                     filled
                     hide-bottom-space
                     dense
            />
          </div>

        </div>
        <div class="login-buttons">
          <q-btn color="primary"
                 type="submit"
                 label="login"/>

          <q-btn flat
                 no-caps
                 label="Create Users"
                 to="/createUsers"
                 class="q-my-md block"
          />

        </div>
      </div>
    </form>
  </q-page>
</template>

<script>
import {getUser, setAccessToken} from '../boot/axios'

export default {
  name: 'PageIndex',
  data: function () {
    return {
      email: '',
      password: '',
      loading: false
    }
  },
  mounted() {
    getUser().then((r) => {
      this.$router.replace('/dashboard')
    }).finally(() => {
      this.$q.loading.hide()
    })
  },
  methods: {
    login() {
      this.$q.loading.show();

      this.$axios.post(this.$apiUrl + '/user/login', {
        username: this.email,
        password: this.password
      }).then((r) => {
        setAccessToken(r.data.api_token);

        this.$q.loading.show();

        getUser().then((user) => {
          this.$store.commit('mainStore/user', user);
          this.$router.replace('/dashboard')
        }).finally(() => {
          this.$q.loading.hide()
        })
      }).finally(() => {
        this.$q.loading.hide()
      })
    },
    init() {
      return true
    }
  }
}
</script>

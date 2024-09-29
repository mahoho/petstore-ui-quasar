<template>
  <div id="logout"></div>
</template>

<script>
import {setAccessToken} from "boot/axios";
import {LocalStorage} from "quasar";

export default {
  name: 'Logout',
  mounted () {
    this.$axios.post(this.$apiUrl + '/user/logout', {}).then(() => {
      this.$store.commit('mainStore/user', {});
      LocalStorage.set('access_token', '')

      return this.$router.push('/login')
    })
  }
}
</script>

<style scoped>

</style>

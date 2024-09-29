<template>
  <div id="root"></div>
</template>

<script>
import { LocalStorage } from 'quasar'

export default {
  name: 'Root',
  mounted () {
    this.$router.afterEach(() => {
      this.$q.loading.hide()
    });

    try {
      // StatusBar.hide();
      // StatusBar.backgroundColorByHexString('#032f31');
    } catch (e) {

    }

    if (LocalStorage.getItem('access_token')) {
      // user is logged in
      this.$router.replace('/dashboard')
    } else {
      return this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>

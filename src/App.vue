<template>
  <div id="q-app">
    <axios-interceptors/>
    <router-view />
  </div>
</template>
<script>
import AxiosInterceptors from "components/AxiosInterceptors.vue";

export default {
  name: 'App',
  components: {AxiosInterceptors}
}
</script>

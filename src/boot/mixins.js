import Vue from 'vue'

Vue.mixin({
  methods: {
    notify(text, type = 'positive'){
      this.$q.notify({
        message: text,
        type: type,
        html: true,
        timeout: 30000
      })
    },
    axiosGet(uri, successCallback, loading = true, errorCallback, options){
      if(loading){
        this.$q.loading.show()
      }

      let promise = this.$axios.get(this.$apiUrl + uri, options);

      if(typeof successCallback === "function"){
        promise.then(successCallback);
      }

      promise.finally(() => {
        if(loading){
          this.$q.loading.hide()
        }

        if(typeof errorCallback === "function"){
          errorCallback()
        }
      })

      return promise
    },

    axiosPost(uri, data, successCallback, loading = true, errorCallback){
      if(loading){
        this.$q.loading.show()
      }

      let promise = this.$axios.post(this.$apiUrl + uri, data, data ? data.headers : undefined);

      if(typeof successCallback === "function"){
        promise.then(successCallback);
      }

      promise.finally(() => {
        if(loading){
          this.$q.loading.hide()
        }

        if(typeof errorCallback === "function"){
          errorCallback()
        }
      })

      return promise
    },

    axiosPut(uri, data, successCallback, loading = true, errorCallback){
      if(loading){
        this.$q.loading.show()
      }

      let promise = this.$axios.put(this.$apiUrl + uri, data, data ? data.headers : undefined);

      if(typeof successCallback === "function"){
        promise.then(successCallback);
      }

      promise.finally(() => {
        if(loading){
          this.$q.loading.hide()
        }

        if(typeof errorCallback === "function"){
          errorCallback()
        }
      })

      return promise
    },

    axiosDelete(uri, successCallback, loading = true, errorCallback){
      if(loading){
        this.$q.loading.show()
      }

      let promise = this.$axios.delete(this.$apiUrl + uri);

      if(typeof successCallback === "function"){
        promise.then(successCallback);
      }

      promise.finally(() => {
        if(loading){
          this.$q.loading.hide()
        }

        if(typeof errorCallback === "function"){
          errorCallback()
        }
      })

      return promise
    },
    syncUser(loading = true) {
      return this.axiosGet('/', (r) => {
        this.$store.commit('mainStore/user', r.data)
      }, loading, null, false)
    },
  },
  computed: {
    requiredRules(){
      return [v => !!v || 'Value is required']
    },
    currentUser(){
      try {
        return this.$store.state.mainStore.user || {}
      } catch {
        return {}
      }
    }
  }
})

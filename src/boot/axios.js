import Vue from 'vue'
import axios from 'axios'
import { LocalStorage, Platform } from 'quasar'

Vue.prototype.$axios = axios

Vue.prototype.$apiUrl = process.env.API_URL

export function debounce (fn, delay) {
  var timeoutID = null
  return function () {
    clearTimeout(timeoutID)
    var args = arguments
    var that = this
    timeoutID = setTimeout(function () {
      fn.apply(that, args)
    }, delay)
  }
}

export function copy(object){
  if(!object){
    return object
  }

  return JSON.parse(JSON.stringify(object))
}

export function setAccessToken (token = null) {
  if(token) {
    LocalStorage.set('access_token', token)
  } else {
    token = LocalStorage.getItem('access_token')
  }

  Vue.prototype.$axios.defaults.headers.common.Authorization = 'Bearer ' + token
}

setAccessToken()

export async function getUser() {
  return Vue.prototype.$axios.get(Vue.prototype.$apiUrl + '/user/me').then((response) => {
    // Get Token
    return response.data
  })
}

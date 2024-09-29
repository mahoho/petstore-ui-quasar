import { Notify } from 'quasar'

Notify.setDefaults({
  position: 'top',
  timeout: 10000,
  progress: true,
  textColor: 'white',
  actions: [{ label: 'Close', color: 'white' }]
})

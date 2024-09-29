<template>
  <q-page class="dashboard-page">
    <div class="dashboard-counts">

      <router-link :to="tabs[key].link"
                   v-for="(count, key) in stats"
                   class="dashboard-count"
                   :key="key">
        <div class="line title">
          {{tabs[key].name}}
        </div>
        <div class="line icon-and-label">
          <q-icon :name="tabs[key].image" />
          <div class="label">
            {{count}}
          </div>
        </div>
      </router-link>
    </div>

    <div class="inventory bg-white q-pa-md">
      <h4>Pets Inventory</h4>
      <p v-for="(cnt, key) in inventory" :key="key">
        <strong class="text-capitalize">{{key}}: </strong> {{cnt}}
      </p>
    </div>

  </q-page>
</template>

<script>

export default {
  name: "Dashboard",
  data(){
    return {
      tabs: {
        users: {
          name: 'Users',
          link: '/users',
          image: 'fas fa-users'
        },
        pets: {
          name: 'Pets',
          link: '/pets',
          image: 'fas fa-dog'
        },
        orders: {
          name: 'Orders',
          link: '/orders',
          image: 'fas fa-shopping-cart'
        },
      },
      stats: {
        users: 0,
        pets: 0,
        orders: 0,
      },
      inventory: {}
    }
  },
  mounted() {
    this.get()
    this.getInventory()
  },
  methods: {
    get(){
      this.axiosGet('/store/dashboard', (r) => {
        this.stats = r.data
      }, false)
    },
    getInventory(){
      this.axiosGet('/store/inventory', (r) => {
        this.inventory = r.data
      }, false)
    },
  }
}
</script>

<style scoped>

</style>

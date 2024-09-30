<template>
  <div class="left-menu">
    <div class="top-part">
      <router-link to="/dashboard"
                   class="left-menu-logo">
        <img src="~assets/images/logo.png"
             alt="">
      </router-link>
    </div>

    <div class="links">
      <router-link v-for="(link, index) in links"
                   :key="index"
                   :to="link.route"
                   class="side-menu-list-item"
                   active-class="active">
        <i :class="link.icon"></i>
        {{ link.title }}
      </router-link>
    </div>
    <div class="logout">
      <router-link to="/logout"
                   style="margin-top: 40px"
                   class="button button-link">
        Log out
        <q-icon style="margin: 0 0 0 10px"
                name="ion-ios-log-out"/>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  mounted() {

  },
  data() {
    return {
      links: [
        {
          title: 'Dashboard',
          icon: 'fas fa-home',
          route: '/dashboard',
          route_name: 'dashboard'
        },
        {
          title: 'Users',
          icon: 'fas fa-users',
          route: '/users',
          route_name: 'users'
        },
        {
          title: 'Tags',
          icon: 'fas fa-tag',
          route: '/tags',
          route_name: 'tags'
        },
        {
          title: 'Categories',
          icon: 'fas fa-file',
          route: '/categories',
          route_name: 'categories'
        },
        {
          title: 'Pets',
          icon: 'fas fa-dog',
          route: '/pets',
          route_name: 'pets'
        },
        {
          title: 'Orders',
          icon: 'fas fa-cart-shopping',
          route: '/orders',
          route_name: 'orders'
        },
      ]
    };
  },
};
</script>

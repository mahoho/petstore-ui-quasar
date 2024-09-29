<template>
  <q-layout view="hHh lpR lFr">

    <q-header elevated
              class="bg-primary text-white"
              v-if="$showHeader">
      <q-toolbar>
        <q-btn dense
               flat
               round
               icon="ion-ios-menu"
               @click="leftDrawerOpen = !leftDrawerOpen"/>

        <q-toolbar-title class="toolbar-title text-center">
          {{ $route.meta ? $route.meta.title :'' }}
        </q-toolbar-title>

<!--        <q-btn dense-->
<!--               flat-->
<!--               round-->
<!--               icon="ion-ios-notifications"-->
<!--               @click="rightDrawerOpen = !rightDrawerOpen"/>-->
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen"
              v-if="$showHeader"
              side="left"
              show-if-above
              :width="250"
              :breakpoint="768"
              elevated>
      <sidebar></sidebar>
    </q-drawer>

<!--    <q-drawer v-model="rightDrawerOpen"-->
<!--              @show="markNotificationsAsRead"-->
<!--              v-if="$showHeader"-->
<!--              @close="rightDrawerOpen = false"-->
<!--              side="right"-->
<!--              behavior="mobile"-->
<!--              elevated>-->
<!--      <notifications></notifications>-->
<!--    </q-drawer>-->

    <q-page-container>
      <transition name="fade"
                  mode="out-in">
        <router-view></router-view>
      </transition>
    </q-page-container>

  </q-layout>
</template>

<script>
  import Sidebar from 'components/Sidebar';
  // import Notifications from 'components/Notifications';

  export default {
    name: 'MainLayout',

    components: {
      // Notifications,
      Sidebar,
    },

    data() {
      return {
        leftDrawerOpen: false,
        rightDrawerOpen: false,
        notifications: [],
      };
    },
    mounted() {
      this.$root.$on('closeNotifications', () => {
        this.rightDrawerOpen = false
      })
    },
    beforeDestroy() {
      this.$root.$off('closeNotifications')
    },
    methods: {
      markNotificationsAsRead() {
        this.$axios.post(this.$apiUrl + '/notifications/read');
      },
    }
  };
</script>

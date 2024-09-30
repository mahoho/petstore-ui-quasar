
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', meta: { title: '', hideHeader: true }, name: 'root', component: () => import('pages/Root.vue') }, // should be root component to determine where to go
      { path: '/login', meta: { title: '', hideHeader: true }, name: 'login', component: () => import('pages/Login.vue') },
      { path: '/logout', meta: { title: '', hideHeader: true }, name: 'logout', component: () => import('pages/Logout.vue') },
      { path: '/forgot_password', meta: { title: 'Forgot password', hideHeader: true }, name: 'forgot_password', component: () => import('pages/ForgotPassword.vue') },
      { path: '/reset_password/:token', meta: { title: 'Reset password', hideHeader: true }, name: 'reset_password', component: () => import('pages/ResetPassword.vue') },

      { path: '/dashboard', meta: { title: 'Dashboard', hideHeader: false }, name: 'dashboard', component: () => import('pages/Dashboard.vue') },
      { path: '/users', meta: { title: 'Users', hideHeader: false }, name: 'users', component: () => import('pages/UsersPage.vue') },
      { path: '/categories', meta: { title: 'Categories', hideHeader: false }, name: 'categories', component: () => import('pages/CategoriesPage.vue') },

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

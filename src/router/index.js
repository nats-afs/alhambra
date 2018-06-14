import Vue from "vue";
import Router from "vue-router";
import {
  firebaseAuth
} from "../config/firebaseConfig";

Vue.use(Router);

const router = new Router({
  routes: [
    // {
    //   path: '*',
    //   redirect: '/login'
    // },
    // {
    //   path: '/',
    //   redirect: '/login'
    // },
    {
      path: '/login',
      name: 'login',
      component: () =>
        import ("@/components/Login"),
      meta: {
        title: 'login'
      }
    },
    {
      path: "/",
      component: () =>
        import ("@/components/DashBoard"),
      meta: {
        authenticated: true,
        title: "dashboard"
      },
      children: [{
          path: '',
          name: 'home',
          component: () =>
            import ("@/components/Home")
        },
        {
          path: "/customers",
          component: () =>
            import ("@/components/Customer"),
          meta: {
            title: 'Cliente'
          },
          children: [{
            path: "",
            name: "customer-list",
            component: () =>
              import ("@/components/CustomerList"),
            meta: {
              title: "Lista de Clientes"
            }
          }]
        },
        {
          path: "/lot",
          component: () =>
            import ("@/components/Lot"),
          meta: {
            title: 'Lotes'
          },
          children: [{
            path: "",
            name: "lot-list",
            component: () =>
              import ("@/components/LotList"),
            meta: {
              title: "Todo"
            }
          }]
        },
        {
          path: "/school",
          component: () =>
            import ("@/components/Lot"),
          meta: {
            title: 'Colegios'
          },
          children: [{
            path: "",
            name: "school-list",
            component: () =>
              import ("@/components/LotList"),
            meta: {
              title: "Todo"
            }
          }]
        },
        // {
        //   path: "/store",
        //   component: () =>
        //     import ("@/components/Store"),
        //   meta: {
        //     title: 'Almacen'
        //   },
        //   children: [{
        //     path: "",
        //     name: 'store',
        //     components: {
        //       default: () =>
        //         import ("@/components/StoreList"),
        //       form: () =>
        //         import ("@/components/StoreForm")
        //     },
        //     meta: {
        //       title: "Todo"
        //     }
        //   }]
        // }

      ]
    },
  ]
});


// router.beforeEach((to, from, next) => {
//   let user = firebaseAuth().currentUser
//   let authorization = to.matched.some(record => record.meta.authenticated)

//   if (authorization && !user) {
//     next('login')
//   } else if (!authorization && user) {
//     next('home')
//   } else {
//     next()
//   }
// })

export default router
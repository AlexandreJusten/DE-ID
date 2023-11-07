import { useAuthStore } from "src/stores/user";
import { ref } from "vue";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "/history", component: () => import("pages/HistoryPage.vue") },
      { path: "/payload", component: () => import("pages/PayloadPage.vue") },

      {
        path: "/history/:id",
        component: () => import("pages/HistoryItemPage.vue"),
        props: true,
      },
    ],
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      const userLoggedIn = ref(authStore.isAuthenticated);
      if (!userLoggedIn.value) {
        next("/login");
      } else {
        next();
      }
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
  {
    path: "/login",
    children: [{ path: "", component: () => import("pages/LoginPage.vue") }],
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      authStore.removeToken();
      next();
    },
  },
];

export default routes;

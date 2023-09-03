import { useAuthStore } from "src/stores/user";
import { ref } from "vue";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "/historic", component: () => import("pages/HistoryPage.vue") },
    ],
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      const userLoggedIn = ref(authStore.isAuthenticated);
      if (!userLoggedIn.value) {
        next("/login");
        console.log("No Enter");
      } else {
        console.log("Enter");

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
  },
];

export default routes;

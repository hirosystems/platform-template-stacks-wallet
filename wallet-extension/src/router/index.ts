import { createRouter, createWebHashHistory } from "vue-router";
import StartView from "@/views/StartView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "start",
      component: StartView,
    },
    {
      path: "/user",
      name: "user",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/UserHomeView.vue"),
    },
    {
      path: "/usermenu",
      name: "usermenu",
      component: () => import("../views/UserMenu.vue"),
    },
  ],
});

export default router;

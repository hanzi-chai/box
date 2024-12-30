import type { RouteRecordRaw } from "vue-router"

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/home-page.vue"),
  },
  {
    path: "/simulator",
    name: "simulator",
    component: () => import("@/views/simulator/simulator.vue"),
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("@/views/not-found.vue"),
  },
]

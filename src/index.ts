import { createPinia } from "pinia"
import { createPersistedStatePlugin } from "pinia-plugin-persistedstate-2"
import { createApp } from "vue"
import App from "./App.vue"

import router from "./router"
import "./assets/pollyfill"
import "@fontsource/jetbrains-mono/index.css"
import "./index.css"
import "./helper.css"
import "element-plus/es/components/notification/style/css.mjs"

const app = createApp(App)

// #region vue directives

// v-focus 指令
app.directive("focus", {
  mounted(el) {
    el?.focus?.()
  },
})

// v-opacity 指令
app.directive("opacity", {
  mounted(el, { value }) {
    el.style.opacity = Number(value) || 0
  },
  updated(el, { value }) {
    el.style.opacity = Number(value) || 0
  },
})

// #endregion

// #region vue plugins

const pinia = createPinia()
const installPersistedStatePlugin = createPersistedStatePlugin()
pinia.use(context => installPersistedStatePlugin(context))
app.use(pinia)

app.use(router)

// #endregion

app.mount("#root")

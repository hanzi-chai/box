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

// #endregion

// #region vue plugins

const pinia = createPinia()
const installPersistedStatePlugin = createPersistedStatePlugin()
pinia.use(context => installPersistedStatePlugin(context))
app.use(pinia)

app.use(router)

// #endregion

app.mount("#root")

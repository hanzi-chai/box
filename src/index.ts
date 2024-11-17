import { createPinia } from "pinia";
import { createPersistedStatePlugin } from "pinia-plugin-persistedstate-2";
import { createApp } from "vue";
import App from "./App.vue";

import router from "./router";
import "./index.css";

const pinia = createPinia();
const installPersistedStatePlugin = createPersistedStatePlugin();
pinia.use((context) => installPersistedStatePlugin(context));

const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount("#root");

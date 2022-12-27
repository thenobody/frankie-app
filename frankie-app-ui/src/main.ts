import { createApp } from "vue";
import EventService from "./api/EventService";
import App from "./App.vue";
import { EventServiceKey } from "./InjectionKeys";
import config from "@/config";

import "./assets/main.css";

const app = createApp(App);
app.config.unwrapInjectedRef = true;

app
  .provide(EventServiceKey, new EventService(new URL(config.apiBaseUrl)))
  .mount("#app");

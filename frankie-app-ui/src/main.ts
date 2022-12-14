import { createApp } from "vue";
import EventService from "./api/EventService";
import App from "./App.vue";
import { EventServiceKey } from "./InjectionKeys";

import "./assets/main.css";

createApp(App)
  .provide(
    EventServiceKey,
    new EventService(new URL("http://vancos-imac.local:3000"))
  )
  .mount("#app");

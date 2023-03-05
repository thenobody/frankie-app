<script lang="ts">
import EventButtons from "./components/EventButtons.vue";
import Log from "./components/Log.vue";
import SideMenu from "./components/SideMenu.vue";
import Stats from "./components/Stats.vue";
import Times from "./components/Times.vue";
import { EventServiceKey, PropertyWindowIsScrollingKey } from "./InjectionKeys";
import records from "./utils/records";
import _ from "lodash-es";
import { startOfDay } from "date-fns";
import config from "@/config";
import { computed } from "vue";

export default {
  data() {
    return {
      configMap: config,
      isScrolling: false,
      scrollTimerId: undefined as number | undefined,
    };
  },
  created() {
    this.keepUpdating();
    this.watchScrollState();
  },
  inject: { eventService: { from: EventServiceKey } },
  provide() {
    return {
      [PropertyWindowIsScrollingKey]: computed(() => this.isScrolling),
    };
  },
  components: {
    EventButtons,
    Log,
    SideMenu,
    Stats,
    Times,
  },
  methods: {
    keepUpdating(): void {
      this.keepUpdatingTime();
      this.keepUpdatingLogs();
    },
    keepUpdatingTime(): void {
      records.setCurrentTime(_.now());
      records.setCurrentDateStart(startOfDay(_.now()).valueOf());
      _.delay(this.keepUpdatingTime, 1000);
    },
    keepUpdatingLogs(): void {
      this.eventService.updateRecords();
      _.delay(this.keepUpdatingLogs, this.configMap.apiPollIntervalSec * 1000);
    },
    watchScrollState(): void {
      ["touchmove", "scroll"].forEach((event) => {
        window.addEventListener(event, () => {
          this.isScrolling = true;
          clearTimeout(this.scrollTimerId);
          this.scrollTimerId = _.delay(() => {
            this.isScrolling = false;
          }, this.configMap.windowScrollCheckMillis);
        });
      });
    },
  },
};
</script>

<template>
  <nav>
    <!-- <SideMenu /> -->
  </nav>
  <main>
    <Times />
    <Log :limit="configMap.logEntryCount" />
    <Stats />
    <EventButtons />
  </main>
</template>

<style scoped>
main,
header {
  display: flex;
  flex-direction: column;
  gap: 40px;

  max-width: 1280px;

  font-weight: normal;
}

main {
  padding: 2rem;
  margin: 0 auto;
}
</style>

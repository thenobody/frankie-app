<script lang="ts">
import EventButtons from "./components/EventButtons.vue";
import Log from "./components/Log.vue";
import Stats from "./components/Stats.vue";
import { EventServiceKey } from "./InjectionKeys";
import records from "./utils/records";
import _ from "lodash-es";
import { startOfDay } from "date-fns";

export default {
  created() {
    this.keepUpdating();
  },
  inject: { eventService: { from: EventServiceKey } },
  components: {
    EventButtons,
    Log,
    Stats,
  },
  methods: {
    keepUpdating(): void {
      records.setAfter(startOfDay(_.now()).valueOf());
      this.eventService.updateRecords();
      setTimeout(this.keepUpdating, 30 * 1000);
    },
  },
};
</script>

<template>
  <main>
    <Log />
    <Stats />
    <EventButtons />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
</style>

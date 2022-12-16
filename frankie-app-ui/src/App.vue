<script lang="ts">
import EventButtons from "./components/EventButtons.vue";
import Log from "./components/Log.vue";
import Stats from "./components/Stats.vue";
import { EventServiceKey } from "./InjectionKeys";

export default {
  created() {
    this.eventService.updateRecords();
    setInterval(() => {
      this.eventService.updateRecords();
    }, 30 * 1000);
  },
  inject: { eventService: { from: EventServiceKey } },
  components: {
    EventButtons,
    Log,
    Stats,
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

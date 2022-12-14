<script lang="ts">
import EventButtons from "./components/EventButtons.vue";
import Log from "./components/Log.vue";
import Stats from "./components/Stats.vue";

export default {
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

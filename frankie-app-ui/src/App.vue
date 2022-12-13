<script lang="ts">
import EventButtons from "./components/EventButtons.vue";
import Stats from "./components/Stats.vue";

export default {
  components: {
    EventButtons,
    Stats,
  },
};
</script>

<template>
  <main>
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

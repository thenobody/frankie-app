<script lang="ts">
import { EventTypes } from "@/model/EventType";
import EventButton from "./EventButton.vue";
export default {
  data() {
    return {
      buttons: [...EventTypes],
    };
  },
  components: {
    EventButton,
  },
};
</script>

<template>
  <div id="event-buttons">
    <EventButton
      v-for="button in buttons"
      :kind="button.kind"
      :icon="button.icon"
      :label="button.label"
      :key="button.kind"
    />
  </div>
</template>

<style scoped>
#event-buttons {
  display: flex;
  flex-flow: row wrap;
  gap: 20px;
}
</style>

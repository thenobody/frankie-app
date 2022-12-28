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
    <EventButton v-for="button in buttons" v-bind="button" :key="button.kind" />
  </div>
</template>

<style scoped>
#event-buttons {
  display: flex;
  flex-flow: row wrap;
  gap: 20px;
}

@media (max-width: 500px) {
  #event-buttons {
    justify-content: center;
  }
}
</style>

<script lang="ts">
import EventButton from "./EventButton.vue";
export default {
  data() {
    return {
      buttons: [
        { kind: "pee", text: "🚽 Pee" },
        { kind: "poo", text: "🧻 Poo" },
        { kind: "food", text: "🍗 Food" },
        { kind: "water", text: "🚰 Water" },
        { kind: "cooper", text: "🐶 Cooper" },
        { kind: "wakeup", text: "⏰ Wake up" },
        { kind: "sleep", text: "🛏️ Sleep" },
      ],
    };
  },
  components: {
    EventButton,
  },
};
</script>

<template>
  <div id="event-buttons">
    <EventButton v-for="button in buttons" :kind="button.kind">{{
      button.text
    }}</EventButton>
  </div>
</template>

<style scoped>
#event-buttons {
  display: flex;
  flex-flow: row wrap;
  gap: 20px;
}
</style>

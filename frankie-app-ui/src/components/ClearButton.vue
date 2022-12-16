<script lang="ts">
import type EventService from "@/api/EventService";
import { EventServiceKey } from "@/InjectionKeys";
import records from "@/utils/records";

export default {
  methods: {
    handleClick() {},
  },
  // inject: { eventService: { from: EventServiceKey } },
};
</script>

<template>
  <button class="clear-button" @click.stop="handleClick" />
</template>

<style scoped>
.event-button {
  border: 1px solid red;
  border-radius: 5px;
  background-color: #202020;
  width: 200px;
  height: 200px;
  cursor: pointer;
  font-size: 1.2em;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.event-button:hover {
  background-color: #404040;
}
</style>

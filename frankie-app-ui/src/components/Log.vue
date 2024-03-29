<script lang="ts">
import { EventServiceKey } from "@/InjectionKeys";
import records from "@/utils/records";
import LogEntry from "./LogEntry.vue";
import type { EventKind } from "@/model/EventType";

export default {
  data() {
    return {
      count: 0,
      collapsible: false,
    };
  },
  props: {
    limit: {
      type: Number,
      required: false,
      default: 5,
    },
  },
  created() {
    this.count = this.limit;
  },
  components: {
    LogEntry,
  },
  computed: {
    entries(): { kind: EventKind; time: number }[] {
      return records.log.slice(0, this.count);
    },
  },
  methods: {
    async handleLoadMoreClick() {
      this.count += this.limit;
      this.collapsible = true;
    },
    async handleCollapseClick() {
      this.count = this.limit;
      this.collapsible = false;
    },
  },
  inject: {
    eventService: {
      from: EventServiceKey,
    },
  },
};
</script>

<template>
  <div id="log">
    <h2>Most recent:</h2>
    <ul id="log">
      <li v-for="{ kind, time } in entries" :key="kind + '-' + time">
        <LogEntry :kind="kind" :time="time" />
      </li>
    </ul>
    <button class="load-more" @click="handleLoadMoreClick">Load more</button>
    <button class="collapse" v-if="collapsible" @click="handleCollapseClick">
      Collapse
    </button>
  </div>
</template>

<style scoped>
#log {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100px;
}

ul {
  list-style-type: decimal;
  list-style-position: inside;
  display: flex;
  flex-flow: column wrap;
  gap: 10px;
  padding: 0;
}

li,
button {
  border: 1px solid var(--color-border);
  border-radius: 5px;
  padding: 5px 10px;
}

button {
  padding: 10px 10px;
  color: var(--color-text);
  font-size: var(--font-size-normal);
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
}

button:hover {
  cursor: pointer;
  border: 1px solid var(--color-border-hover);
  background-color: var(--color-background-mute);
}
</style>

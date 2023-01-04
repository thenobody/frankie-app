<script lang="ts">
import { EventServiceKey } from "@/InjectionKeys";
import records from "@/utils/records";
import { format } from "date-fns";
import config from "@/config";
import LogEntry from "./LogEntry.vue";
import type { EventKind } from "@/model/EventType";
import { entries } from "lodash";

export default {
  props: {
    limit: {
      type: Number,
      required: false,
      default: 5,
    },
  },
  created() {
    records.setLogLimit(this.limit);
  },
  components: {
    LogEntry,
  },
  computed: {
    entries(): { kind: EventKind; time: number }[] {
      return records.log;
    },
  },
};
</script>

<template>
  <div id="log">
    <h2>Most recent:</h2>
    <ul id="log">
      <li v-for="{ kind, time } in entries" :key="time">
        <LogEntry :kind="kind" :time="time" />
      </li>
    </ul>
    <button class="load-more">Load more</button>
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
.load-more {
  border: 1px solid var(--color-border);
  border-radius: 5px;
  padding: 5px 10px;
}

.load-more {
  padding: 10px 10px;
  color: var(--color-text);
  font-size: var(--font-size-normal);
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
}

.load-more:hover {
  cursor: pointer;
  border: 1px solid var(--color-border-hover);
  background-color: var(--color-background-mute);
}
</style>

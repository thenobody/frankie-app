<script lang="ts">
import type { Record } from "@/utils/records";
import records from "@/utils/records";
import _ from "lodash-es";
import { format, formatISO } from "date-fns";

export default {
  computed: {
    mostRecent(): Map<String, String> {
      const result: Map<String, String> = new Map();
      records.entities.forEach((times: Array<number>, kind: String) => {
        if (times.length > 0) {
          const date = format(times[times.length - 1], "ppp");
          result.set(kind, date);
        }
      });
      return result;
    },
    counts(): Map<String, number> {
      const result: Map<String, number> = new Map();
      records.entities.forEach((times: Array<number>, kind: String) => {
        if (times.length > 0) result.set(kind, times.length);
      });
      return result;
    },
  },
};
</script>

<template>
  <div id="stats">
    <ul id="most-recent">
      <li v-for="[kind, mostRecentTime] in mostRecent">
        {{ kind }} @ {{ mostRecentTime }}
      </li>
    </ul>
    <ul id="counts">
      <li v-for="[kind, count] in counts">{{ kind }} x {{ count }}</li>
    </ul>
  </div>
</template>

<style scoped>
#stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100px;
}

ul {
  list-style-type: none;
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
  padding: 0;
}

li {
  border: 1px solid #202020;
  border-radius: 5px;
  padding: 5px 10px;
}
</style>

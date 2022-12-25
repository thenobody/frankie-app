<script lang="ts">
import records from "@/utils/records";
import { format } from "date-fns";
import config from "@/config";

export default {
  computed: {
    mostRecent(): Map<string, string> {
      const result: Map<string, string> = new Map();
      records.mostRecents.forEach((time: number, kind: string) => {
        if (time > -1) {
          const date = format(time, config.shortDateFormat);
          result.set(kind, date);
        }
      });
      return result;
    },
  },
};
</script>

<template>
  <h2>Most recent</h2>
  <ul id="most-recent">
    <li v-for="[kind, mostRecentTime] in mostRecent">
      {{ kind }} @ {{ mostRecentTime }}
    </li>
  </ul>
</template>

<style scoped>
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

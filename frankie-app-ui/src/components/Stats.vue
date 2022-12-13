<script lang="ts">
import records from "@/utils/records";
import { format } from "date-fns";

export default {
  computed: {
    mostRecent(): Map<string, string> {
      const result: Map<string, string> = new Map();
      records.mostRecents.forEach((time: number, kind: string) => {
        if (time > -1) {
          const date = format(time, "ppp");
          result.set(kind, date);
        }
      });
      return result;
    },
    counts(): Map<string, number> {
      const result: Map<string, number> = new Map();
      records.counts.forEach((count: number, kind: string) => {
        if (count > 0) result.set(kind, count);
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

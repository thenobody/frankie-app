<script lang="ts">
import records from "@/utils/records";
import { format } from "date-fns";

export default {
  props: {
    limit: {
      type: Number,
      required: false,
      default: 5,
    },
  },
  computed: {
    entries(): { kind: string; timestamp: string }[] {
      const result: { kind: string; timestamp: string }[] = [];
      records.log.slice(0, this.limit).forEach(({ kind, time }) => {
        result.push({
          kind: kind,
          timestamp: format(time, "p"),
        });
      });
      return result;
    },
  },
};
</script>

<template>
  <div id="log">
    <h2>Most recent:</h2>
    <ul id="log">
      <li v-for="{ kind, timestamp } in entries">
        {{ kind }} @ {{ timestamp }}
      </li>
    </ul>
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

li {
  border: 1px solid #484848;
  border-radius: 5px;
  padding: 5px 10px;
}
</style>

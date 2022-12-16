<script lang="ts">
import { getEventTypeByKind, type EventType } from "@/model/EventType";
import records from "@/utils/records";

export default {
  computed: {
    counts(): { eventType: EventType; count: number }[] {
      const result: { eventType: EventType; count: number }[] = [];
      records.counts.forEach((count: number, kind: string) => {
        if (count > 0)
          result.push({
            eventType: getEventTypeByKind(kind)!,
            count: count,
          });
      });
      return result;
    },
  },
};
</script>

<template>
  <h2>Counts:</h2>
  <ul id="counts">
    <li v-for="{ eventType, count } in counts">
      {{ eventType.icon }} x {{ count }}
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

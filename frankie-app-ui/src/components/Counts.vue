<script lang="ts">
import Count from "@/components/Count.vue";
import { getEventTypeByKind, type EventType } from "@/model/EventType";
import { formatShortTime } from "@/utils/date";
import records from "@/utils/records";

export default {
  components: {
    Count,
  },
  computed: {
    counts(): { eventType: EventType; count: number; mostRecent: string }[] {
      const result: {
        eventType: EventType;
        count: number;
        mostRecent: string;
      }[] = [];
      records.counts.forEach(({ kind, count }) => {
        if (count > 0)
          result.push({
            eventType: getEventTypeByKind(kind)!,
            count: count,
            mostRecent: formatShortTime(records.mostRecents.get(kind)!),
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
    <li v-for="{ eventType, count, mostRecent } in counts">
      <Count :event-type="eventType" :count="count" :most-recent="mostRecent" />
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
  display: flex;
}
</style>

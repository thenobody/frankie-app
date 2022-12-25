<script lang="ts">
import Count from "@/components/Count.vue";
import { getEventTypeByKind, type EventType } from "@/model/EventType";
import records from "@/utils/records";
import { format } from "date-fns";
import config from "@/config";

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
      records.counts.forEach((count: number, kind: string) => {
        if (count > 0)
          result.push({
            eventType: getEventTypeByKind(kind)!,
            count: count,
            mostRecent: format(
              records.mostRecents.get(kind)!,
              config.shortDateFormat
            ),
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

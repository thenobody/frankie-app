<script lang="ts">
import records from "@/utils/records";

export default {
  computed: {
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
  <h2>Counts:</h2>
  <ul id="counts">
    <li v-for="[kind, count] in counts">{{ kind }} x {{ count }}</li>
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

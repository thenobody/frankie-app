<script lang="ts">
import records from "@/utils/records";
import { format } from "date-fns";
import Counts from "./Counts.vue";
import MostRecent from "./MostRecent.vue";

export default {
  components: {
    Counts,
    MostRecent,
  },
};
</script>

<template>
  <div id="stats">
    <!-- <MostRecent /> -->
    <Counts />
  </div>
</template>

<style scoped>
#stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100px;
}
</style>

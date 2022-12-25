<script lang="ts">
import Counts from "./Counts.vue";

export default {
  components: {
    Counts,
  },
};
</script>

<template>
  <div id="stats">
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

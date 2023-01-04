<script lang="ts">
import type { EventType } from "@/model/EventType";
import type { PropType } from "vue";

export default {
  data() {
    return {
      touched: false,
    };
  },
  props: {
    eventType: {
      type: Object as PropType<EventType>,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    mostRecent: {
      type: String,
      required: true,
    },
  },
};
</script>

<template>
  <span
    class="count"
    :class="{ touched: touched }"
    @touchstart.prevent="touched = !touched"
    @touchend.prevent="touched = !touched"
  >
    {{ eventType.icon }} x {{ count }}
    <span class="mostRecent"> last @ {{ mostRecent }}</span>
  </span>
</template>

<style scoped>
.count {
  border: 1px solid var(--color-border);
  padding: 5px 10px;
}

.count .mostRecent {
  display: none;
}

@media (pointer: fine) {
  .count:hover {
    border-color: var(--color-border-hover);
  }

  .count:hover .mostRecent {
    display: inline;
    color: var(--color-text-secondary);
  }
}

.count.touched {
  border-color: var(--color-border-hover);
  background-color: var(--color-background-mute);
  width: 110px;
  position: absolute;
  top: -60px;
  left: -20px;
  text-align: center;
}

.count.touched .mostRecent {
  display: inline;
  color: var(--color-text-secondary);
}
</style>

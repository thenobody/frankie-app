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
  border: 1px solid #202020;
  border-radius: 5px;
  padding: 5px 10px;
}

.count .mostRecent {
  display: none;
  opacity: 0;
}

@media (pointer: fine) {
  .count:hover {
    border-color: #ababab;
  }

  .count:hover .mostRecent {
    display: inline;
    opacity: 0.5;
  }
}

.count.touched {
  border-color: #ababab;
  background-color: #242424;
  width: 110px;
  position: absolute;
  top: -60px;
  left: -20px;
  text-align: center;
}

.count.touched .mostRecent {
  display: inline;
  opacity: 0.5;
}
</style>

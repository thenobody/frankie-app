<script lang="ts">
import records from "../utils/records";

export default {
  props: {
    kind: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "#ababab",
    },
  },
  methods: {
    handleClick() {
      records.addKind(this.kind);
    },
    handleUndo() {
      records.dropLast(this.kind);
    },
  },
};
</script>

<template>
  <div class="event-button" @click="handleClick">
    <slot />
    <button class="undo" @click.stop="handleUndo">undo</button>
  </div>
</template>

<style scoped>
.event-button {
  border: 1px solid v-bind(color);
  border-radius: 5px;
  background-color: #202020;
  width: 200px;
  height: 200px;
  color: v-bind(color);
  /* color: #ababab; */
  cursor: pointer;
  font-size: 1.2em;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.event-button:hover {
  /* border: 1px solid #ababab; */
  background-color: #404040;
}

.event-button:hover .undo {
  display: block;
  opacity: 100%;
  transition: opacity 0.25s;
  cursor: pointer;
}

.undo {
  box-sizing: border-box;
  width: 160px;
  height: 30px;
  position: absolute;
  bottom: 20px;
  opacity: 0;
  background-color: transparent;
  border: 1px solid #4a7946;
  color: #4a7946;
  border-radius: 5px;
}

.undo:hover {
  background-color: #ffffff0d;
}
</style>

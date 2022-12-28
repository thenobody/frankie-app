<script lang="ts">
import { EventServiceKey, PropertyWindowIsScrollingKey } from "@/InjectionKeys";
import _ from "lodash-es";

export default {
  data() {
    return {
      selected: false,
      undoSelected: false,
    };
  },
  props: {
    kind: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "#ababab",
    },
  },
  computed: {
    text() {
      return `${this.icon} ${this.label}`;
    },
  },
  inject: {
    eventService: { from: EventServiceKey },
    isScrolling: { from: PropertyWindowIsScrollingKey },
  },
  methods: {
    fireAdd() {
      if (this.isScrolling) return;

      this.eventService.addMostRecent(this.kind);
    },
    fireUndo() {
      if (this.isScrolling) return;

      this.eventService.dropMostRecent(this.kind);
    },
    handleClick() {
      this.fireAdd();
    },
    handleTouchStart() {
      this.selected = true;
    },
    handleTouchEnd() {
      this.selected = false;
    },
    handleUndo() {
      this.fireUndo();
    },
    handleUndoTouchStart() {
      this.undoSelected = true;
    },
    handleUndoTouchEnd() {
      this.undoSelected = false;
    },
  },
};
</script>

<template>
  <div
    class="event-button"
    :class="{ selected: selected }"
    @click.stop="handleClick"
    @touchstart.stop="handleTouchStart"
    @touchend.stop="handleTouchEnd"
  >
    <span class="full-label">{{ text }}</span>
    <button
      class="undo"
      :class="{ selected: undoSelected }"
      @click.stop="handleUndo"
      @touchstart.stop="handleUndoTouchStart"
      @touchend.stop="handleUndoTouchEnd"
    >
      undo
    </button>
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
  cursor: pointer;
  font-size: 1.2em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 15px;
}

.event-button span {
  position: absolute;
}

.undo {
  width: 100%;
  height: 30px;
  margin-top: auto;
  opacity: 0;
  background-color: transparent;
  border: 1px solid #4a7946;
  color: #4a7946;
  border-radius: 5px;
  z-index: 10;
}

@media (max-width: 500px) {
  .event-button {
    width: 100%;
  }

  .undo {
    height: 40px;
    opacity: 0.75;
    width: 100%;
  }

  .event-button.selected {
    background-color: #404040;
  }

  .event-button .undo.selected {
    opacity: 1;
    background-color: #ffffff0d;
  }
}

@media (pointer: fine) {
  .event-button:hover {
    background-color: #404040;
  }

  .event-button:hover .undo {
    display: block;
    opacity: 1;
    transition: opacity 0.25s;
    cursor: pointer;
  }

  .undo:hover {
    background-color: #ffffff0d;
  }
}
</style>

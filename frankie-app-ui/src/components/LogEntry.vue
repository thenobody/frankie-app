<script lang="ts">
import type { EventKind } from "@/model/EventType";
import type { PropType } from "vue";
import isValid from "date-fns/isValid";
import formatDistance from "date-fns/formatDistanceStrict";
import parse from "date-fns/parse";
import config from "@/config";
import { formatShortTime } from "@/utils/date";
import records from "@/utils/records";
import { EventServiceKey } from "@/InjectionKeys";

export default {
  data() {
    return {
      value: "",
      focused: false,
    };
  },
  props: {
    kind: {
      type: String as PropType<EventKind>,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
  },
  created() {
    this.value = this.formatted();
  },
  computed: {
    parsed(): Date {
      return parse(
        this.value,
        config.shortTimeFormat,
        new Date(records.currentDateStart)
      );
    },
    distance(): string {
      return formatDistance(this.time, records.currentTime, {
        addSuffix: true,
      });
    },
    error(): boolean {
      return !isValid(this.parsed);
    },
  },
  inject: {
    eventService: {
      from: EventServiceKey,
    },
  },
  methods: {
    formatted() {
      return formatShortTime(this.time);
    },

    handleFocus() {
      this.focused = true;
    },

    handleEnter(e: KeyboardEvent): void {
      const target = e.target as HTMLInputElement;
      target.blur();
    },

    handleEscape(e: KeyboardEvent): void {
      this.focused = false;
      this.value = this.formatted();
      const target = e.target as HTMLInputElement;
      target.blur();
    },

    async handleBlur(e: Event): Promise<void> {
      if (this.focused) {
        const target = e.target as HTMLInputElement;
        await this.submit();
        this.focused = false;
      }
    },

    handleInput(e: Event): void {
      if (!this.value) {
        this.value = this.formatted();
      }
    },

    async submit(): Promise<void> {
      if (this.error) {
        return;
      }
      await this.eventService.updateEventTimestamp(
        this.kind,
        this.parsed.getTime(),
        this.time
      );
    },
  },
};
</script>

<template>
  {{ kind }}<span class="distance">{{ distance }}</span>
  <span class="time-input" :class="{ error: error, focused: focused }">
    <label>@</label>
    <input
      v-model="value"
      @focus="handleFocus"
      @blur="handleBlur"
      @keyup.enter="handleEnter"
      @keyup.esc="handleEscape"
      @input="handleInput"
      name="timestamp"
      type="time"
      required
      :class="{ error: error }"
    />
  </span>
  <span class="error-message" v-if="error">Invalid time!</span>
</template>

<style scoped>
.time-input {
  background-color: transparent;
  border: 1px solid transparent;
  display: inline-flex;

  padding: 5px 0.25ch;
  margin-left: 0.25ch;
}

.time-input:hover {
  border-color: var(--color-border-hover);
}

.time-input.focused {
  border-color: var(--color-border-selected);
  color: var(--color-text);
}

.time-input.focused label {
  color: var(--color-text);
}

.distance {
  margin-left: 0.5ch;
}

.time-input label,
.distance,
input {
  color: var(--color-text-secondary);
}

input {
  background-color: transparent;
  border: none;
  box-sizing: border-box;
  font-family: var(--font-family);
  font-size: 15px;
  width: 100%;
}

input::-webkit-calendar-picker-indicator {
  display: none;
}

input:focus {
  outline: none;
  color: var(--color-text);
}

.time-input input:invalid,
.error,
.error-message {
  color: var(--color-error);
}

.time-input.error {
  border: 1px solid var(--color-error) !important;
}

.error-message {
  margin-left: 10px;
}
</style>

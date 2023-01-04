<script lang="ts">
import type { EventKind } from "@/model/EventType";
import type { PropType } from "vue";
import format from "date-fns/format";
import isValid from "date-fns/isValid";
import parse from "date-fns/parse";
import config from "@/config";
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
    this.value = format(this.time, config.shortDateFormat);
  },
  computed: {
    parsed() {
      return parse(
        this.value,
        config.shortDateFormat,
        new Date(records.currentTime!)
      );
    },
    error() {
      return !isValid(this.parsed);
    }
  },
  inject: {
    eventService: {
      from: EventServiceKey,
    },
  },
  methods: {
    handleFocus() {
      this.focused = true;
    },

    handleEnter(e: Event): void {
      const target = e.target as HTMLInputElement;
      if (this.error) {
        return;
      }
      target.blur();
    },

    async handleBlur(e: Event): Promise<void> {
      console.log("blur")
      const target = e.target as HTMLInputElement;
      if (this.error) {
        target.focus();
      }

      await this.submit();
      this.focused = false;
    },

    async submit(e: Event): Promise<void> {
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
  {{ kind }}
  <span class="time-input" :class="{ error: error, focused: focused }">
    <label>@</label>
    <input v-model="value" @focus="handleFocus" @blur="handleBlur" @keyup.enter="handleEnter" name="timestamp"
      :class="{ error: error }" />
  </span>
  <span class="error-message" v-if="error">Invalid time!</span>
</template>

<style scoped>
.time-input {
  background-color: transparent;
  border: 1px solid transparent;
  display: inline-flex;

  padding: 5px 5px;
  width: 100px;
}

.time-input:hover,
.time-input.focused {
  border-color: var(--color-border-selected);
}

input {
  background-color: transparent;
  border: none;
  box-sizing: border-box;

  font-size: 15px;
  color: var(--color-text);
  width: 100%;
}

input:focus {
  outline: none;
}

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

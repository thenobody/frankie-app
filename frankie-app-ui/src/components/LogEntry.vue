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
    this.value = this.formatted();
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
    },
  },
  inject: {
    eventService: {
      from: EventServiceKey,
    },
  },
  methods: {
    formatted() {
      return format(this.time, config.shortDateFormat);
    },
    handleFocus() {
      this.focused = true;
    },

    async handleEnter(e: KeyboardEvent): Promise<void> {
      if (this.error) {
        return;
      }
      await this.submit();

      this.handleBlur(e);
    },

    handleBlur(e: Event): Promise<void> {
      const target = e.target as HTMLInputElement;
      if (e.type !== "blur") {
        target.blur();
        return;
      }

      this.value = this.formatted();
      this.focused = false;
    },

    async submit(): Promise<void> {
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
  {{ kind
  }}<span class="time-input" :class="{ error: error, focused: focused }">
    <label>@</label>
    <input
      v-model="value"
      @focus="handleFocus"
      @blur="handleBlur"
      @keyup.enter="handleEnter"
      @keyup.esc="handleBlur"
      name="timestamp"
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

  padding: 5px 5px;
  width: 110px;
}

.time-input:hover {
  border-color: var(--color-border-hover);
}

.time-input.focused {
  border-color: var(--color-border-selected);
}

.time-input.focused label {
  color: var(--color-text);
}

.time-input label {
  color: var(--color-text-secondary);
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

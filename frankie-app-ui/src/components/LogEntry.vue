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
      error: false,
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
  inject: {
    eventService: {
      from: EventServiceKey,
    },
  },
  methods: {
    async submit(e: Event): Promise<void> {
      const target = e.target as HTMLInputElement;

      const parsed = parse(
        target.value,
        config.shortDateFormat,
        new Date(records.currentTime!)
      );

      if ((this.error = !isValid(parsed))) {
        target.focus();
        return;
      }

      if (e.type === "keyup") {
        target.blur();
        return;
      }

      await this.eventService.updateEventTimestamp(
        this.kind,
        parsed.getTime(),
        this.time
      );
    },
  },
};
</script>

<template>
  {{ kind }}
  <span class="time-input">
    <label>@</label>
    <input
      v-model="value"
      @blur="submit"
      @keyup.enter="submit"
      name="timestamp"
      :class="{ error: error }"
    />
    <span class="error" :class="{ active: error }">Invalid time!</span>
  </span>
</template>

<style scoped>
.time-input {
  background-color: transparent;
  border: 1px solid transparent;

  padding: 5px 5px;
  width: 100px;
}

.time-input:hover {
  border-color: var(--color-border-selected);
}

input {
  background-color: transparent;
  /* border: 1px solid transparent; */
  border: none;

  font-size: 15px;
  color: var(--color-text);
}

input:hover,
input:focus {
  /* background: url("/public/pencil.svg");
  background-size: calc(contain - 5px);
  background-repeat: no-repeat;
  background-position-x: left; */
}

input:hover {
  /* cursor: text; */
  /* border: 1px solid var(--color-border-hover); */
}

input:focus {
  outline: none;
  /* border: 1px solid var(--color-border-selected); */
}

input.error {
  border: 1px solid var(--color-error);
  color: var(--color-error);
}

span.error {
  color: var(--color-error);
  margin-left: 10px;
  display: none;
}

span.error.active {
  display: inline;
}
</style>

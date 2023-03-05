<script lang="ts">
import _ from "lodash-es";
import { formatMillis } from "@/utils/date";
import records from "@/utils/records";
import { SleepEvent, WakeUpEvent } from "@/model/EventType";

export default {
  methods: {},
  computed: {
    durations(): {
      wakingTime: number;
      sleepingTime: number;
    } {
      const events = records.log.filter(
        ({ kind }) => kind === SleepEvent.kind || kind === WakeUpEvent.kind
      );
      events.sort((left, right) => left.time - right.time);

      const result = _.reduce(
        events,
        (acc, { kind, time }) => {
          if (kind === acc.previous.kind) return acc;

          if (kind == WakeUpEvent.kind) {
            acc.sleepingTime += time - acc.previous.time;
            acc.isSleeping = false;
          } else {
            acc.wakingTime += time - acc.previous.time;
            acc.isSleeping = true;
          }

          acc.previous = {
            kind: kind,
            time: time,
          };

          return acc;
        },
        {
          previous: {
            kind: SleepEvent.kind,
            time: records.currentDateStart,
          },
          wakingTime: 0,
          sleepingTime: 0,
          isSleeping: false,
        }
      );

      if (result.previous.kind === WakeUpEvent.kind)
        result.wakingTime += records.currentTime - result.previous.time;
      else result.sleepingTime += records.currentTime - result.previous.time;

      return result;
    },
    wakingDuration(): string {
      return formatMillis(this.durations.wakingTime);
    },
    sleepingDuration(): string {
      return formatMillis(this.durations.sleepingTime);
    },
  },
};
</script>

<template>
  <div class="times">
    <span class="time waking"
      ><span class="icon">⏰</span>{{ wakingDuration }}</span
    >
    <span class="time sleeping"
      ><span class="icon">🛏️</span>{{ sleepingDuration }}</span
    >
  </div>
</template>

<style scoped>
.times {
  display: flex;
  gap: 40px;
}

.time {
  font-size: 1.2em;
  border: 1px solid var(--color-border-hover);
  padding: 5px 35px;
  flex: 1;
  text-align: center;
  position: relative;
}

.time.waking {
  color: var(--color-positive);
  border-color: var(--color-positive);
}

.time.sleeping {
  color: var(--color-negative);
  border-color: var(--color-negative);
}

.time .icon {
  position: absolute;
  left: 20px;
}

@media (max-width: 500px) {
  .time .icon {
    left: 10px;
  }
}
</style>

import type { EventKind } from "@/model/EventType";
import { reactive } from "vue";

export default reactive({
  mostRecents: new Map<EventKind, number>(),
  counts: [] as { kind: EventKind; count: number }[],
  log: [] as { kind: EventKind; time: number }[],
  logLimit: undefined as number | undefined,
  currentTime: undefined as number | undefined,

  setMostRecent(kind: EventKind, mostRecent: number): void {
    this.mostRecents.set(kind, mostRecent);
  },

  setCounts(counts: { kind: EventKind; count: number }[]): void {
    this.counts = counts;
  },

  setLog(log: { kind: EventKind; time: number }[]): void {
    this.log = log;
  },

  setLogLimit(limit?: number): void {
    this.logLimit = limit;
  },

  setCurrentTime(after?: number): void {
    this.currentTime = after;
  },
});

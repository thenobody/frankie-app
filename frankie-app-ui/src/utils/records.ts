import type { EventKind } from "@/model/EventType";
import { reactive } from "vue";

export default reactive({
  mostRecents: new Map<EventKind, number>(),
  counts: [] as { kind: EventKind; count: number }[],
  log: [] as { kind: EventKind; time: number }[],
  currentDateStart: 0,
  currentTime: 0,

  setMostRecent(kind: EventKind, mostRecent: number): void {
    this.mostRecents.set(kind, mostRecent);
  },

  setCounts(counts: { kind: EventKind; count: number }[]): void {
    this.counts = counts;
  },

  setLog(log: { kind: EventKind; time: number }[]): void {
    this.log = log;
  },

  setCurrentDateStart(dateStart: number): void {
    this.currentDateStart = dateStart;
  },

  setCurrentTime(time: number): void {
    this.currentTime = time;
  },
});

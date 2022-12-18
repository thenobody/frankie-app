import { reactive, toHandlers } from "vue";

export default reactive({
  mostRecents: new Map<string, number>(),
  counts: new Map<string, number>(),
  log: [] as { kind: string; time: number }[],
  logLimit: undefined as number | undefined,
  after: undefined as number | undefined,

  setMostRecent(kind: string, mostRecent: number): void {
    this.mostRecents.set(kind, mostRecent);
  },

  setCount(kind: string, count: number): void {
    this.counts.set(kind, count);
  },

  setLog(log: { kind: string; time: number }[]): void {
    this.log = log;
  },

  setLogLimit(limit?: number): void {
    this.logLimit = limit;
  },

  setAfter(after?: number): void {
    this.after = after;
  },
});

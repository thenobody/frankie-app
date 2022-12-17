import _ from "lodash";

export interface Service {
  getLog(limit?: number): { kind: string; time: number }[];
  dropAll(): void;
  getMostRecent(): { kind: string; mostRecent: number }[];
  getMostRecentByKind(kind: string): number;
  getCount(kind: string, after?: number): number;
  addMostRecent(kind: string): void;
  dropMostRecent(kind: string): void;
}

export class SimpleService implements Service {
  private store = new Map<string, number[]>();
  private log: { kind: string; time: number }[] = [];

  getLog(limit?: number): { kind: string; time: number }[] {
    return typeof limit !== "undefined" ? this.log.slice(0, limit) : this.log;
  }

  dropAll(): void {
    this.store.clear();
    while (this.log.length) {
      this.log.pop();
    }
  }

  getMostRecent(): { kind: string; mostRecent: number }[] {
    const result: { kind: string; mostRecent: number }[] = [];

    this.store.forEach((times, kind) => {
      if (times.length > 0) {
        result.push({
          kind: kind,
          mostRecent: times[times.length - 1],
        });
      }
    });

    return result;
  }

  getMostRecentByKind(kind: string): number {
    const times = this.store.get(kind);
    if (typeof times !== "undefined" && times.length > 0) {
      return times[times.length - 1];
    }
  }

  getCount(kind: string, after?: number): number {
    const times = this.store.get(kind);
    if (typeof times !== "undefined") {
      if (typeof after !== "undefined") {
        let count = 0;
        times.forEach((time) => {
          if (time >= after) count++;
        });
        return count;
      } else return times.length;
    }
  }

  addMostRecent(kind: string): void {
    const entry = { kind: kind, time: _.now() };

    const times = this.store.get(kind);
    if (typeof times !== "undefined") {
      times.push(entry.time);
    } else {
      this.store.set(kind, [entry.time]);
    }

    this.log.unshift(entry);
  }

  dropMostRecent(kind: string): void {
    const times = this.store.get(kind);
    if (typeof times !== "undefined") {
      times.pop();
    }

    const lastIndex = _.findIndex(this.log, (entry) => kind === entry.kind);
    if (lastIndex > -1) {
      this.log.splice(lastIndex, 1);
    }
  }
}

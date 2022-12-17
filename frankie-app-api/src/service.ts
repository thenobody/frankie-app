import _, { create } from "lodash";
import {
  createClient,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "@redis/client";

export interface Service {
  getLog(limit?: number): Promise<{ kind: string; time: number }[]>;
  dropAll(): Promise<void>;
  getMostRecent(): Promise<{ kind: string; mostRecent: number }[]>;
  getMostRecentByKind(kind: string): Promise<number>;
  getCount(kind: string, after?: number): Promise<number>;
  addMostRecent(kind: string): Promise<void>;
  dropMostRecent(kind: string): Promise<void>;
}

export class RedisService implements Service {
  private client: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

  private keys = {
    log: "log",
    kind: (kind: string) => `kind_${kind}`,
    kinds: `kind_*`,
  };

  constructor() {
    this.client = createClient({
      url: "redis://localhost:6379",
      database: 0,
    });
    this.client.connect();
  }

  private async addLogEntry(kind: string, time: number): Promise<void> {
    await this.client.lPush(this.keys.log, [time.toString(), kind]);
  }

  private async dropLogEntry(kind: string): Promise<void> {
    const index = await this.client.lPos(this.keys.log, kind);
    const transaction = await this.client.multi();
    await this.client.lSet(this.keys.log, index, "DELETE");
    await this.client.lSet(this.keys.log, index + 1, "DELETE");
    await this.client.lRem(this.keys.log, 0, "DELETE");
    await transaction.exec();
  }

  async getLog(limit?: number): Promise<{ kind: string; time: number }[]> {
    const entries = await this.client.lRange(this.keys.log, 0, limit * 2 || -1);
    const result: { kind: string; time: number }[] = [];
    for (let i = 0; i < entries.length; i = i + 2) {
      result.push({
        kind: entries[i],
        time: parseInt(entries[i + 1]),
      });
    }
    return result;
  }

  async dropAll(): Promise<void> {
    await this.client.flushDb();
  }

  async getMostRecent(): Promise<{ kind: string; mostRecent: number }[]> {
    const kinds = await this.client.keys(this.keys.kinds);
    const results = kinds.map(async (kind) => {
      const mostRecent = await this.getMostRecentByKind(kind);
      return { kind: kind, mostRecent: mostRecent };
    });
    return Promise.all(results);
  }

  async getMostRecentByKind(kind: string): Promise<number> {
    const result = await this.client.lIndex(this.keys.kind(kind), 0);
    return result ? parseInt(result) : 0;
  }

  getCount(kind: string, after?: number): Promise<number> {
    return this.client.lLen(this.keys.kind(kind));
  }

  async addMostRecent(kind: string): Promise<void> {
    const time = _.now();
    await this.client.lPush(this.keys.kind(kind), time.toString());
    await this.addLogEntry(kind, time);
  }

  async dropMostRecent(kind: string): Promise<void> {
    await this.client.lPop(this.keys.kind(kind));
    await this.dropLogEntry(kind);
  }
}

export class SimpleService implements Service {
  private store = new Map<string, number[]>();
  private log: { kind: string; time: number }[] = [];

  getLog(limit?: number): Promise<{ kind: string; time: number }[]> {
    const result =
      typeof limit !== "undefined" ? this.log.slice(0, limit) : this.log;
    return Promise.resolve(result);
  }

  dropAll(): Promise<void> {
    this.store.clear();
    while (this.log.length) {
      this.log.pop();
    }
    return Promise.resolve();
  }

  getMostRecent(): Promise<{ kind: string; mostRecent: number }[]> {
    const result: { kind: string; mostRecent: number }[] = [];

    this.store.forEach((times, kind) => {
      if (times.length > 0) {
        result.push({
          kind: kind,
          mostRecent: times[times.length - 1],
        });
      }
    });

    return Promise.resolve(result);
  }

  getMostRecentByKind(kind: string): Promise<number> {
    const times = this.store.get(kind);
    if (typeof times !== "undefined" && times.length > 0) {
      return Promise.resolve(times[times.length - 1]);
    }
  }

  getCount(kind: string, after?: number): Promise<number> {
    const times = this.store.get(kind);
    if (typeof times !== "undefined") {
      if (typeof after !== "undefined") {
        let count = 0;
        times.forEach((time) => {
          if (time >= after) count++;
        });
        return Promise.resolve(count);
      } else return Promise.resolve(times.length);
    }
  }

  addMostRecent(kind: string): Promise<void> {
    const entry = { kind: kind, time: _.now() };

    const times = this.store.get(kind);
    if (typeof times !== "undefined") {
      times.push(entry.time);
    } else {
      this.store.set(kind, [entry.time]);
    }

    this.log.unshift(entry);

    return Promise.resolve();
  }

  dropMostRecent(kind: string): Promise<void> {
    const times = this.store.get(kind);
    if (typeof times !== "undefined") {
      times.pop();
    }

    const lastIndex = _.findIndex(this.log, (entry) => kind === entry.kind);
    if (lastIndex > -1) {
      this.log.splice(lastIndex, 1);
    }

    return Promise.resolve();
  }
}

import _ from "lodash";
import {
  createClient,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "@redis/client";

export interface Service {
  getLog(
    limit?: number,
    after?: number
  ): Promise<{ kind: string; time: number }[]>;
  dropAll(): Promise<void>;
  getMostRecent(): Promise<{ kind: string; mostRecent: number }[]>;
  getMostRecentByKind(kind: string): Promise<number>;
  getCounts(after?: number): Promise<{ kind: string; count: number }[]>;
  getCount(kind: string, after?: number): Promise<number>;
  addMostRecent(kind: string): Promise<void>;
  dropMostRecent(kind: string): Promise<void>;
}

export class RedisService implements Service {
  private client: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

  private readonly kindPrefix: string = "kind_";

  private keys = {
    log: "log",
    kind: (kind: string) => `${this.kindPrefix}${kind}`,
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
    const transaction = this.client.multi();
    await this.client.lSet(this.keys.log, index, "DELETE");
    await this.client.lSet(this.keys.log, index + 1, "DELETE");
    await this.client.lRem(this.keys.log, 0, "DELETE");
    await transaction.exec();
  }

  private async getKinds(): Promise<string[]> {
    const keys = await this.client.keys(this.keys.kind("*"));
    return keys.map((key) => key.replace(this.kindPrefix, ""));
  }

  async getLog(
    limit?: number,
    after?: number
  ): Promise<{ kind: string; time: number }[]> {
    const range = limit * 2 - 1 || -1;
    const entries = await this.client.lRange(this.keys.log, 0, range);
    const result: { kind: string; time: number }[] = [];
    for (let i = 0; i < entries.length; i = i + 2) {
      const entry = {
        kind: entries[i],
        time: parseInt(entries[i + 1]),
      };
      if (typeof after !== "undefined") {
        if (entry.time >= after) result.push(entry);
      } else {
        result.push(entry);
      }
    }

    return result;
  }

  async dropAll(): Promise<void> {
    await this.client.flushDb();
  }

  async getMostRecent(): Promise<{ kind: string; mostRecent: number }[]> {
    const kinds = await this.getKinds();
    const results = kinds.map(async (kind) => {
      const mostRecent = await this.getMostRecentByKind(kind);
      return { kind: kind, mostRecent: mostRecent };
    });
    return Promise.all(results);
  }

  async getMostRecentByKind(kind: string): Promise<number> {
    const result = await this.client.zRange(this.keys.kind(kind), 0, 0, {
      REV: true,
    });
    return result.length ? parseInt(result.pop()) : 0;
  }

  async getCounts(after?: number): Promise<{ kind: string; count: number }[]> {
    const kinds = await this.getKinds();
    const results = kinds.map(async (kind) => {
      const count = await this.getCount(kind, after);
      return { kind: kind, count: count };
    });
    return Promise.all(results);
  }

  async getCount(kind: string, after?: number): Promise<number> {
    if (typeof after !== "undefined") {
      return this.client.zCount(this.keys.kind(kind), after, "+inf");
    } else return this.client.zCard(this.keys.kind(kind));
  }

  async addMostRecent(kind: string): Promise<void> {
    const time = _.now();
    await this.client.zAdd(this.keys.kind(kind), {
      score: time,
      value: time.toString(),
    });
    await this.addLogEntry(kind, time);
  }

  async dropMostRecent(kind: string): Promise<void> {
    await this.client.zPopMax(this.keys.kind(kind));
    await this.dropLogEntry(kind);
  }
}

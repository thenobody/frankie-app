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
    offset?: number,
    after?: number
  ): Promise<{ kind: string; time: number }[]>;
  dropAll(): Promise<void>;
  getMostRecent(): Promise<{ kind: string; mostRecent: number }[]>;
  getMostRecentByKind(kind: string): Promise<number>;
  getCounts(after?: number): Promise<{ kind: string; count: number }[]>;
  getCount(kind: string, after?: number): Promise<number>;
  addMostRecent(kind: string): Promise<void>;
  dropMostRecent(kind: string): Promise<void>;
  updateEventTimestamp(
    kind: string,
    oldTimestamp: number,
    newtTimestamp: number
  ): Promise<void>;
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

  private buildLogEntry(
    kind: string,
    time: number
  ): { score: number; value: string } {
    return {
      score: time,
      value: `${kind}-${time.toString()}`,
    };
  }

  private parseLogEntry(entry: string): { kind: string; time: number } {
    const [kind, time] = entry.split("-");
    return {
      kind: kind,
      time: parseInt(time),
    };
  }

  private async addLogEntry(kind: string, time: number): Promise<void> {
    await this.client.zAdd(this.keys.log, this.buildLogEntry(kind, time));
  }

  private async dropLogEntry(kind: string, time: number): Promise<void> {
    const { value } = this.buildLogEntry(kind, time);
    await this.client.zRem(this.keys.log, value);
  }

  private async getKinds(): Promise<string[]> {
    const keys = await this.client.keys(this.keys.kind("*"));
    return keys.map((key) => key.replace(this.kindPrefix, ""));
  }

  async getLog(
    limit?: number,
    offset?: number,
    after?: number
  ): Promise<{ kind: string; time: number }[]> {
    const entries = await this.client.zRange(
      this.keys.log,
      "+inf",
      after ?? "-inf",
      {
        REV: true,
        BY: "SCORE",
        LIMIT: {
          offset: offset ?? 0,
          count: limit ?? -1,
        },
      }
    );

    return _.map(entries, this.parseLogEntry);
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
    const timestamp = _.now();
    await this.addKindEvent(kind, timestamp);
    await this.addLogEntry(kind, timestamp);
  }

  async dropMostRecent(kind: string): Promise<void> {
    const entry = await this.client.zPopMax(this.keys.kind(kind));
    if (entry) {
      await this.dropLogEntry(kind, entry.score);
    }
  }

  private async addKindEvent(kind: string, timestamp: number): Promise<void> {
    await this.client.zAdd(this.keys.kind(kind), {
      score: timestamp,
      value: timestamp.toString(),
    });
  }

  private async dropKindEvent(kind: string, timestamp: number): Promise<void> {
    await this.client.zRem(this.keys.kind(kind), timestamp.toString());
  }

  async updateEventTimestamp(
    kind: string,
    oldTimestamp: number,
    newTimestamp: number
  ): Promise<void> {
    await this.dropLogEntry(kind, oldTimestamp);
    await this.addLogEntry(kind, newTimestamp);
    await this.dropKindEvent(kind, oldTimestamp);
    await this.addKindEvent(kind, newTimestamp);
  }
}

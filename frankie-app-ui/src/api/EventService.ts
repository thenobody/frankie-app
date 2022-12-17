import { EventTypes } from "@/model/EventType";
import records from "@/utils/records";
import _ from "lodash-es";

export default class {
  readonly host: URL;

  constructor(host: URL) {
    this.host = host;
  }

  async getLog(limit?: number): Promise<{ kind: string; time: number }[]> {
    const params: Record<string, string> = {};
    if (typeof limit !== "undefined") {
      params.limit = limit.toString();
    }
    const query = new URLSearchParams(params);
    return await fetch(this.host + "events?" + query)
      .then((res) => res.json())
      .then(({ log }) => log as { kind: string; time: number }[]);
  }

  async getMostRecent(): Promise<{ kind: string; mostRecent: number }[]> {
    const res = await fetch(this.host + "events/most-recent");
    const { mostRecents } = (await res.json()) as {
      mostRecents: { kind: string; mostRecent: number }[];
    };
    return mostRecents;
  }

  async getCounts(): Promise<{ kind: string; count: number }[]> {
    const res = await fetch(this.host + "events/count");
    const { counts } = (await res.json()) as {
      counts: { kind: string; count: number }[];
    };
    return counts;
  }

  async addMostRecent(kind: string, time: number = _.now()): Promise<void> {
    const payload = { mostRecent: time };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    await fetch(this.host + `events/${kind}/most-recent`, requestOptions);
    await this.updateRecords();
  }

  async dropMostRecent(kind: string): Promise<void> {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    await fetch(this.host + `events/${kind}/most-recent`, requestOptions);
    await this.updateRecords();
  }

  async updateRecords(): Promise<void> {
    const mostRecents = await this.getMostRecent();
    mostRecents.forEach(({ kind, mostRecent }) =>
      records.setMostRecent(kind, mostRecent)
    );
    const counts = await this.getCounts();
    counts.forEach(({ kind, count }) => records.setCount(kind, count));

    const log = await this.getLog();
    records.setLog(log);
  }
}

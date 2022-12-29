import records from "@/utils/records";
import _ from "lodash-es";
import fetch from "cross-fetch";

export class EventService {
  readonly host: URL;

  constructor(host: URL) {
    this.host = host;
  }

  async getLog(
    limit?: number,
    after?: number
  ): Promise<{ kind: string; time: number }[]> {
    const query = new URLSearchParams();
    if (typeof limit !== "undefined") {
      query.set("limit", limit.toString());
    }
    if (typeof after !== "undefined") {
      query.set("after", after.toString());
    }

    const url = new URL(this.host + "events");
    url.search = query.toString();
    return await fetch(url)
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

  async getCounts(after?: number): Promise<{ kind: string; count: number }[]> {
    const query = new URLSearchParams();
    if (typeof after !== "undefined") {
      query.set("after", after.toString());
    }

    const url = new URL(this.host + "events/count");
    url.search = query.toString();

    const res = await fetch(url);
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
    const counts = await this.getCounts(records.after);
    counts.forEach(({ kind, count }) => records.setCount(kind, count));

    const log = await this.getLog(records.logLimit, records.after);
    records.setLog(log);
  }
}

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
    return await fetch(this.host + "events/most-recent").then((res) =>
      res.json()
    );
  }

  async getMostRecentByKind(kind: string): Promise<{ mostRecent: number }> {
    return await fetch(this.host + `events/${kind}/most-recent`).then((res) =>
      res.json()
    );
  }

  async getCount(): Promise<{ kind: string; count: number }[]> {
    return await fetch(this.host + "events/count").then((res) => res.json());
  }

  async getCountByKind(kind: string): Promise<{ count: number }> {
    return await fetch(this.host + `events/${kind}/count`).then((res) =>
      res.json()
    );
  }

  async addMostRecent(kind: string, time: number = _.now()): Promise<void> {
    const payload = { mostRecent: time };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
    return await fetch(
      this.host + `events/${kind}/most-recent`,
      requestOptions
    ).then(() => this.updateRecords());
  }

  async dropMostRecent(kind: string): Promise<void> {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    return await fetch(
      this.host + `events/${kind}/most-recent`,
      requestOptions
    ).then(() => this.updateRecords());
  }

  async updateRecords(): Promise<void> {
    return new Promise<void>((resolve) => {
      EventTypes.forEach(async ({ kind }) => {
        const { mostRecent } = await this.getMostRecentByKind(kind);
        records.setMostRecent(kind, mostRecent);

        const { count } = await this.getCountByKind(kind);
        records.setCount(kind, count);

        const log = await this.getLog();
        records.setLog(log);
      });
      resolve();
    });
  }
}

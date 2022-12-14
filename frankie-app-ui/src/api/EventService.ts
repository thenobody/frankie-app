import _ from "lodash-es";

type KindResponse = { kind: string; times: number[] };
type AllResponse = [KindResponse];

export default class {
  readonly host: URL;

  constructor(host: URL) {
    this.host = host;
  }

  async getLog(limit?: number): Promise<AllResponse> {
    const params: Record<string, string> = {};
    if (typeof limit !== "undefined") {
      params.limit = limit.toString();
    }
    const query = new URLSearchParams(params);
    return await fetch(this.host + "events?" + query)
      .then((res) => res.json())
      .then((json: AllResponse) => json);
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
    ).then(() => new Promise((resolve) => resolve()));
  }

  async dropMostRecent(kind: string): Promise<void> {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    return await fetch(
      this.host + `events/${kind}/most-recent`,
      requestOptions
    ).then(() => new Promise((resolve) => resolve()));
  }
}

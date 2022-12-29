import { EventService } from "../EventService";

describe("EventService", () => {
  const service = new EventService(new URL("http://localhost"));
  it.todo("retrieve all log records", async () => {});
  it.todo("retrieve log records after a timestamp", () => {});
  it.todo("retrieve most recent timestamps for each event kind", () => {});
  it.todo("retrieve counts for each event kind", () => {});
  it.todo("retrieve counts for each event kind after a timestamp", () => {});
  it.todo("store the most recent timestamp for an event kind", () => {});
  it.todo("delete the most recent timestamp for an event kind", () => {});
});

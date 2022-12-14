import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import _ from "lodash";

const app = express();

app
  .use(
    cors({
      methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    })
  )
  .use(bodyParser.json());
const port = 3000;

const store = new Map<string, number[]>();
const log: { kind: string; time: number }[] = [];

function printLog(message: string): void {
  const timestamp: string = new Date(_.now()).toISOString();
  console.log(`${timestamp}: ${message}`);
}

function getLog(limit?: number): { kind: string; time: number }[] {
  return typeof limit !== "undefined" ? log.slice(0, limit) : log;
}

function dropAll(): void {
  store.clear();
  while (log.length) {
    log.pop();
  }
}

function getMostRecent(kind: string): number {
  const times = store.get(kind);
  if (typeof times !== "undefined" && times.length > 0) {
    return times[times.length - 1];
  }
}

function getCount(kind: string, after?: number): number {
  const times = store.get(kind);
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

function addMostRecent(kind: string): void {
  const entry = { kind: kind, time: _.now() };

  const times = store.get(kind);
  if (typeof times !== "undefined") {
    times.push(entry.time);
  } else {
    store.set(kind, [entry.time]);
  }

  log.unshift(entry);
}

function dropMostRecent(kind: string): void {
  const times = store.get(kind);
  if (typeof times !== "undefined") {
    times.pop();
  }

  const lastIndex = _.findIndex(log, (entry) => kind === entry.kind);
  if (lastIndex > -1) {
    log.splice(lastIndex, 1);
  }
}

app.get("/events", (req, res) => {
  printLog(`getLog()`);
  res.json({
    log: getLog(),
  });
});

app.delete("/events/", (req, res) => {
  printLog(`dropAll()`);
  dropAll();
  res.sendStatus(200);
});

app.get("/events/:kind/most-recent", (req, res) => {
  printLog(`getMostRecent(${req.params.kind})`);
  res.json({
    mostRecent: getMostRecent(req.params.kind),
  });
});

app.get("/events/:kind/count", (req, res) => {
  const kind = req.params.kind;
  const after =
    typeof req.query.after === "string" ? parseInt(req.query.after) : undefined;

  printLog(`getCount(${kind}, ${after})`);
  res.json({
    count: getCount(kind, after),
  });
});

app.delete("/events/:kind/most-recent", (req, res) => {
  printLog(`dropMostRecent(${req.params.kind})`);
  dropMostRecent(req.params.kind);
  res.sendStatus(200);
});

app.post("/events/:kind/most-recent", (req, res) => {
  printLog(`addMostRecent(${req.params.kind})`);
  addMostRecent(req.params.kind);
  res.sendStatus(200);
});

app.listen(port, () => {
  return printLog(`Express is listening at http://localhost:${port}`);
});

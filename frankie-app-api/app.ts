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

function getMostRecent(kind: string): number {
  const times = store.get(kind);
  if (typeof times !== "undefined" && times.length > 0) {
    return times[times.length - 1];
  }
}

function getCount(kind: string): number {
  const times = store.get(kind);
  if (typeof times !== "undefined") {
    return times.length;
  }
}

function addMostRecent(kind: string, time: number): void {
  const times = store.get(kind);
  if (typeof times !== "undefined") {
    times.push(_.now());
  } else {
    store.set(kind, [_.now()]);
  }
}

function dropMostRecent(kind: string): void {
  const times = store.get(kind);
  if (typeof times !== "undefined") {
    times.pop();
  }
}

app.get("/events/:kind/most-recent", (req, res) => {
  console.log(`getMostRecent(${req.params.kind})`);
  res.send(
    JSON.stringify({
      mostRecent: getMostRecent(req.params.kind),
    })
  );
});

app.get("/events/:kind/count", (req, res) => {
  console.log(`getCount(${req.params.kind})`);
  res.send(
    JSON.stringify({
      count: getCount(req.params.kind),
    })
  );
});

app.delete("/events/:kind/most-recent", (req, res) => {
  console.log(`dropMostRecent(${req.params.kind})`);
  dropMostRecent(req.params.kind);
  res.sendStatus(200);
});

app.post("/events/:kind/most-recent", (req, res) => {
  console.log(`addMostRecent(${req.params.kind}, ${req.body.mostRecent})`);
  addMostRecent(req.params.kind, req.body.mostRecent);
  res.sendStatus(200);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import type { Service } from "./service";
import type { Express } from "express";
import { printLog } from "./utils";

function numberParam(value?: string): number | undefined {
  return typeof value === "string" ? parseInt(value) : undefined;
}

function setupRoutes(app: Express, service: Service): Express {
  app.get("/events", async (req, res) => {
    const limit = numberParam(req.query.limit?.toString());
    const offset = numberParam(req.query.offset?.toString());
    const after = numberParam(req.query.after?.toString());

    printLog(`getLog(limit=${limit}, offset=${offset}, after=${after})`);
    res.json({
      log: await service.getLog(limit, offset, after),
    });
  });

  app.delete("/events/", async (req, res) => {
    printLog(`dropAll()`);
    await service.dropAll();
    res.sendStatus(200);
  });

  app.get("/events/most-recent", async (req, res) => {
    printLog(`getMostRecent()`);
    res.json({
      mostRecents: await service.getMostRecent(),
    });
  });

  app.get("/events/:kind/most-recent", async (req, res) => {
    printLog(`getMostRecentByKind(kind=${req.params.kind})`);
    res.json({
      mostRecent: await service.getMostRecentByKind(req.params.kind),
    });
  });

  app.get("/events/count", async (req, res) => {
    const after = numberParam(req.query.after?.toString());

    printLog(`getCounts(after=${after})`);
    res.json({
      counts: await service.getCounts(after),
    });
  });

  app.get("/events/:kind/count", async (req, res) => {
    const kind = req.params.kind;
    const after = numberParam(req.query.after?.toString());

    printLog(`getCount(kind=${kind}, after=${after})`);
    res.json({
      count: await service.getCount(kind, after),
    });
  });

  app.delete("/events/:kind/most-recent", async (req, res) => {
    printLog(`dropMostRecent(kind=${req.params.kind})`);
    await service.dropMostRecent(req.params.kind);
    res.sendStatus(200);
  });

  app.post("/events/:kind/most-recent", async (req, res) => {
    printLog(`addMostRecent(kind=${req.params.kind})`);
    await service.addMostRecent(req.params.kind);
    res.sendStatus(200);
  });

  app.patch("/events/:kind/:timestamp", async (req, res) => {
    const kind = req.params.kind;
    const timestamp = parseInt(req.params.timestamp);
    const payload: { timestamp?: number } = req.body;

    if (typeof payload.timestamp === "undefined") {
      res.status(400).send({ error: "missing field 'timestamp'" });
      return;
    }

    printLog(
      `updateEventTimestamp(kind=${kind}, oldTimestamp=${timestamp}, newTimestamp=${payload.timestamp})`
    );
    await service.updateEventTimestamp(kind, timestamp, payload.timestamp);
    res.sendStatus(204);
  });

  return app;
}

export function startServer(port: number, service: Service) {
  const app = express();

  app
    .use(
      cors({
        methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
      })
    )
    .use(bodyParser.json());

  setupRoutes(app, service);

  return app.listen(port, () => {
    return printLog(`Express is listening at http://localhost:${port}`);
  });
}

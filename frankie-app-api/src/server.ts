import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import type { Service } from "./service";
import type { Express } from "express";
import { printLog } from "./utils";

function setupRoutes(app: Express, service: Service): Express {
  app.get("/events", async (req, res) => {
    const limit =
      typeof req.query.limit === "string"
        ? parseInt(req.query.limit)
        : undefined;

    printLog(`getLog()`);
    res.json({
      log: await service.getLog(limit),
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
    printLog(`getMostRecentByKind(${req.params.kind})`);
    res.json({
      mostRecent: await service.getMostRecentByKind(req.params.kind),
    });
  });

  app.get("/events/:kind/count", async (req, res) => {
    const kind = req.params.kind;
    const after =
      typeof req.query.after === "string"
        ? parseInt(req.query.after)
        : undefined;

    printLog(`getCount(${kind}, ${after})`);
    res.json({
      count: await service.getCount(kind, after),
    });
  });

  app.delete("/events/:kind/most-recent", async (req, res) => {
    printLog(`dropMostRecent(${req.params.kind})`);
    await service.dropMostRecent(req.params.kind);
    res.sendStatus(200);
  });

  app.post("/events/:kind/most-recent", async (req, res) => {
    printLog(`addMostRecent(${req.params.kind})`);
    await service.addMostRecent(req.params.kind);
    res.sendStatus(200);
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

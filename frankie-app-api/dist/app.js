"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const lodash_1 = __importDefault(require("lodash"));
const app = (0, express_1.default)();
app
    .use((0, cors_1.default)({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
}))
    .use(body_parser_1.default.json());
const port = 3000;
const store = new Map();
const log = [];
function printLog(message) {
    const timestamp = new Date(lodash_1.default.now()).toISOString();
    console.log(`${timestamp}: ${message}`);
}
function getLog(limit) {
    return typeof limit !== "undefined" ? log.slice(0, limit) : log;
}
function dropAll() {
    store.clear();
    while (log.length) {
        log.pop();
    }
}
function getMostRecent(kind) {
    const times = store.get(kind);
    if (typeof times !== "undefined" && times.length > 0) {
        return times[times.length - 1];
    }
}
function getCount(kind, after) {
    const times = store.get(kind);
    if (typeof times !== "undefined") {
        if (typeof after !== "undefined") {
            let count = 0;
            times.forEach((time) => {
                if (time >= after)
                    count++;
            });
            return count;
        }
        else
            return times.length;
    }
}
function addMostRecent(kind) {
    const entry = { kind: kind, time: lodash_1.default.now() };
    const times = store.get(kind);
    if (typeof times !== "undefined") {
        times.push(entry.time);
    }
    else {
        store.set(kind, [entry.time]);
    }
    log.unshift(entry);
}
function dropMostRecent(kind) {
    const times = store.get(kind);
    if (typeof times !== "undefined") {
        times.pop();
    }
    const lastIndex = lodash_1.default.findIndex(log, (entry) => kind === entry.kind);
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
    const after = typeof req.query.after === "string" ? parseInt(req.query.after) : undefined;
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
//# sourceMappingURL=app.js.map
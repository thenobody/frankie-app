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
function getMostRecent(kind) {
    const times = store.get(kind);
    if (typeof times !== "undefined" && times.length > 0) {
        return times[times.length - 1];
    }
}
function getCount(kind) {
    const times = store.get(kind);
    if (typeof times !== "undefined") {
        return times.length;
    }
}
function addMostRecent(kind, time) {
    const times = store.get(kind);
    if (typeof times !== "undefined") {
        times.push(lodash_1.default.now());
    }
    else {
        store.set(kind, [lodash_1.default.now()]);
    }
}
function dropMostRecent(kind) {
    const times = store.get(kind);
    if (typeof times !== "undefined") {
        times.pop();
    }
}
app.get("/events/:kind/most-recent", (req, res) => {
    console.log(`getMostRecent(${req.params.kind})`);
    res.send(JSON.stringify({
        mostRecent: getMostRecent(req.params.kind),
    }));
});
app.get("/events/:kind/count", (req, res) => {
    console.log(`getCount(${req.params.kind})`);
    res.send(JSON.stringify({
        count: getCount(req.params.kind),
    }));
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
//# sourceMappingURL=app.js.map
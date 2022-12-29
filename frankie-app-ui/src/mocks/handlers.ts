import { rest } from "msw";

export const handlers = [
  rest.get("http://localhost/events", (req, res, ctx) => {
    return res(ctx.json({ log: [] }));
  }),
];

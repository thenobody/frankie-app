import { startServer } from "./src/server";
import { RedisService as Service } from "./src/service";

const service = new Service();
startServer(3000, service);

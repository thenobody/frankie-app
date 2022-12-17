import { startServer } from "./src/server";
import { SimpleService as Service } from "./src/service";

const service = new Service();
startServer(3000, service);

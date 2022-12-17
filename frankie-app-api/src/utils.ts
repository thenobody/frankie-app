import _ from "lodash";

export function printLog(message: string): void {
  const timestamp: string = new Date(_.now()).toISOString();
  console.log(`${timestamp}: ${message}`);
}

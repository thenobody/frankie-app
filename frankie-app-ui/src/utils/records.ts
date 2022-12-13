import { reactive } from "vue";
import _ from "lodash-es";

export interface Record {
  kind: string;
  time: number;
}

export default reactive({
  entities: new Map<String, Array<number>>(),
  addKind(kind: string, time: number = _.now()) {
    const times = this.entities.get(kind);
    if (typeof times !== "undefined") {
      times.push(time);
    } else this.entities.set(kind, [time]);
  },
  dropLast(kind: string) {
    const times = this.entities.get(kind);
    if (typeof times !== "undefined") {
      times.pop();
    }
  },
});

import type { InjectionKey } from "vue";
import type EventService from "./api/EventService";

export const EventServiceKey = Symbol(
  "EventServiceKey"
) as InjectionKey<EventService>;
export const PropertyWindowIsScrollingKey = Symbol(
  "PropertyWindowIsScrollingKey"
) as InjectionKey<boolean>;

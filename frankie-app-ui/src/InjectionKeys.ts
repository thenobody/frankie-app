import type { InjectionKey } from "vue";
import type EventService from "./api/EventService";

export const EventServiceKey = Symbol() as InjectionKey<EventService>;

export interface EventType {
  readonly kind: string;
  readonly label: string;
  readonly icon: string;
}

export const PeeEvent: EventType = { kind: "pee", label: "Pee", icon: "🚽" };

export const PooEvent: EventType = { kind: "poo", label: "Poo", icon: "🧻" };

export const FoodEvent: EventType = { kind: "food", label: "Food", icon: "🍗" };

export const WaterEvent: EventType = {
  kind: "water",
  label: "Water",
  icon: "🚰",
};

export const CooperEvent: EventType = {
  kind: "cooper",
  label: "Cooper",
  icon: "🐶",
};

export const WakeUpEvent: EventType = {
  kind: "wakeup",
  label: "Wake up",
  icon: "⏰",
};

export const SleepEvent: EventType = {
  kind: "sleep",
  label: "Sleep",
  icon: "🛏️",
};

export const EventTypes = [
  PeeEvent,
  PooEvent,
  FoodEvent,
  WaterEvent,
  CooperEvent,
  WakeUpEvent,
  SleepEvent,
];
export function getEventTypeByKind(kind: string): EventType | undefined {
  return EventTypes.find((eventType) => eventType.kind === kind);
}

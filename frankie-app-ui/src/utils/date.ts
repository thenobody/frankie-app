import format from "date-fns/format";
import config from "@/config";
import intervalToDuration from "date-fns/intervalToDuration";

export function formatShortTime(timestamp: number | Date): string {
  return format(timestamp, config.shortTimeFormat);
}

export function formatMillis(millis: number): string {
  const duration = intervalToDuration({
    start: 0,
    end: millis,
  });

  return [duration.hours, duration.minutes, duration.seconds]
    .map((time) => time?.toString().padStart(2, "0"))
    .join(":");
}

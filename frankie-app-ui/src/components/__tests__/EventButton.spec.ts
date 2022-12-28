import { mount } from "@vue/test-utils";
import type { EventType } from "@/model/EventType";
import EventButton from "../EventButton.vue";
import { EventServiceKey, PropertyWindowIsScrollingKey } from "@/InjectionKeys";
import { EventService } from "@/api/EventService";

vi.mock("@/api/EventService", () => {
  const EventService = vi.fn(() => ({
    addMostRecent: vi.fn(),
    dropMostRecent: vi.fn(),
  }));
  return { EventService };
});

const testEventType: EventType = {
  kind: "test",
  label: "Test label",
  icon: "🍆",
};

const mockEventService: EventService = new EventService(
  new URL("http://localhost")
);

const mountOptions = {
  props: testEventType,
  global: {
    provide: {
      [EventServiceKey]: mockEventService,
      [PropertyWindowIsScrollingKey]: false,
    },
  },
};

describe("EventButton", () => {
  it("renders properly", () => {
    const wrapper = mount(EventButton, mountOptions);

    expect(wrapper.get(".full-label").text()).toBe("🍆 Test label");

    expect(wrapper.find("button.undo").exists()).toBe(true);
  });

  it("adds a new event instance", () => {
    const wrapper = mount(EventButton, mountOptions);

    wrapper.get("div.event-button").trigger("click");

    expect(mockEventService.addMostRecent).toHaveBeenCalledOnce();
    expect(mockEventService.addMostRecent).toHaveBeenCalledWith(
      testEventType.kind
    );
  });

  it("deletes the most recent event instance", () => {
    const wrapper = mount(EventButton, mountOptions);

    wrapper.get("button.undo").trigger("click");

    expect(mockEventService.dropMostRecent).toHaveBeenCalledOnce();
    expect(mockEventService.dropMostRecent).toHaveBeenCalledWith(
      testEventType.kind
    );
  });

  it("refuses to fire any action when scrolling", () => {
    const modifiedOptions = { ...mountOptions };
    modifiedOptions.global.provide[PropertyWindowIsScrollingKey] = true;
    const wrapper = mount(EventButton, mountOptions);

    wrapper.get("div.event-button").trigger("click");
    wrapper.get("button.undo").trigger("click");

    expect(mockEventService.addMostRecent).not.toHaveBeenCalledOnce();
    expect(mockEventService.dropMostRecent).not.toHaveBeenCalledOnce();
  });
});

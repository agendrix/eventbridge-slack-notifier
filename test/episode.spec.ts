import assert from "assert";
import { Episode } from "../lambda/types";
import {
  formatDuration,
  formatEpisodeTitle,
  formatTimeline,
  formatTimestamp,
  isChannelId,
  statusEmoji,
  truncate,
} from "../lambda/utils";
import { appendTransition, buildTransition, EVENT_TYPE, renderEpisode, startEpisode } from "../lambda/episode";
import { ALARM_PAYLOAD, OK_PAYLOAD } from "./mocks";

const firingEpisode = (): Episode => startEpisode(ALARM_PAYLOAD, buildTransition(ALARM_PAYLOAD));
const resolvedEpisode = (): Episode => appendTransition(firingEpisode(), buildTransition(OK_PAYLOAD));

describe("statusEmoji", () => {
  it("maps the CloudWatch alarm states", () => {
    assert.strictEqual(statusEmoji("ALARM"), ":red_circle:");
    assert.strictEqual(statusEmoji("OK"), ":large_green_circle:");
    assert.strictEqual(statusEmoji("INSUFFICIENT_DATA"), ":white_circle:");
  });

  it("stays silent on an unknown status", () => {
    assert.strictEqual(statusEmoji("WHATEVER"), "");
    assert.strictEqual(statusEmoji(), "");
  });
});

describe("isChannelId", () => {
  it("accepts a Slack conversation id", () => {
    assert.ok(isChannelId("C0FUJDYQ5X"));
    assert.ok(isChannelId("G01ABCDEF23"));
  });

  it("rejects a channel name", () => {
    assert.ok(!isChannelId("#devops"));
    assert.ok(!isChannelId("devops"));
    assert.ok(!isChannelId());
  });
});

describe("truncate", () => {
  it("leaves a short text alone", () => {
    assert.strictEqual(truncate("short", 10), "short");
  });

  it("ellipsizes a long text", () => {
    assert.strictEqual(truncate("abcdefghij", 5), "abcd…");
  });
});

describe("formatDuration", () => {
  it("renders minutes", () => {
    assert.strictEqual(formatDuration("2026-11-04T23:36:38Z", "2026-11-04T23:43:38Z"), "7 min");
  });

  it("renders hours and minutes", () => {
    assert.strictEqual(formatDuration("2026-11-04T20:00:00Z", "2026-11-04T22:30:00Z"), "2 h 30 min");
  });

  it("returns nothing for an unparseable date", () => {
    assert.strictEqual(formatDuration("not-a-date", "2026-11-04T23:43:38Z"), "");
  });
});

describe("formatTimestamp", () => {
  it("defers the timezone to each Slack viewer", () => {
    const epoch = Math.floor(new Date("2026-11-04T23:36:38Z").getTime() / 1000);
    assert.strictEqual(formatTimestamp("2026-11-04T23:36:38Z"), `<!date^${epoch}^{time_secs}|23:36:38>`);
  });

  it("falls back to the raw value when it is not a date", () => {
    assert.strictEqual(formatTimestamp("not-a-date"), "not-a-date");
  });
});

describe("buildTransition", () => {
  it("keeps the event time rather than the invocation time", () => {
    assert.strictEqual(buildTransition(ALARM_PAYLOAD).at, ALARM_PAYLOAD.time);
  });

  it("truncates the reason it stores", () => {
    const payload = { ...ALARM_PAYLOAD, body: { label: "Details", text: "x".repeat(500) } };
    assert.ok((buildTransition(payload).reason as string).length < 500);
  });
});

describe("appendTransition", () => {
  it("keeps the episode open while the alarm is firing", () => {
    assert.strictEqual(firingEpisode().resolved, false);
  });

  it("closes the episode on OK and keeps both transitions", () => {
    const episode = resolvedEpisode();
    assert.strictEqual(episode.resolved, true);
    assert.deepStrictEqual(
      episode.transitions.map(transition => transition.status),
      ["ALARM", "OK"]
    );
  });
});

describe("formatEpisodeTitle", () => {
  it("shows the current status while firing", () => {
    assert.strictEqual(formatEpisodeTitle(firingEpisode()), ":red_circle: *ALARM* - Api - DB - Master - DiskQueueDepth");
  });

  it("shows the resolution and how long it lasted", () => {
    assert.strictEqual(
      formatEpisodeTitle(resolvedEpisode()),
      ":large_green_circle: *RESOLVED* - Api - DB - Master - DiskQueueDepth · 7 min"
    );
  });

  it("drops the emphasis for the notification text", () => {
    assert.ok(!formatEpisodeTitle(firingEpisode(), false).includes("*"));
  });
});

describe("formatTimeline", () => {
  it("renders one line per transition", () => {
    const timeline = formatTimeline(resolvedEpisode().transitions);
    assert.ok(timeline);
    assert.strictEqual(timeline.text?.text.split("\n").length, 2);
  });

  it("handles an empty timeline", () => {
    assert.strictEqual(formatTimeline([]), undefined);
  });
});

describe("renderEpisode", () => {
  it("carries the episode in the message metadata", () => {
    const episode = firingEpisode();
    const { metadata } = renderEpisode(episode, ALARM_PAYLOAD);
    assert.strictEqual(metadata.event_type, EVENT_TYPE);
    assert.strictEqual(metadata.event_payload.key, ALARM_PAYLOAD.key);
  });

  it("drops the blocks that have nothing to show", () => {
    const { blocks } = renderEpisode(firingEpisode(), { ...ALARM_PAYLOAD, context: undefined, links: undefined });
    assert.deepStrictEqual(
      blocks.map(block => block.type),
      ["section", "divider", "section"]
    );
  });
});

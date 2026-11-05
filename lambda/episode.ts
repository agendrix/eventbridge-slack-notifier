import { Block, DividerBlock, WebClient } from "@slack/web-api";
import { Episode, Payload, Transition } from "./types";
import {
  formatButtons,
  formatContext,
  formatEpisodeTitle,
  formatTimeline,
  isChannelId,
  markdownTextBlock,
  RESOLVED_STATUS,
  truncate,
} from "./utils";

export const EVENT_TYPE = "eventbridge_notifier_episode";

const HISTORY_LIMIT = 100;

const divider: DividerBlock = { type: "divider" };

type OpenEpisode = { ts: string, episode: Episode };

export function buildTransition(payload: Payload): Transition {
  return {
    status: payload.status || "",
    at: payload.time || new Date().toISOString(),
    ...(payload.body?.text ? { reason: truncate(payload.body.text) } : {}),
  };
}

export function appendTransition(episode: Episode, transition: Transition): Episode {
  return {
    ...episode,
    transitions: [...episode.transitions, transition],
    resolved: transition.status === RESOLVED_STATUS,
  };
}

export function startEpisode(payload: Payload, transition: Transition): Episode {
  return {
    key: payload.key as string,
    event: payload.event,
    transitions: [transition],
    resolved: transition.status === RESOLVED_STATUS,
  };
}

export function renderEpisode(episode: Episode, payload: Payload) {
  const blocks = [
    { type: "section", text: markdownTextBlock(formatEpisodeTitle(episode)) },
    formatContext(payload.context),
    divider,
    formatTimeline(episode.transitions),
    formatButtons(payload.links),
  ].filter(block => block) as Array<Block>;

  return {
    text: formatEpisodeTitle(episode, false),
    blocks,
    metadata: { event_type: EVENT_TYPE, event_payload: episode },
  };
}

async function findOpenEpisode(client: WebClient, channel: string, key: string): Promise<OpenEpisode | undefined> {
  const history = await client.conversations.history({
    channel,
    limit: HISTORY_LIMIT,
    include_all_metadata: true,
  });

  for (const message of history.messages || []) {
    const metadata = message.metadata as { event_type?: string, event_payload?: Episode } | undefined;
    const episode = metadata?.event_payload;

    if (metadata?.event_type === EVENT_TYPE && episode?.key === key && !episode.resolved) {
      return { ts: message.ts as string, episode };
    }
  }

  return undefined;
}

export async function notifyEpisode(client: WebClient, channel: string, payload: Payload): Promise<void> {
  if (!isChannelId(channel)) {
    throw new Error(`A Slack channel ID is required to update messages in place, got "${channel}"`);
  }

  const transition = buildTransition(payload);
  const open = await findOpenEpisode(client, channel, payload.key as string);

  if (open) {
    const episode = appendTransition(open.episode, transition);
    await client.chat.update({ channel, ts: open.ts, ...renderEpisode(episode, payload) });
    return;
  }

  await client.chat.postMessage({ channel, ...renderEpisode(startEpisode(payload, transition), payload) });
}

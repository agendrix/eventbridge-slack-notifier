import {  Button, MrkdwnElement, ContextBlock, SectionBlock, ActionsBlock  } from "@slack/web-api";
import { Episode, Link, Text, Transition } from "./types";

export const DEFAULT_EVENT = "No event property was provided";

export const RESOLVED_STATUS = "OK";

export const STATUS_EMOJI: { [status: string]: string } = {
  ALARM: ":red_circle:",
  OK: ":large_green_circle:",
  INSUFFICIENT_DATA: ":white_circle:",
};

const MAX_REASON_LENGTH = 220;

const CHANNEL_ID_PATTERN = /^[CGD][A-Z0-9]{6,}$/;

export function markdownTextBlock(message: string = "", prefix: string | undefined = undefined): MrkdwnElement {
  return {
    type: "mrkdwn",
    text: prefix ? `${prefix}: ${message}` : message
  }
}

export function formatEvent(event = "No event property was provided"): SectionBlock {
  return {
    type: "section",
    text: markdownTextBlock(event, "*Event*")
  }
}

export function formatBody(body: Text | undefined = undefined): SectionBlock | undefined {
  if (body?.text) {
    return {
      type: "section",
      text: markdownTextBlock(`\n${body.text}`, `*${body.label}*`)
    }
  }
  
  return undefined;
}

export function formatContext(context: Array<Text> = []): ContextBlock | undefined {
  const contextElements = context
    .filter(({ text }) => text)
    .map(({label, text}) => markdownTextBlock(text, label))

  if(contextElements.length != 0) {
    return {
      type: "context",
      elements: contextElements 
    }
  }

  return undefined;
}

export function formatFields(fields: Array<Text> = []): SectionBlock | undefined {
  const formattedFields = fields 
    .filter(({ text }) => text)
    .map(({ label, text }) => markdownTextBlock(`\n${text}`, `*${label}*`))
  
  if (formattedFields.length > 0) {
    return { 
      type: "section",
      fields: formattedFields 
    }
  }

  return undefined;
}

export function formatButtons(links: Array<Link> = []): ActionsBlock | undefined {
  const buttons: Array<Button> = links
  .filter(({ url }) => url)
  .map(link => ({
    type: "button",
    text: {
      type: "plain_text",
      text: link.label,
    },
    url: link.url
  }))

  if (buttons.length > 0) {
    return {
      type: "actions",
      elements: buttons 
    }
  }

  return undefined;
}

export function isChannelId(channel: string = ""): boolean {
  return CHANNEL_ID_PATTERN.test(channel);
}

export function statusEmoji(status: string = ""): string {
  return STATUS_EMOJI[status] || "";
}

export function truncate(text: string, maxLength: number = MAX_REASON_LENGTH): string {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text;
}

/** Renders as the viewer's own local time, which a team spread over several regions needs. */
export function formatTimestamp(at: string): string {
  const epoch = Math.floor(new Date(at).getTime() / 1000);
  if (!isFinite(epoch)) return at;

  const fallback = new Date(at).toISOString().substr(11, 8);
  return `<!date^${epoch}^{time_secs}|${fallback}>`;
}

export function formatDuration(from: string, to: string): string {
  const minutes = Math.round((new Date(to).getTime() - new Date(from).getTime()) / 60000);
  if (!isFinite(minutes) || minutes < 0) return "";
  if (minutes < 60) return `${minutes} min`;

  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

export function formatTransition({ status, at, reason }: Transition): string {
  const details = reason ? ` — ${truncate(reason)}` : "";
  return `${statusEmoji(status)} ${formatTimestamp(at)} *${status}*${details}`;
}

export function formatTimeline(transitions: Array<Transition> = []): SectionBlock | undefined {
  if (transitions.length === 0) return undefined;

  return {
    type: "section",
    text: markdownTextBlock(transitions.map(formatTransition).join("\n"))
  }
}

export function formatEpisodeTitle({ event, transitions, resolved }: Episode, bold: boolean = true): string {
  const last = transitions[transitions.length - 1];
  const label = resolved ? "RESOLVED" : last?.status || "";
  const emphasis = bold ? "*" : "";
  const duration = resolved && transitions.length > 1 ? formatDuration(transitions[0].at, last.at) : "";

  return [
    [statusEmoji(last?.status), `${emphasis}${label}${emphasis}`, `- ${event}`].filter(part => part).join(" "),
    duration,
  ]
    .filter(part => part)
    .join(" · ");
}

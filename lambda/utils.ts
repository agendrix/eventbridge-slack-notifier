import {  MrkdwnElement, ContextBlock, SectionBlock, ActionsBlock  } from "@slack/web-api";
import { Link, Text } from "./types";

export const DEFAULT_EVENT = "No event property was provided";

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
  const buttons = links
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
import { WebClient, WebAPICallResult, ContextBlock, SectionBlock, ActionsBlock, Block, DividerBlock } from "@slack/web-api";
import { Handler } from "aws-lambda";
import { Payload, Text } from "./types";
import { formatEvent, formatContext, formatFields, formatButtons } from "./utils"
import AWS from "aws-sdk";

const handler: Handler = async (payload: Payload) => {
  const slackClient = new WebClient(process.env.SLACK_ACCESS_TOKEN);

  let { context } = payload;
  const { event, fields, links, attachment } = payload;

  context = context || [];
  const account = await fetchAccountAlias();
  context = account ? [account, ...context] : context

  const formattedEvent: SectionBlock = formatEvent(event);
  const formattedContext: ContextBlock | undefined = formatContext(context);
  const formattedFields: SectionBlock | undefined = formatFields(fields);
  const formattedButtons: ActionsBlock | undefined = formatButtons(links);

  const blocks = [
    formattedEvent,
    formattedContext,
    divider,
    formattedFields,
    formattedButtons
  ].filter(block => block) as Array<Block>


  const response: WebAPICallResult = await slackClient.chat.postMessage({
    channel: process.env.SLACK_CHANNEL as string,
    text: event,
    blocks
  })


  if (response.ok && attachment) {
    await slackClient.files.upload({
      channels: process.env.SLACK_CHANNEL as string,
      thread_ts: response.ts as string,
      content: JSON.stringify(attachment),
      filename: "attachment.json",
      initial_comment: "attachment"
    })
  }
};



async function fetchAccountAlias(): Promise<Text | undefined> {
  let accountAlias = (await new AWS.IAM().listAccountAliases().promise()).AccountAliases.shift(); 
  return accountAlias ? { label: "Account", text: accountAlias } : undefined 
}

const divider: DividerBlock = { type: "divider" }

exports.handler = handler;
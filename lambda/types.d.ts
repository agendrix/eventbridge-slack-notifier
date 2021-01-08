import { Context } from "aws-lambda";

export type Handler<TEvent = any, TResult = any> = (event: TEvent, context: Context) => Promise<TResult>;

export type Link = { 
  label: string,
  url: string 
}

export type Text = { 
  label: string | undefined,
  text: string 
}

export type Payload = {
  event: string,
  context: Array<Text> | undefined,
  fields: Array<Text> | undefined,
  links: Array<Link> | undefined,
  attachment: object | undefined
}
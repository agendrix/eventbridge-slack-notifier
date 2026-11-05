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
  body: Text | undefined,
  links: Array<Link> | undefined,
  attachment: object | undefined,
  key?: string,
  status?: string,
  time?: string
}

export type Transition = {
  status: string,
  at: string,
  reason?: string
}

export type Episode = {
  key: string,
  event: string,
  transitions: Array<Transition>,
  resolved: boolean
}

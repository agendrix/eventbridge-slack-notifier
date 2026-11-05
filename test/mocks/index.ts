export const PAYLOAD = {
    event: "This is an event",
    context: [
      { 
        "label": "Source",
        "text": "ecs" 
      },
      { 
        "label": "Time",
        "text": Date.now().toString()
      },
      {
        "label": "Missing",
        "text": ""
      }
    ],
    fields: [
      { 
        "label": "Cluster",
        "text": "Cluster Name" 
      },
      { 
        "label": "Service",
        "text": "Service Name" 
      },
      {
        "label": "Missing",
        "text": ""
      }
    ],
    body: {
      "label": "Body",
      "text": "Body content"
    },
    links: [
      {
        "label": "Search google",
        "url": "https://google.com"
      },
      {
        "label": "Missing",
        "url": ""
      },
    ]
  } 


export const ALARM_PAYLOAD = {
  event: "Api - DB - Master - DiskQueueDepth",
  key: "123456789012/eu-west-3/Api - DB - Master - DiskQueueDepth",
  status: "ALARM",
  time: "2026-11-04T23:36:38Z",
  context: [{ label: "Source", text: "aws.cloudwatch" }],
  fields: undefined,
  body: {
    label: "Details",
    text: "Threshold Crossed: 5 out of the last 5 datapoints were greater than or equal to the threshold (10.0).",
  },
  links: [{ label: "View alarms", url: "https://console.aws.amazon.com/cloudwatch" }],
  attachment: undefined,
};

export const OK_PAYLOAD = {
  ...ALARM_PAYLOAD,
  status: "OK",
  time: "2026-11-04T23:43:38Z",
  body: {
    label: "Details",
    text: "Threshold Crossed: 5 datapoints were not greater than or equal to the threshold (10.0).",
  },
};

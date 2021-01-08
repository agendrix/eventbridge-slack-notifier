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
    "fields": [
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
    "body": {
      "label": "Body",
      "text": "Body content"
    },
    "links": [
      {
        "label": "Search google",
        "url": "https://google.com"
      },
      {
        "label": "Missing",
        "url": ""
      },
    ],
  } 


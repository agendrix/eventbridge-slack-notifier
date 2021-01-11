import assert from "assert";
import { Button }from "@slack/web-api";
import { markdownTextBlock, formatEvent, formatContext, formatButtons, formatFields, DEFAULT_EVENT, formatBody } from "../lambda/utils";
import { PAYLOAD } from "./mocks";

describe("markdownTextBlock", () => {
  it("has a type property", () => {
    const block = markdownTextBlock("text");
    assert.ok(block.type); 
  })

  it("has a text property", () => {
    const block = markdownTextBlock("text");
    assert.ok(block.text); 
  })

  it("prepends text with a prefix if provided", () => {
    const block = markdownTextBlock("text", "prefix");
    assert.strictEqual(block.text, "prefix: text"); 
  })

  it("does not add a prefix if not provided", () => {
    const block = markdownTextBlock("text");
    assert.strictEqual(block.text, "text"); 
  })

  it("handles undefined text", () => {
    const block = markdownTextBlock();
    assert.strictEqual(block.text, ""); 
  })
})

describe("formatEvent", () => {
  it("has a type property", async () => {
    const { event } = PAYLOAD
    const formattedEvent = formatEvent(event);
    assert.ok(formattedEvent.type);
  });

  it("has a text property", async () => {
    const { event } = PAYLOAD;
    const formattedEvent = formatEvent(event);
    assert.ok(formattedEvent.text);
  });

  it("format event as a section block", async () => {
    const formattedEvent = formatEvent(PAYLOAD.event);
    assert.deepStrictEqual(formattedEvent, {
      type: 'section',
      text: markdownTextBlock(`*Event*: ${PAYLOAD.event}`)
    });
  })

  it("handles undefined event", async () => {
    const formattedEvent = formatEvent();
    assert.deepStrictEqual(formattedEvent, {
      type: 'section',
      text: markdownTextBlock(`*Event*: ${DEFAULT_EVENT}`)
    });
  })
});

describe("formatContext", () => {
  it("has a type property", async () => {
    const { context } = PAYLOAD;
    const formattedContext = formatContext(context);
    assert.ok(formattedContext);
    assert.ok(formattedContext.type);
    assert.strictEqual(formattedContext.type, 'context');
  });

  it("has a elements property", async () => {
    const { context } = PAYLOAD;
    const formattedContext = formatContext(context);
    assert.ok(formattedContext);
    assert.ok(formattedContext.elements);
  })

  it("filters elements with falsy text", async () => {
    const { context } = PAYLOAD;
    const falsyElement = context.find(element => !element.text);
    assert.ok(falsyElement);
    const formattedContext = formatContext(context);
    assert.notStrictEqual(formattedContext?.elements.length, context.length)
  })

  it("handles undefined context", async () => {
    const formattedContext = formatContext();
    assert.strictEqual(formattedContext, undefined);
  })
});

describe("formatFields", () => {
  it("has a type property", async () => {
    const { fields } = PAYLOAD;
    const formattedFields = formatFields(fields);
    assert.ok(formattedFields);
    assert.ok(formattedFields.type);
  });

  it("has a fields property", async () => {
    const { fields } = PAYLOAD;
    const formattedFields = formatFields(fields);
    assert.ok(formattedFields);
    assert.ok(formattedFields.fields);
  });

  it("format event as a section block", async () => {
    const { fields } = PAYLOAD;
    const formattedFields = formatFields(fields);
    assert.ok(formattedFields);
    assert.ok(formattedFields.fields);

    const field = fields.shift();
    assert.deepStrictEqual(formattedFields.fields.shift(), markdownTextBlock(`\n${field?.text}`, `*${field?.label}*`));
  })

  it("filters fields with falsy text", async () => {
    const { fields } = PAYLOAD;
    const falsyField = fields.find(field => !field.text);
    assert.ok(falsyField);
    const formattedFields = formatFields(fields);
    assert.notStrictEqual(formattedFields?.fields?.length, fields.length)
  })

  it("handles undefined fields", async () => {
    const formattedFields = formatFields();
    assert.strictEqual(formattedFields, undefined);
  })
});

describe("formatBody", () => {
  it("has a type property", async () => {
    const { body } = PAYLOAD
    const formattedBody = formatBody(body);
    assert.ok(formattedBody);
    assert.ok(formattedBody.type);
  });

  it("has a text property", async () => {
    const { body } = PAYLOAD
    const formattedBody = formatBody(body);
    assert.ok(formattedBody);
    assert.ok(formattedBody.text);
  });

  it("format event as a section block", async () => {
    const { body } = PAYLOAD
    const formattedBody = formatBody(body);
    assert.deepStrictEqual(formattedBody, {
      type: 'section',
      text: markdownTextBlock(`\n${PAYLOAD.body.text}`, `*${PAYLOAD.body.label}*`)
    });
  })

  it("handles undefined event", async () => {
    const formattedBody = formatBody();
    assert.strictEqual(formattedBody, undefined) ;
  })
});

describe("formatButtons", () => {
  it("has a type property", async () => {
    const { links } = PAYLOAD;
    const formattedButtons = formatButtons(links);
    assert.ok(formattedButtons);
    assert.ok(formattedButtons.type);
  });

  it("has a elements property", async () => {
    const { links } = PAYLOAD;
    const formattedButtons = formatButtons(links);
    assert.ok(formattedButtons);
    assert.ok(formattedButtons.elements);
  });

  it("format event as a actions block", async () => {
    const { links } = PAYLOAD;
    const formattedButtons = formatButtons(links)
    assert.ok(formattedButtons);
    assert.ok(formattedButtons.elements);
    
    const button: Button | undefined = formattedButtons.elements.shift() as Button | undefined;
    assert.strictEqual(button?.type, "button")
    assert.ok(button.url);
    assert.ok(button.text);
  })

  it("filters fields with falsy url", async () => {
    const { links } = PAYLOAD;
    const falsyLink = links.find(field => !field.url);
    assert.ok(falsyLink);
    const formattedButtons = formatButtons(links);
    assert.notStrictEqual(formattedButtons?.elements.length, links.length)
  })

  it("handles undefined links", async () => {
    const formattedButtons = formatButtons()
    assert.strictEqual(formattedButtons, undefined);
  })
});

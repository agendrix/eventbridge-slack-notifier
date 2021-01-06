import assert from "assert";

import "./mocks";

import { __test__ } from "../lambda/index";
import { S3 } from "aws-sdk";
import { MOCKED_BUCKETS, MOCKED_OWNER } from "./mocks/libs/aws-sdk";
import { postRequest } from "./helpers/post-request";

const handler = __test__.handler;

const LAMBDA_URL = process.env.LAMBDA_URL;

if (LAMBDA_URL !== undefined) {
  /* Integration tests with the deployed lambda */
  describe("lambda POST call", () => {
    it("returns 200 with Hello World", async () => {
      const response = await postRequest(LAMBDA_URL, {});

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.headers?.["content-type"], "application/json");
    });
  });
} else {
  /* Local tests */
  describe("exports.handler", () => {
    const fakeEvent: any = {};
    const fakeContext: any = {};

    it("returns 200 with Hello World", async () => {
      const response = await handler(fakeEvent, fakeContext);

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.headers?.["content-type"], "application/json");
      assert.strictEqual(JSON.parse(response.body || "").text, "Hello World");
    });

    it("returns a list of S3 buckets", async () => {
      const response = await handler(fakeEvent, fakeContext);
      const listBucketsOutput: S3.ListBucketsOutput = JSON.parse(response.body || "").listBuckets;

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.headers?.["content-type"], "application/json");
      assert.strictEqual(listBucketsOutput.Owner?.DisplayName, MOCKED_OWNER);
      assert.deepStrictEqual(
        listBucketsOutput.Buckets?.map(b => b.Name),
        MOCKED_BUCKETS
      );
    });
  });
}

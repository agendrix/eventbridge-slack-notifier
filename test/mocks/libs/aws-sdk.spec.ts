import { MOCKED_BUCKETS, MOCKED_OWNER } from "./aws-sdk";
import assert from "assert";
import AWS from "aws-sdk";

describe("Mock aws-sdk", () => {
  describe("S3", () => {
    it("listBuckets", async () => {
      const s3 = new AWS.S3();

      const listBucketsOutput = await s3.listBuckets().promise();

      assert.strictEqual(listBucketsOutput.Owner?.DisplayName, MOCKED_OWNER);
      assert.deepStrictEqual(
        listBucketsOutput.Buckets?.map(b => b.Name),
        MOCKED_BUCKETS
      );
    });
  });
});

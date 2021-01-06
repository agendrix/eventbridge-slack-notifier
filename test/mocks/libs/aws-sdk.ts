import AWS, { S3 } from "aws-sdk";

export const MOCKED_OWNER = "Test Owner";
export const MOCKED_BUCKETS = ["bucket-1", "bucket-2", "bucket-3"];

type PromiseResult<T> = { promise: () => Promise<T> };

export class MockS3 {
  listBuckets(): PromiseResult<S3.ListBucketsOutput> {
    return {
      promise: async () => ({
        Owner: {
          DisplayName: MOCKED_OWNER,
          ID: "123",
        },
        Buckets: MOCKED_BUCKETS.map(bucketName => ({
          Name: bucketName,
          CreationDate: new Date(Date.now()),
        })),
      }),
    };
  }
}
AWS.S3 = MockS3 as any;

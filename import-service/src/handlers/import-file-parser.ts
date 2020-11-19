import { S3Handler, S3Event } from 'aws-lambda';
import 'source-map-support/register';
import AWS from 'aws-sdk';
import csv from 'csv-parser';
import util from 'util';
import stream from 'stream';

import {AWS_REGION, BUCKET, SOURCE_FOLDER, TARGET_FOLDER} from '../constants';
import {toAccept} from '../../../common/src/utils/response';

const s3 = new AWS.S3({ region: AWS_REGION });
const sqs = new AWS.SQS();
const pipeline = util.promisify(stream.pipeline);

const QueueUrl = process.env.CATALOG_ITEMS_QUEUE_URL;

export const importFileParser: S3Handler = async (event: S3Event) => {
  console.log(event.Records);
  for (const record of event.Records) {
    const s3Stream = s3.getObject({
      Bucket: BUCKET,
      Key: record.s3.object.key
    }).createReadStream();

    await pipeline(s3Stream, csv(), new LogRow());

    const targetKey = record.s3.object.key.replace(SOURCE_FOLDER, TARGET_FOLDER);
    console.log(`Moving from ${BUCKET}/${record.s3.object.key}`);

    await s3.copyObject({
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${record.s3.object.key}`,
      Key: targetKey
    }).promise();

    await s3.deleteObject({
      Bucket: BUCKET,
      Key: record.s3.object.key
    }).promise();

    console.log(`Moved into ${BUCKET}/${targetKey}`);
  }

  return toAccept();
};

class LogRow extends stream.Transform {
  constructor() {
    super({ objectMode: true });
  }

  async _transform(row, _enc, callback) {
    try {
      delete row.id;
      await sqs.sendMessage({
        QueueUrl,
        MessageBody: row,
      }, (error) => {
        console.warn(`Error in sendMessage callback: ${JSON.stringify(error)}`);
      });
    } catch (err) {
      console.warn(`Error during sending ${JSON.stringify(row)} to ${QueueUrl}`)
      callback(err);
    }
    console.log(`${JSON.stringify(row)} was successfully sent to ${QueueUrl}`);
    callback(null, row);
  }
}

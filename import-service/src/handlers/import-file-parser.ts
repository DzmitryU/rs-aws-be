import { S3Event } from 'aws-lambda';
import 'source-map-support/register';
import AWS from 'aws-sdk';
import csv from 'csv-parser';

import {AWS_REGION, BUCKET} from '../constants';
const s3 = new AWS.S3({ region: AWS_REGION });

export const importFileParser: S3Event = (event: S3Event) => {
  console.log(event.Records);
  event.Records.forEach((record) => {
    const s3Stream = s3.getObject({
      Bucket: BUCKET,
      Key: record.s3.object.key
    }).createReadStream();

    s3Stream.pipe(csv())
        .on('data', (data) => {
          console.log(data);
        })
        .on('end', async () => {
          console.log(`Copy from ${BUCKET}/${record.s3.object.key}`);

          await s3.copyObject({
            Bucket: BUCKET,
            CopySource: `${BUCKET}/${record.s3.object.key}`,
            Key: record.s3.object.key.replace('uploaded', 'parsed')
          }).promise();

          console.log(`Copied into ${BUCKET}/${record.s3.object.key.replace('uploaded', 'parsed')}`);
        });

  });
};

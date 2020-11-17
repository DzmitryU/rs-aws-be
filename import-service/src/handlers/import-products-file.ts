import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk';

import {toSuccess} from '../utils/response';
import {AWS_REGION, BUCKET, SOURCE_FOLDER} from '../constants';

export const importProductsFile: APIGatewayProxyHandler = async (event, _context) => {
  const s3 = new AWS.S3({ region: AWS_REGION });
  const { name } = event.queryStringParameters;
  console.log(`importProductsFile - name: ${name}`);

  const catalogPath = `${SOURCE_FOLDER}/${name}`;
  const params = {
    Bucket: BUCKET,
    Key: catalogPath,
    Expires: 100,
    ContentType: 'text/csv'
  }

  const url = await s3.getSignedUrlPromise('putObject', params);
  console.log(`importProductsFile - signedUrl: ${url}`);

  return toSuccess(url);
};

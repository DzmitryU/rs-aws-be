import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import AWS from 'aws-sdk';
import {toSuccess} from "../utils/response";
const s3 = new AWS.S3({ region: 'eu-west-1' });

const BUCKET = 'rs-aws-be';


export const importProductsFile: APIGatewayProxyHandler = async (event, _context) => {
  const { name } = event.queryStringParameters;
  console.log(`importProductsFile - name: ${name}`);

  const catalogPath = `uploaded/${name}`;
  const params = {
    Bucket: BUCKET,
    Key: catalogPath,
    Expires: 100,
    ContentType: 'text/csv'
  }

  const url = await s3.getSignedUrl('putObject', params);
  console.log(`importProductsFile - signedUrl: ${url}`);

  return toSuccess(url);
};

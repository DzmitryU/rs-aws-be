import { APIGatewayProxyHandler } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import 'source-map-support/register';

import AWS from 'aws-sdk';
const s3 = new AWS.S3({ region: 'eu-west-1' });

const BUCKET = 'rs-aws-be';


export const importProductsFile: APIGatewayProxyHandler = async (event, _context) => {
  const { name } = event.pathParameters;
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

  return {
    statusCode: StatusCodes.OK,
    body: url,
  };
};

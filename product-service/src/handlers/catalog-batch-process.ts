import { SQSHandler } from 'aws-lambda';
import AWS from 'aws-sdk';
import 'source-map-support/register';

import {create} from '../dataStore'
import {toAccept, toServerError, toValidationError} from '../../../common/src/utils/response';
import {Product} from '../types/Product';
import {productSchema} from './schemas/product';

const sns = new AWS.SNS({ region: 'eu-west-1' });

export const catalogBatchProcess: SQSHandler = async (event) => {
    console.log(`catalog-batch-process - event.Records: ${event.Records}`);
  try {
      for (const record of event.Records) {
          const product: Product = JSON.parse(record.body);
          const validationError = productSchema.validate(product).error;

          if (validationError) {
              console.warn(`catalog-batch-process - Joi validation error: ${JSON.stringify(validationError)}`);
              return toValidationError();
          }

          const savedProduct = await create(product);
          console.log(`catalogBatchProcess - next savedProduct: ${JSON.stringify(savedProduct)}`);
      }

      await sns.publish({
          Subject: 'New products import',
          Message: JSON.stringify(event.Records),
          TopicArn: process.env.TOPIC_ARN
      }).promise();

      return toAccept();
  } catch (error) {
    console.warn(`catalog-batch-process - Unhandled server error: ${error}`);

    return toServerError();
  }
}

import { SQSHandler } from 'aws-lambda';
import 'source-map-support/register';

import {toAccept, toServerError, toValidationError} from '../../../common/src/utils/response';
import {Product} from '../types/Product';
import {createProduct} from "../service/products";
import {send} from "../service/email";

export const catalogBatchProcess: SQSHandler = async (event) => {
    console.log(`catalog-batch-process - event.Records: ${JSON.stringify(event.Records)}`);
  try {
      const ids = [];
      for (const record of event.Records) {
          const product: Product = JSON.parse(record.body);
          const savedProduct = await createProduct(product);
          ids.push(savedProduct.id);
      }
      await send(ids);

      return toAccept();
  } catch (error) {
      if (error.name === 'ValidationError') {
          console.warn(`catalog-batch-process - Joi validation error: ${JSON.stringify(error)}`);

          return toValidationError();
      }
    console.warn(`catalog-batch-process - Unhandled server error: ${error}`);

    return toServerError();
  }
}

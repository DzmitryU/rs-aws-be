import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import {create} from '../dataStore'
import {toServerError, toSuccess, toValidationError} from '../utils/response';
import {Product} from '../types/Product';
import {productSchema} from './schemas/product';

export const createProduct: APIGatewayProxyHandler = async (event) => {
  try {
    console.log(`create-product - event.body: ${JSON.stringify(event.body)}`);
    const product: Product = JSON.parse(event.body);
    const validationError = productSchema.validate(product).error;
    if (validationError) {
      console.warn(`Joi validation error: ${JSON.stringify(validationError)}`);
      return toValidationError();
    }

    const savedProduct = await create(product);
    console.log(`createProduct - savedProduct: ${JSON.stringify(savedProduct)}`);

    return toSuccess(product);
  } catch (error) {
    console.warn(`createProduct - Unhandled server error: ${JSON.stringify(error)}`);

    return toServerError();
  }
}

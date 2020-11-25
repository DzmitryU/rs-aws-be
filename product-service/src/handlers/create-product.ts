import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import {toServerError, toSuccess, toValidationError} from '../../../common/src/utils/response';
import {Product} from '../types/Product';
import {createProduct as create} from '../service/products';

export const createProduct: APIGatewayProxyHandler = async (event) => {
  try {
    console.log(`create-product - event.body: ${event.body}`);
    const product: Product = JSON.parse(event.body);

    const savedProduct = await create(product);
    console.log(`createProduct - savedProduct: ${JSON.stringify(savedProduct)}`);

    return toSuccess(product);
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.warn(`create-product - Joi validation error: ${JSON.stringify(error)}`);

      return toValidationError();
    }

    console.warn(`createProduct - Unhandled server error: ${error}`);
    return toServerError();
  }
}

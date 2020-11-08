import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import {getById} from '../dataStore'
import {toNotFound, toServerError, toSuccess, toValidationError} from "../utils/response";
import {idSchema} from "./schemas/id";

export const getProductsById: APIGatewayProxyHandler = async (event) => {
  try {
    const { productId } = event.pathParameters;
    console.log(`product-by-id - event.pathParameters.productId: ${productId}`);

    const validationError = idSchema.validate(productId).error;
    if (validationError) {
      console.warn(`product-by-id - Joi validation error: ${JSON.stringify(validationError)}`);
      return toValidationError();
    }

    const product = await getById(productId);
    console.log(`product-by-id - product: ${JSON.stringify(product)}`);

    return product ? toSuccess(product) : toNotFound();
  } catch (error) {
    console.warn(`product-by-id - Unhandled server error: ${error}`);

    return toServerError();
  }
}

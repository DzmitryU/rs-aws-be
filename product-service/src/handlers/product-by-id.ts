import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import {getById} from '../dataStore'
import {toNotFound, toSuccess} from "../utils/response";

export const getProductsById: APIGatewayProxyHandler = async (event) => {
  const { productId } = event.pathParameters;
  console.log(`product-by-id - event.pathParameters.productId: ${productId}`);

  const product = await getById(productId);
  console.log(`product-by-id - product: ${JSON.stringify(product)}`);

  return product ? toSuccess(product) : toNotFound();
}

import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import {products} from '../data/products'
import {toSuccess} from "../utils/response";

export const getProductsById: APIGatewayProxyHandler = async (event) => {
  const { productId } = event.pathParameters;
  console.log(`product-by-id - event.pathParameters.productId: ${productId}`);

  const product = products.find((product) => product.id === productId);
  console.log(`product-by-id - product: ${JSON.stringify(product)}`);

  return toSuccess(product);
}

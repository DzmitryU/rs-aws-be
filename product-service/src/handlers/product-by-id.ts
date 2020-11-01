import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import {products} from '../data/products'

export const getProductsById: APIGatewayProxyHandler = async (event) => {
  const { productId } = event.pathParameters;

  console.log(`product-by-id - event.pathParameters.productId: ${productId}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: products.find((product) => product.id === productId),
    }, null, 2),
  };
}

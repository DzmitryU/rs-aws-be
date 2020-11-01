import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import {products} from '../data/products'

export const getProductsList: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: products,
    }, null, 2),
  };
}

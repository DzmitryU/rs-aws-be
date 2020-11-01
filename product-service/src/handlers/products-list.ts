import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import {products} from '../data/products'
import {toSuccess} from "../utils/response";

export const getProductsList: APIGatewayProxyHandler = async () => {
  return toSuccess(products);
}

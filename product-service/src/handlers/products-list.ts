import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import {getAll} from '../dataStore'
import {toSuccess} from "../utils/response";

export const getProductsList: APIGatewayProxyHandler = async () => {
  const products = await getAll();
  return toSuccess(products);
}

import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import {getAll} from '../dataStore'
import {toServerError, toSuccess} from '../utils/response';

export const getProductsList: APIGatewayProxyHandler = async () => {
  console.log('Querying for all products');
  try {
    const products = await getAll();

    return toSuccess(products);
  } catch (error) {
    console.warn(`products-list - Unhandled server error: ${error}`);

    return toServerError();
  }
}

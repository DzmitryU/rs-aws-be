import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import {create} from '../dataStore'
import {toServerError, toSuccess} from "../utils/response";
import {Product} from "../types/Product";

export const createProduct: APIGatewayProxyHandler = async (event) => {
  try {
    console.log(`create-product - event.body: ${JSON.stringify(event.body)}`);
    const product: Product = JSON.parse(JSON.stringify(event.body));

    const savedProduct = await create(product);
    console.log(`createProduct - savedProduct: ${JSON.stringify(savedProduct)}`);

    return toSuccess(product);
  } catch (error) {
    console.warn(`createProduct - Unhandled server error: ${JSON.stringify(error)}`);

    return toServerError();
  }
}

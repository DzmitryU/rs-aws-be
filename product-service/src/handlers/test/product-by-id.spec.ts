import {describe} from "@jest/globals";
import {StatusCodes} from 'http-status-codes';
import { mockEventCreator } from 'aws-lambda-test-utils';

import {products} from '../../dataStore/db'

import { getProductsById } from '../product-by-id';
import {APIGatewayProxyResult} from "aws-lambda/trigger/api-gateway-proxy";

describe('[getProductsById]', () => {
   test('should return product by id', async () => {
      const event = mockEventCreator.createAPIGatewayEvent();
      event.pathParameters.productId = products[0].id;
      const response =  <APIGatewayProxyResult> await getProductsById(event, null, null);

      expect(true).toBeTruthy();
      expect(response).toBeDefined();
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(JSON.parse(response.body)).toEqual(products[0]);
   });

   test('should return 404 for missing product ', async () => {
      const event = mockEventCreator.createAPIGatewayEvent();
      event.pathParameters.productId = 'no such id';
      const response =  <APIGatewayProxyResult> await getProductsById(event, null, null);

      expect(true).toBeTruthy();
      expect(response).toBeDefined();
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
   });
});
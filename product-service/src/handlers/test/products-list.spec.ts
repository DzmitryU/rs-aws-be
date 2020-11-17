import {describe} from '@jest/globals';
import {StatusCodes} from 'http-status-codes';
import {products} from '../../dataStore/db'

import { getProductsList } from '../products-list';
import {APIGatewayProxyResult} from 'aws-lambda/trigger/api-gateway-proxy';

describe('[getProductsList]', () => {
   test('should return list of products', async () => {
      const response =  <APIGatewayProxyResult> await getProductsList(null, null, null);

      expect(true).toBeTruthy();
      expect(response).toBeDefined();
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(JSON.parse(response.body)).toEqual(products);
   });
});
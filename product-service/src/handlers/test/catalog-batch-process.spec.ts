jest.mock('../../service/products', () => {
    createProduct: jest.fn().mockImplementation(async (product: Product) => product);
});
jest.mock('../../service/email');
jest.mock('../../../../common/src/utils/response');

import {SQSRecord} from 'aws-lambda';

import {catalogBatchProcess} from '../catalog-batch-process';
import {createProduct} from '../../service/products';
import {send} from '../../service/email';
import {toSuccess, toValidationError} from '../../../../common/src/utils/response';
import { products } from './fixtures/products';
import {Product} from '../../types/Product';


describe('[catalogBatchProcess]', () => {

    test('should save products and send notification', async () => {
        await catalogBatchProcess({ Records: [<SQSRecord>{ body: JSON.stringify(products[0])}]}, null, null);

        expect(createProduct).toHaveBeenCalledWith(products[0]);
        expect(send).toHaveBeenCalledWith([products[0].id]);
        expect(toSuccess).toHaveBeenCalled();
    });

    test('should fail because of invalid product', async () => {
        await catalogBatchProcess({ Records: [<SQSRecord>{ body: JSON.stringify(products[1])}]}, null, null);

        expect(createProduct).toHaveBeenCalledWith(products[1]);
        expect(toValidationError).toHaveBeenCalled();
    });

    afterAll(() => {
        jest.resetAllMocks();
    });
});
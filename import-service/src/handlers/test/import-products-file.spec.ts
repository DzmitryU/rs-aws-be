import * as AWSMock from 'aws-sdk-mock';
import { mockEventCreator } from 'aws-lambda-test-utils';

import {importProductsFile} from '../import-products-file';
import {StatusCodes} from 'http-status-codes';
import {APIGatewayProxyResult} from 'aws-lambda';
import {BUCKET, SOURCE_FOLDER} from '../../constants';

const NAME = 'name';
const EXPECTED_PARAMS = {
    Bucket: BUCKET,
    Key: `${SOURCE_FOLDER}/${NAME}`,
    Expires: 100,
    ContentType: 'text/csv'
}
const SIGNED_URL = 'SIGNED_URL';

describe('[importProductsFile]', () => {
    const mockedGetSignedUrl = jest.fn().mockImplementation((_action, _params, callback) => {
        callback(null, SIGNED_URL);
    });

    beforeAll(() => {
        AWSMock.mock('S3', 'getSignedUrl', mockedGetSignedUrl);
    });

    test('should return signed url', async () => {
        const event = mockEventCreator.createAPIGatewayEvent();
        event.queryStringParameters.name = 'name';

        const response = <APIGatewayProxyResult> await importProductsFile(event, null, null);

        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.body).toBe(SIGNED_URL);
        expect(mockedGetSignedUrl.mock.calls.length).toBe(1);
        expect(mockedGetSignedUrl.mock.calls[0][0]).toBe('putObject');
        expect(mockedGetSignedUrl.mock.calls[0][1]).toEqual(EXPECTED_PARAMS);
    });

    afterAll(() => {
        AWSMock.restore('S3');
    });
});
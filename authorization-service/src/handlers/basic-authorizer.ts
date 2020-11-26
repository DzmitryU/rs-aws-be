import {APIGatewayProxyHandler} from 'aws-lambda';
import {toSuccess} from '../../../common/src/utils/response';

export const basicAuthorizer: APIGatewayProxyHandler = async () => {
    return toSuccess('OK');
}
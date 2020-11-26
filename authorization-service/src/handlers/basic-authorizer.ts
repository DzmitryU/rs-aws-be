import {APIGatewayTokenAuthorizerHandler} from 'aws-lambda';
import {toAccessDenied, toServerError, toSuccess, toUnauthorized} from '../../../common/src/utils/response';

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event) => {
    try {
        const authorizationToken = event.authorizationToken;

        if (!authorizationToken) {
            return toUnauthorized();
        }

        const encodedCreds = authorizationToken.split(' ')[1];
        const buff = Buffer.from(encodedCreds, 'base64');
        const [username, password] = buff.toString('utf-8').split(':')

        console.log(`username: ${username} and password: ${password}`);

        const storedUserPassword = process.env[username];
        if (!storedUserPassword || storedUserPassword !== password) {
            return toAccessDenied();
        }

        return toSuccess('OK');
    } catch (err) {
        console.error(`Error in basicAuthorizer: ${JSON.stringify(err)}`);

        return toServerError();
    }
}
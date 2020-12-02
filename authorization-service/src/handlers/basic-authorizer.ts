import {APIGatewayTokenAuthorizerHandler} from 'aws-lambda';
import {EFFECT, UNAUTHORIZED} from '../constants';

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = (
    event, _context, callback,
) => {
    try {
        const authorizationToken = event.authorizationToken;

        if (!authorizationToken) {
            return callback(UNAUTHORIZED);
        }

        const encodedCreds = authorizationToken.split(' ')[1];
        const buff = Buffer.from(encodedCreds, 'base64');
        const [username, password] = buff.toString('utf-8').split(':')

        console.log(`username: ${username} and password: ${password}`);

        const storedUserPassword = process.env[username];
        const isAuthorized: boolean = storedUserPassword && storedUserPassword === password;
        const effect: EFFECT = isAuthorized ? EFFECT.ALLOW : EFFECT.DENY;

        return callback(null, getPolicy(username, effect, event.methodArn));
    } catch (err) {
        console.error(`Error in basicAuthorizer: ${JSON.stringify(err)}`);

        return callback(UNAUTHORIZED);
    }
}

const getPolicy = (principalId: string, effect: EFFECT, resource: string) => {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }]
        }
    };
}
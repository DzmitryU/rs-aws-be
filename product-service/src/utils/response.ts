import {
    StatusCodes,
} from 'http-status-codes';

export const toSuccess = (data) => ({
    statusCode: StatusCodes.OK,
    body: JSON.stringify({
        data,
    }, null, 2),
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
});
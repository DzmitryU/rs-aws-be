import {
    StatusCodes,
} from 'http-status-codes';

const addHeaderCORS = (response) => {
    response.headers = {
        ...response.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    }

    return response;
}

export const toSuccess = (data) => addHeaderCORS({
    statusCode: StatusCodes.OK,
    body: JSON.stringify(data, null, 2),
});

export const toNotFound = () => addHeaderCORS({
    statusCode: StatusCodes.NOT_FOUND,
});
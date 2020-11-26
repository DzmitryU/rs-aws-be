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
    body: typeof data === 'string' ? data : JSON.stringify(data),
});

export const toNotFound = () => addHeaderCORS({
    statusCode: StatusCodes.NOT_FOUND,
});

export const toServerError = () => addHeaderCORS({
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
});

export const toValidationError = () => addHeaderCORS({
    statusCode: StatusCodes.BAD_REQUEST,
    body: 'Invalid request data',
});

export const toAccept = () => addHeaderCORS({
    statusCode: StatusCodes.ACCEPTED,
});

export const toAccessDenied = () => addHeaderCORS({
    statusCode: StatusCodes.FORBIDDEN,
});

export const toUnauthorized = () => addHeaderCORS({
    statusCode: StatusCodes.UNAUTHORIZED,
});

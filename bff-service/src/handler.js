const { StatusCodes } = require('http-status-codes')
const axios = require('axios').default;

const cache = require('./cache');

const cacheRecipient = 'product';

const handler = async (req, res) => {
    console.log(req.originalUrl);
    const [url, recipient, params] = req.originalUrl.split('/');

    const recipientURL = process.env[recipient];
    console.log('recipientURL', recipientURL);

    if (!recipientURL) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Cannot process request' });
    }

    const config = {
        method: req.method,
        url: `${recipientURL}/${params ? params : ''}`
    };


    if (req.body && Object.keys(req.body).length > 0) {
        config.data = req.body;
        config.headers = {
            'Content-Type': 'application/json'
        }
    }

    console.log('config: ', config);

    try {
        const cacheData = cache.get();
        if (isCached(recipient, params, req.method) && cacheData) {
            console.log('Data was extracted from cache');

            return res.json(cacheData);
        }
        const response = await axios(config);
        console.log(`recipient response: ${response.status}`);

        if(isCached(recipient, params, req.method)) {
            cache.set(response.data);
            console.log('Cache was updated');
        }

        return res.json(response.data);
    } catch(error) {
        console.warn(`Unhandled error: ${JSON.stringify(error)}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error during request' });
    }

};

const isCached = (recipient, params, method) => {
    return (recipient === cacheRecipient) && (method === 'GET') && !params;
}


module.exports = {
    handler
}
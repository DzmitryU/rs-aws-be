const { StatusCodes } = require('http-status-codes')
const axios = require('axios').default;

const handler = async (req, res) => {
    console.log(req.originalUrl);
    const [url, recipient, params] = req.originalUrl.split('/');

    const recipientURL = process.env[recipient];
    console.log('recipientURL', recipientURL);

    if (!recipientURL) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ error: 'Cannot process request' });
    }

    const config = {
        method: req.method,
        url: `${recipientURL}/${params ? params : ''}`
    };

    console.log('config: ', config);

    try {
        const response = await axios(config);
        console.log(`recipient response: ${response.status}`);

        return res.json(response.data);
    } catch(error) {
        console.warn(`Unhandled error: ${JSON.stringify(error)}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error during request' });
    }

};

module.exports = {
    handler
}
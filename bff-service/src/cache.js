const cache = {
    data: null,
    lastRequest: 0,
}

const set = (data) => {
    cache.data = data;
    cache.lastRequest = Date.now();
}

const get = () => {
    if (Date.now() > cache.lastRequest + process.env.CACHE_TTL) {
        return null;
    }
    return cache.data
}

module.exports = {
    get,
    set,
}
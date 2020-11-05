import {get, getAll as getAllProducts} from './pg-client';

export const getAll = async () => {
    return getAllProducts();
}

export const getById = async (id) => {
    return get(id);
}
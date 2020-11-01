import {products} from './db';

export const getAll = async () => {
    return products;
}

export const getById = async (id) => {
    return products.find((product) => product.id === id);
}
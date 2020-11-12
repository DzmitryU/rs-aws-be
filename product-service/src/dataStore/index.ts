import {get, getAll as getAllProducts, insert} from './pg-client';
import {Product} from '../types/Product';

export const getAll = async (): Promise<Product[]> => {
    return getAllProducts();
}

export const getById = async (id: string): Promise<Product> => {
    return get(id);
}

export const create = async (product: Product): Promise<Product> => {
    return insert(product);
}
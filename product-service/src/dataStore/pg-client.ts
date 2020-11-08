'use strict';
import { Client } from 'pg';

import {Product} from '../types/Product';


const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false // to avoid warring in this example
    },
    connectionTimeoutMillis: 5000 // time in millisecond for termination of the database query
};

const productFields = 'id, title, description, price, count';

export const getAll = async (): Promise<Product[]> => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        const script = `select ${productFields} from products, stocks where id = product_id`;
        console.log(`Script for getAll: ${script}`);
        const { rows: products } = await client.query(script);

        return products;
    } catch (error) {
        console.error('Error during database getAll request executing:', error);
        throw  error;
    } finally {
        client.end();
    }
}

export const get = async (id): Promise<Product> => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        const script = `select ${productFields} from products, stocks where id = '${id}' and id = product_id`;
        console.log(`Script for get: ${script}`);
        const { rows: products } =
            await client.query(script);

        return products[0];
    } catch (error) {
        console.error('Error during database get request executing:', error);
        throw  error;
    } finally {
        client.end();
    }
}

export const insert = async (product: Product): Promise<Product> => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        await client.query('BEGIN');
        const productsScript =
            `insert into products (description, price, title) ` +
            `values ('${product.description}',${product.price},'${product.title}')` +
            `returning id`;
        console.log(`Script for insert products: ${productsScript}`)
        const { rows: products } = await client.query(productsScript);
        product.id = products[0].id;

        const stocksScript = `insert into stocks (product_id, count) values ('${products[0].id}',${product.count})`;
        console.log(`Script for insert stocks: ${stocksScript}`);
        await client.query(stocksScript);

        await client.query('COMMIT');
        return product;
    } catch (error) {
        console.error('Error during database insert request executing:', error);
        await client.query('ROLLBACK')
        throw  error;
    } finally {
        client.end();
    }
}
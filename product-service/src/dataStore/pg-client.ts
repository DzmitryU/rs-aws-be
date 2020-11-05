'use strict';
import {Product} from "../types/Product";

const { Client } = require('pg');

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


export const getAll = async (): Promise<Product[]> => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        const { rows: products } = await client.query(`select * from products, stocks where id = product_id`);

        return products;
    } catch (error) {
        console.error('Error during database request executing:', error);
        return [];
    } finally {
        client.end();
    }
}

export const get = async (id): Promise<Product> => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        const { rows: products } =
            await client.query(`select * from products, stocks where id = '${id}' and id = product_id`);

        return products[0];
    } catch (error) {
        console.error('Error during database request executing:', error);
        return null;
    } finally {
        client.end();
    }
}
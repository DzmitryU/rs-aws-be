import {Product} from "../types/Product";
import {productSchema} from "../handlers/schemas/product";
import {create} from "../dataStore";

export const createProduct = async (product: Product) => {
    const validationError = productSchema.validate(product).error;

    if (validationError) {
        console.warn(`service/products - Joi validation error: ${JSON.stringify(validationError)}`);
        throw validationError;
    }

    const savedProduct = await create(product);
    console.log(`service/products - savedProduct: ${JSON.stringify(savedProduct)}`);

    return savedProduct;
}
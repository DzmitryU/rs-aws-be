import Joi from 'joi';

export const productSchema = Joi.object({
    count: Joi.number().min(0).integer().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    title: Joi.string().required()
})
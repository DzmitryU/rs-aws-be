import Joi from 'joi';

export const idSchema = Joi.string().guid({version: 'uuidv4'});
import joi from "joi"

export const paymentSchema = joi.object({
  password: joi
    .string()
    .length(4)
    .pattern(/^[0-9]+$/)
    .required(),
  businessId: joi.number().integer().required(),
  amount: joi.number().integer().greater(0).required(),
})

import joi from "joi"

export const activateSchema = joi.object({
  cvc: joi
    .string()
    .length(3)
    .pattern(/^[0-9]+$/)
    .required(),
  password: joi
    .string()
    .length(4)
    .pattern(/^[0-9]+$/)
    .required(),
})

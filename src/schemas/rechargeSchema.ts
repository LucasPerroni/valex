import joi from "joi"

export const rechargeSchema = joi.object({
  amount: joi.number().integer().greater(0).required(),
})

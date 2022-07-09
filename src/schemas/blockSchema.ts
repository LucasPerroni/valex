import joi from "joi"

export const blockSchema = joi.object({
  password: joi
    .string()
    .length(4)
    .pattern(/^[0-9]+$/)
    .required(),
})

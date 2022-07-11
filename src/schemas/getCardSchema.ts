import joi from "joi"

export const getCardSchema = joi.object({
  employeeId: joi.number().integer().required(),
  cards: joi
    .array()
    .unique()
    .items(
      joi
        .object({
          number: joi.string().required(),
          expirationDate: joi
            .string()
            .pattern(/^[0-9]{2}\/[0-9]{2}$/)
            .required(),
          password: joi
            .string()
            .length(4)
            .pattern(/^[0-9]+$/)
            .required(),
        })
        .required()
    )
    .required(),
})

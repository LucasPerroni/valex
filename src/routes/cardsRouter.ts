import { Router } from "express"

import { createCard } from "../controllers/cardsController.js"
import validateSchema from "../middlewares/validateSchema.js"
import { cardSchema } from "../schemas/cardSchema.js"

const cardsRouter = Router()

cardsRouter.post("/cards/creation", validateSchema(cardSchema), createCard)

export default cardsRouter

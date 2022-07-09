import { Router } from "express"

import { activateCard, blockCard, createCard } from "../controllers/cardsController.js"
import checkAPIKey from "../middlewares/checkAPIKey.js"
import validateSchema from "../middlewares/validateSchema.js"
import { activateSchema } from "../schemas/activateSchema.js"
import { blockSchema } from "../schemas/blockSchema.js"
import { cardSchema } from "../schemas/cardSchema.js"

const cardsRouter = Router()

cardsRouter.post("/cards/creation", validateSchema(cardSchema), checkAPIKey, createCard)
cardsRouter.post("/cards/activate/:id", validateSchema(activateSchema), activateCard)
cardsRouter.post("/cards/block/:id", validateSchema(blockSchema), blockCard)

export default cardsRouter

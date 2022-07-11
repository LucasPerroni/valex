import { Router } from "express"

import {
  activateCard,
  blockCard,
  cardInfo,
  cardLog,
  createCard,
  unblockCard,
} from "../controllers/cardsController.js"
import checkAPIKey from "../middlewares/checkAPIKey.js"
import validateSchema from "../middlewares/validateSchema.js"
import { activateSchema } from "../schemas/activateSchema.js"
import { blockSchema } from "../schemas/blockSchema.js"
import { cardSchema } from "../schemas/cardSchema.js"
import { getCardSchema } from "../schemas/getCardSchema.js"

const cardsRouter = Router()

cardsRouter.post("/cards/creation", validateSchema(cardSchema), checkAPIKey, createCard)
cardsRouter.put("/cards/activate/:id", validateSchema(activateSchema), activateCard)
cardsRouter.put("/cards/block/:id", validateSchema(blockSchema), blockCard)
cardsRouter.put("/cards/unblock/:id", validateSchema(blockSchema), unblockCard)
cardsRouter.get("/cards/log/:id", cardLog)
cardsRouter.post("/cards", validateSchema(getCardSchema), cardInfo)

export default cardsRouter

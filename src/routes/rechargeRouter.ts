import { Router } from "express"

import { rechargeCard } from "../controllers/rechargeController.js"
import checkAPIKey from "../middlewares/checkAPIKey.js"
import validateSchema from "../middlewares/validateSchema.js"
import { rechargeSchema } from "../schemas/rechargeSchema.js"

const rechargeRouter = Router()

rechargeRouter.post("/recharge/:id", validateSchema(rechargeSchema), checkAPIKey, rechargeCard)

export default rechargeRouter

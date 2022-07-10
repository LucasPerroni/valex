import { Router } from "express"

import { createPayment } from "../controllers/paymentController.js"
import validateSchema from "../middlewares/validateSchema.js"
import { paymentSchema } from "../schemas/paymentSchema.js"

const paymentRouter = Router()

paymentRouter.post("/payment/:id", validateSchema(paymentSchema), createPayment)

export default paymentRouter

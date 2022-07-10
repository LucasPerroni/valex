import { Router } from "express"

import cardsRouter from "./cardsRouter.js"
import rechargeRouter from "./rechargeRouter.js"
import paymentRouter from "./paymentRouter.js"

const routes = Router()

routes.use(cardsRouter)
routes.use(rechargeRouter)
routes.use(paymentRouter)

export default routes

import { Router } from "express"

import cardsRouter from "./cardsRouter.js"
import rechargeRouter from "./rechargeRouter.js"
import shopRouter from "./shopRouter.js"

const routes = Router()

routes.use(cardsRouter)
routes.use(rechargeRouter)
routes.use(shopRouter)

export default routes

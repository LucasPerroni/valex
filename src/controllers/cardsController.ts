import { Request, Response } from "express"
import dotenv from "dotenv"

import { findByTypeAndEmployeeId, insert } from "../repositories/cardRepository.js"
import { errorForbidden } from "../middlewares/errorHandler.js"
import createCardData, { getCompanyAndEmployee } from "../services/cardsServices.js"
import formatName from "../utils/formatName.js"

dotenv.config()

export async function createCard(req: Request, res: Response) {
  const apiKey = String(req.headers["x-api-key"])
  if (!apiKey || apiKey === "undefined") {
    errorForbidden("Missing API-Key")
  }

  const { number, securityCode, expirationDate } = createCardData()
  const { company, employee } = await getCompanyAndEmployee(apiKey, req.body.employeeId)
  formatName(employee)

  const cardData = {
    number,
    securityCode,
    expirationDate,
    employeeId: employee.id,
    cardholderName: employee.fullName,
    isVirtual: false,
    isBlocked: true,
    type: req.body.type,
  }

  const existentCard = await findByTypeAndEmployeeId(req.body.type, employee.id)
  if (existentCard) {
    errorForbidden("This employee already have a card of this type")
  }

  await insert(cardData)
  res.sendStatus(201)
}

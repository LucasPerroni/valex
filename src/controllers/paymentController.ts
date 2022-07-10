import { Request, Response } from "express"
import { errorUnauthorized } from "../middlewares/errorHandler.js"
import { insert } from "../repositories/paymentRepository.js"

import { checkCardInfo, getCardById } from "../services/cardsServices.js"
import { getBusinessById, getCardBalance } from "../services/paymentServices.js"

export async function createPayment(req: Request, res: Response) {
  const { id } = req.params
  const { password, businessId, amount }: { password: string; businessId: number; amount: number } = req.body

  const card = await getCardById(id)
  checkCardInfo(card, false, password)
  const business = await getBusinessById(businessId, card.type)
  const balance = await getCardBalance(card, true)

  if (balance < amount) {
    errorUnauthorized("The amount to be paid is greater than the card balance")
  }

  const paymentInfo = {
    businessId,
    amount,
    cardId: Number(id),
  }

  insert(paymentInfo)
  res.sendStatus(201)
}

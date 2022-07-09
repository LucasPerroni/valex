import { Request, Response } from "express"

import { insert } from "../repositories/rechargeRepository.js"
import { checkCardInfo, getCardById } from "../services/cardsServices.js"
import { checkCardCompany } from "../services/rechargeServices.js"

export async function rechargeCard(req: Request, res: Response) {
  const { id } = req.params
  const { apiKey } = res.locals

  const card = await getCardById(id)
  checkCardInfo(card, false, null, false)
  checkCardCompany(apiKey, card)

  const rechargeData = {
    cardId: Number(id),
    amount: req.body.amount,
  }

  await insert(rechargeData)
  res.sendStatus(200)
}

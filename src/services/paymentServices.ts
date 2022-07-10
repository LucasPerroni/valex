import { errorNotFound, errorUnauthorized } from "../middlewares/errorHandler.js"
import { findById } from "../repositories/businessRepository.js"
import { Card } from "../repositories/cardRepository.js"
import { findByCardId as paymentLog } from "../repositories/paymentRepository.js"
import { findByCardId as rechargeLog } from "../repositories/rechargeRepository.js"

export async function getCardBalance(card: Card, mustBePositive: boolean = false) {
  const recharges = await rechargeLog(card.id)
  const payments = await paymentLog(card.id)

  let balance = 0
  recharges.forEach((r) => (balance += r.amount))
  payments.forEach((p) => (balance -= p.amount))

  if (mustBePositive && balance < 0) {
    errorUnauthorized("This card has negative balance")
  }

  return balance
}

export async function getBusinessById(id: number, type: string = null) {
  const business = await findById(id)

  if (!business) {
    errorNotFound("Couldn't find a business with that id")
  } else if (type && business.type !== type) {
    errorUnauthorized(`This business isn't allowed to do "${type}" transactions`)
  }

  return business
}

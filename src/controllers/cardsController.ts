import { Request, Response } from "express"
import dotenv from "dotenv"
import bcrypt from "bcrypt"

import { findByTypeAndEmployeeId, insert, update } from "../repositories/cardRepository.js"
import { errorConflict } from "../middlewares/errorHandler.js"
import createCardData, {
  checkCardInfo,
  checkCVC,
  getCardById,
  getCardByNumber,
  getCompany,
  getEmployee,
} from "../services/cardsServices.js"
import formatName from "../utils/formatName.js"
import { getCardBalance } from "../services/paymentServices.js"

dotenv.config()

export async function createCard(req: Request, res: Response) {
  const { apiKey } = res.locals

  const { number, securityCode, expirationDate } = createCardData()
  const company = await getCompany(apiKey)
  const employee = await getEmployee(req.body.employeeId, company.id)
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
    errorConflict("This employee already have a card of this type")
  }

  await insert(cardData)
  res.sendStatus(201)
}

export async function activateCard(req: Request, res: Response) {
  const { id } = req.params
  const { cvc, password }: { cvc: string; password: string } = req.body

  const card = await getCardById(id)
  checkCVC(card, cvc)
  checkCardInfo(card, true)

  const updateInfo = {
    password: bcrypt.hashSync(password, Number(process.env.BCRYPT_SALT)),
    isBlocked: false,
  }

  await update(Number(id), updateInfo)
  res.sendStatus(200)
}

export async function blockCard(req: Request, res: Response) {
  const { id } = req.params
  const { password }: { password: string } = req.body

  const card = await getCardById(id)
  checkCardInfo(card, false, password)

  const updateInfo = {
    isBlocked: true,
  }

  await update(Number(id), updateInfo)
  res.sendStatus(200)
}

export async function unblockCard(req: Request, res: Response) {
  const { id } = req.params
  const { password }: { password: string } = req.body

  const card = await getCardById(id)
  checkCardInfo(card, true, password)

  const updateInfo = {
    isBlocked: false,
  }

  await update(Number(id), updateInfo)
  res.sendStatus(200)
}

export async function cardLog(req: Request, res: Response) {
  const { id } = req.params

  const card = await getCardById(id)
  const log = await getCardBalance(card)

  res.status(200).send(log)
}

export async function cardInfo(req: Request, res: Response) {
  const cardArray = []
  const {
    employeeId,
    cards,
  }: { employeeId: number; cards: [{ number: string; expirationDate: string; password: string }] } = req.body

  const employee = await getEmployee(employeeId)
  formatName(employee)

  for (let i = 0; i < cards.length; i++) {
    const card = await getCardByNumber(
      cards[i].number,
      cards[i].expirationDate,
      employee.fullName,
      cards[i].password,
      false
    )

    if (card) {
      cardArray.push(card)
    }
  }

  res.status(200).send({ cards: cardArray })
}

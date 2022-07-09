import { Request, Response } from "express"
import dotenv from "dotenv"
import bcrypt from "bcrypt"

import { findByTypeAndEmployeeId, insert, update } from "../repositories/cardRepository.js"
import { errorConflict } from "../middlewares/errorHandler.js"
import createCardData, {
  checkCardInfo,
  checkCVC,
  getCardById,
  getCompanyAndEmployee,
} from "../services/cardsServices.js"
import formatName from "../utils/formatName.js"

dotenv.config()

export async function createCard(req: Request, res: Response) {
  const { apiKey } = res.locals

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

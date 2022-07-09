import { faker } from "@faker-js/faker"
import dayjs from "dayjs"
import dotenv from "dotenv"
import Cryptr from "cryptr"
import bcrypt from "bcrypt"

import {
  errorConflict,
  errorForbidden,
  errorNotFound,
  errorUnprocessable,
} from "../middlewares/errorHandler.js"
import { findByApiKey } from "../repositories/companyRepository.js"
import { findById } from "../repositories/employeeRepository.js"
import { Card, findById as findCardById, update } from "../repositories/cardRepository.js"

dotenv.config()

export async function getCompanyAndEmployee(apiKey: string, employeeId: number) {
  const company = await findByApiKey(apiKey)
  const employee = await findById(employeeId)

  if (!company || !employee) {
    errorNotFound("Company or Employee not found")
  } else if (employee.companyId !== company.id) {
    errorForbidden("This employee isn't in this company")
  }

  return { company, employee }
}

export default function createCardData() {
  const cryptr = new Cryptr(process.env.CRYPTR_KEY)

  const number = faker.finance.creditCardNumber("visa")
  const securityCode = faker.finance.creditCardCVV()
  const cryptSecurityCode = cryptr.encrypt(securityCode)
  const expirationDate = dayjs().add(5, "y").format("MM/YY")

  return { number, securityCode: cryptSecurityCode, expirationDate }
}

export async function getCardById(id: string) {
  if (!Number(id)) {
    errorUnprocessable("Card Id must be a number")
  }

  const card = await findCardById(Number(id))
  if (!card) {
    errorNotFound("Couldn't find a card with that id")
  }

  return card
}

export function checkCVC(card: Card, cvc: string) {
  const cryptr = new Cryptr(process.env.CRYPTR_KEY)

  if (cryptr.decrypt(card.securityCode) !== cvc) {
    errorForbidden("Wrong CVC")
  }
}

export function checkCardInfo(
  card: Card,
  isBlockMustBe: boolean,
  password: string = null,
  blockMissingPassword: boolean = true
) {
  const today = dayjs().format("MM/YY").split("/")
  const expirationDate = card.expirationDate.split("/")
  if (
    Number(expirationDate[1]) < Number(today[1]) ||
    (Number(expirationDate[1]) === Number(today[1]) && Number(expirationDate[0]) < Number(today[0]))
  ) {
    errorForbidden("This card expired")
  }

  if (isBlockMustBe && !card.isBlocked) {
    errorConflict("This card is activated")
  } else if (!isBlockMustBe && card.isBlocked) {
    errorConflict("This card is blocked")
  }

  if (password && !card.password) {
    errorUnprocessable("This card doesn't have a password")
  } else if (password && !bcrypt.compareSync(password, card.password)) {
    errorForbidden("Wrong password")
  } else if (!password && card.password && blockMissingPassword) {
    errorForbidden("This card has a password")
  }
}

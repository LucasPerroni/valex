import { faker } from "@faker-js/faker"
import dayjs from "dayjs"
import dotenv from "dotenv"
import Cryptr from "cryptr"

import { errorForbidden, errorNotFound } from "../middlewares/errorHandler.js"
import { findByApiKey } from "../repositories/companyRepository.js"
import { findById } from "../repositories/employeeRepository.js"

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

import { errorForbidden } from "../middlewares/errorHandler.js"
import { Card } from "../repositories/cardRepository.js"
import { findByApiKey } from "../repositories/companyRepository.js"
import { findById } from "../repositories/employeeRepository.js"

export async function checkCardCompany(apiKey: string, card: Card) {
  const company = await findByApiKey(apiKey)
  const employee = await findById(card.employeeId)

  if (company.id !== employee.companyId) {
    errorForbidden("This card isn't from this company")
  }
}

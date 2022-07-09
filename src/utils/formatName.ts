import { Employee } from "../repositories/employeeRepository.js"

export default function formatName(employee: Employee) {
  const nameSplit = employee.fullName.split(" ")
  if (nameSplit.length > 2) {
    for (let i = 1; i < nameSplit.length - 1; i++) {
      if (nameSplit[i][0] === nameSplit[i][0].toUpperCase()) {
        nameSplit[i] = nameSplit[i][0]
      } else {
        nameSplit.splice(i, 1)
        i--
      }
    }
  }
  employee.fullName = nameSplit.join(" ").toUpperCase()
}

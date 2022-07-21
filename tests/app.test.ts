import supertest from "supertest"

import app from "../src/app.js"
import { connection } from "../database/db.js"

beforeEach(async () => {
  await connection.query(`DELETE FROM cards`)
})

afterAll(async () => {
  await connection.query(`DELETE FROM cards`)
  await connection.end()
})

describe("POST /card/creation", () => {
  it("create a card with 201", async () => {
    const data = {
      employeeId: 1,
      type: "groceries",
    }

    const response = await supertest(app)
      .post("/cards/creation")
      .send(data)
      .set("X-API-Key", "zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0")
    const { rows } = await connection.query(`select * from cards where "employeeId" = 1`)

    expect(response.status).toBe(201)
    expect(rows[0]).not.toBeUndefined()
  })

  it("return 403 without x-api-key", async () => {
    const data = {
      employeeId: 1,
      type: "groceries",
    }

    const response = await supertest(app).post("/cards/creation").send(data)
    const { rows } = await connection.query(`select * from cards where "employeeId" = 1`)

    expect(response.status).toBe(403)
    expect(rows[0]).toBeUndefined()
  })

  it("return 422 with nonexistent 'type'", async () => {
    const data = {
      employeeId: 1,
      type: "wrongtype",
    }

    const response = await supertest(app)
      .post("/cards/creation")
      .send(data)
      .set("X-API-Key", "zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0")
    const { rows } = await connection.query(`select * from cards where "employeeId" = 1`)

    expect(response.status).toBe(422)
    expect(rows[0]).toBeUndefined()
  })

  it("return 422 with wrong data", async () => {
    const data = {}

    const response = await supertest(app)
      .post("/cards/creation")
      .send(data)
      .set("X-API-Key", "zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0")
    const { rows } = await connection.query(`select * from cards where "employeeId" = 1`)

    expect(response.status).toBe(422)
    expect(rows[0]).toBeUndefined()
  })
})

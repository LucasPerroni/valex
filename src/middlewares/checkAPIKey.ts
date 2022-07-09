import { Request, Response, NextFunction } from "express"

import { errorForbidden } from "./errorHandler.js"

export default function checkAPIKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = String(req.headers["x-api-key"])
  if (!apiKey || apiKey === "undefined") {
    errorForbidden("Missing API-Key")
  }

  res.locals.apiKey = apiKey
  next()
}

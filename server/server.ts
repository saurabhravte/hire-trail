import "dotenv/config"
import type { Server } from "node:http"
import app from "./src/app.js"
import { closeDB, connectDB } from "./src/common/db/index.js"


const PORT: number = Number(process.env.PORT) || 5000

const start = async (): Promise<void> => {
  // connect to database
  await connectDB()

  const server: Server = app.listen(PORT, () => {
    console.log(`Server is running at ${PORT} in ${process.env.NODE_ENV} mode`)
  })

  // graceful shutdown
  const shutdown = (): void => {
    server.close(async () => {
      await closeDB()
      process.exit(0)
    })
  }

  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)
  process.on("unhandledRejection", (reason) => console.error("Unhandled rejection", reason))
}

start().catch((err) => {
  console.error("Failed to start server", err)
  process.exit(1)
})
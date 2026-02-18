import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'

config({ path: '.env' })

export default defineConfig({
  schema: './server/database/schema',
  out: './server/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})

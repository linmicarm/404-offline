import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrate: {
    async adapter(env) {
      const { Pool } = await import("pg");
      const pool = new Pool({
        connectionString: env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      });
      return new PrismaPg(pool);
    },
  },
});
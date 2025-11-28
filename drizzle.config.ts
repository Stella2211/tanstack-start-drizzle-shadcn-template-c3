import { type Config, defineConfig } from "drizzle-kit"

const baseConfig = {
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
} satisfies Partial<Config>

// ローカルD1（SQLiteファイル）に接続する設定
function getLocalConfig(): Config {
  const localDbPath = process.env.LOCAL_DB_PATH
  if (!localDbPath) {
    throw new Error("LOCAL_DB_PATH is not set")
  }
  return {
    ...baseConfig,
    dialect: "sqlite",
    dbCredentials: {
      url: localDbPath,
    },
  }
}

// 本番D1（HTTP API）に接続する設定
function getRemoteConfig(): Config {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID
  const token = process.env.CLOUDFLARE_D1_TOKEN

  if (!accountId || !databaseId || !token) {
    throw new Error(
      "CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, CLOUDFLARE_D1_TOKEN are required for remote D1",
    )
  }

  return {
    ...baseConfig,
    dialect: "sqlite",
    driver: "d1-http",
    dbCredentials: {
      accountId,
      databaseId,
      token,
    },
  }
}

// LOCAL_DB_PATHが設定されていればローカル、なければリモート
export default defineConfig(process.env.LOCAL_DB_PATH ? getLocalConfig() : getRemoteConfig())

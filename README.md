# Tanstack Start + Drizzle + Shadcn Template
これは、Tanstack Start、Drizzle ORM、およびShadcn UIコンポーネントライブラリを組み合わせたテンプレートプロジェクトです。このテンプレートは、モダンなフルスタックWebアプリケーションの開発を迅速に開始するための基盤を提供します。
## 特徴
- **Tanstack Start**: 高性能なデータフェッチングと状態管理を提供するTanstack Startを使用しています。
- **Drizzle ORM**: 型安全で使いやすいORMであるDrizzleを採用し、データベース操作を簡素化します。
- **Shadcn UI**: 美しいUIコンポーネントライブラリであるShadcnを利用して、迅速に魅力的なユーザーインターフェースを構築します。
- **tsgo**: 型チェックには[tsgo](https://github.com/microsoft/typescript-go)を採用。従来のtscと比較して約10倍高速です。
- **Biome**: リンターとフォーマッターとして[Biome](https://biomejs.dev/)を採用。ESLint + Prettierの代替として高速に動作します。
## セットアップ手順
1. リポジトリをクローンします。
```bash
git clone git@github.com:Stella2211/tanstack-start-drizzle-shadcn-template-c3.git
cd tanstack-start-drizzle-shadcn-template-c3
```
2. 依存関係をインストールします。
```bash
bun install
```

3. ローカルD1データベースをセットアップします。
```bash
bun run db:migrate:local
```

4. 開発サーバーを起動します。
```bash
bun run dev
```

## データベースセットアップ (Cloudflare D1 + Drizzle ORM)

このテンプレートはCloudflare D1をデータベースとして使用し、Drizzle ORMで操作します。

### ローカル開発

ローカル開発では、Wranglerが自動的にローカルD1インスタンスを作成します。

```bash
# マイグレーションをローカルD1に適用
bun run db:migrate:local

# 開発サーバー起動
bun run dev
```

### スキーマの変更

1. `src/db/schema.ts` でスキーマを編集
2. マイグレーションを生成:
```bash
bun run db:generate
```
3. マイグレーションを適用:
```bash
bun run db:migrate:local
```

### 本番環境へのデプロイ

1. Cloudflare D1データベースを作成:
```bash
wrangler d1 create tanstack-start-db
```

2. 出力された`database_id`を`wrangler.jsonc`に設定:
```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "tanstack-start-db",
    "database_id": "<your-database-id>",  // ここを更新
    "migrations_dir": "drizzle/migrations"
  }
]
```

3. 本番D1にマイグレーションを適用:
```bash
bun run db:migrate:remote
```

4. デプロイ:
```bash
bun run deploy
```

### サーバー関数でのDB使用例

```typescript
import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'
import { createDb, schema } from '@/db'

const getUsers = createServerFn({
  method: 'GET',
}).handler(async () => {
  const db = createDb(env.DB)
  return await db.select().from(schema.users)
})
```

### Drizzle Studio

Drizzle Studioを使ってデータベースの内容をGUIで確認・編集できます。

**ローカルD1に接続:**
```bash
# 開発サーバーを一度起動してローカルD1を初期化してから実行
bun run db:studio:local
```

**本番D1に接続:**

環境変数を設定してから実行します:
```bash
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
export CLOUDFLARE_D1_DATABASE_ID="your-database-id"
export CLOUDFLARE_D1_TOKEN="your-api-token"
bun run db:studio:remote
```

環境変数の取得方法:
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflareダッシュボード → Workers & Pages → 右サイドバーの「Account ID」
- `CLOUDFLARE_D1_DATABASE_ID`: D1データベースページの「Database ID」
- `CLOUDFLARE_D1_TOKEN`: My Profile → API Tokens → 「D1 Edit」権限を持つトークンを作成

### 利用可能なスクリプト

| スクリプト | 説明 |
|-----------|------|
| `bun run check` | tsgoで型チェックを実行 |
| `bun run biome:check` | Biomeでコードのリント・フォーマットを自動修正 |
| `bun run db:generate` | スキーマからマイグレーションを生成 |
| `bun run db:migrate:local` | ローカルD1にマイグレーションを適用 |
| `bun run db:migrate:remote` | 本番D1にマイグレーションを適用 |
| `bun run db:studio:local` | ローカルD1でDrizzle Studioを起動 |
| `bun run db:studio:remote` | 本番D1でDrizzle Studioを起動（環境変数必要） |
| `bun run cf-typegen` | Cloudflare型定義を再生成 |
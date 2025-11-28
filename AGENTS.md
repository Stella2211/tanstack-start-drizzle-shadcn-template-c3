# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開発コマンド

```bash
# 開発サーバー起動（ポート3000、マイグレーション自動適用）
bun run dev

# 型チェック（tsgo使用 - tscより約10倍高速）
bun run check

# リント・フォーマット（Biome使用）
bun run biome:check

# テスト実行
bun run test

# ビルド
bun run build

# Cloudflare Workersへデプロイ
bun run deploy
```

### データベース操作

```bash
# スキーマからマイグレーション生成
bun run db:generate

# ローカルD1にマイグレーション適用
bun run db:migrate:local

# 本番D1にマイグレーション適用
bun run db:migrate:remote

# Drizzle Studio（ローカル）
bun run db:studio:local

# Drizzle Studio（本番 - 環境変数必要）
source .env && bun run db:studio:remote
```

## アーキテクチャ

### 技術スタック
- **フレームワーク**: TanStack Start（React + SSR）
- **ルーティング**: TanStack Router（ファイルベース）
- **データベース**: Cloudflare D1 + Drizzle ORM
- **UI**: Shadcn UIコンポーネント
- **スタイリング**: Tailwind CSS v4
- **ホスティング**: Cloudflare Workers

### ディレクトリ構成

```
src/
├── routes/          # TanStack Routerのファイルベースルーティング
│   ├── __root.tsx   # ルートレイアウト（Header、DevTools）
│   └── index.tsx    # トップページ
├── components/
│   └── ui/          # Shadcn UIコンポーネント（自動生成、Biome対象外）
├── db/
│   ├── schema.ts    # Drizzleスキーマ定義
│   └── index.ts     # DB接続ヘルパー（createDb関数）
├── lib/
│   └── utils.ts     # ユーティリティ（cn関数など）
└── hooks/           # カスタムフック

drizzle/migrations/  # D1マイグレーションファイル
```

### パスエイリアス
- `@/` → `src/` （例: `import { Button } from "@/components/ui/button"`）

### サーバー関数でのDB使用

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

## 注意事項

- `src/routeTree.gen.ts`は自動生成ファイル（編集不可）
- `src/components/ui/`はShadcnが生成（Biomeの対象外）
- 本番デプロイ前に`wrangler.jsonc`の`database_id`を実際の値に更新
- Cloudflare型定義の再生成: `bun run cf-typegen`
- これはテンプレートリポジトリです。プロジェクトに合わせて適宜修正してください。
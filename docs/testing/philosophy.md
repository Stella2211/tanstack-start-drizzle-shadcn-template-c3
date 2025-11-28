# テスト哲学とパターン

このドキュメントでは、プロジェクトのテスト哲学と推奨されるテストパターンを説明します。

## テスト哲学

このプロジェクトでは、**副作用の少ないテストのみを作成する**という原則を採用しています。

### 基本原則

1. **開発環境に永続的な影響を与えない**
2. **テストごとに独立した環境を確保**
3. **外部サービスへの実際のリクエストを避ける**
4. **保守コストが高すぎるテストは削除**

---

## 禁止されている操作

### ❌ 開発用DBの完全リセットや削除

**問題**: 開発中のデータがすべて失われる

**悪い例**:
```typescript
beforeAll(async () => {
  await resetDatabase() // 開発環境に影響を与える可能性
})
```

**良い例**:
```typescript
beforeEach(async () => {
  const db = drizzle(env.policy_detective_db, { schema })
  await db.delete(schema.users) // テーブルのデータのみ削除
})
```

---

### ❌ 開発用ストレージ（R2バケットなど）の削除

**問題**: 画像などのアセットが失われる

**解決策**: テスト環境とストレージを分離（現状、R2の分離が困難なため、複雑なテストは削除済み）

---

### ❌ 開発環境に永続的な影響を与える操作

**問題**: テスト実行後、開発環境が壊れる

**良い例**:
- 各テストの`beforeEach`でデータを削除
- テスト実行後は自動的にクリーンアップ

---

### ❌ 外部サービスへの実際のリクエスト

**問題**: 外部サービスの制限やコストが発生

**例**: Discord Webhook、Gemini API

**解決策**:
- テスト用の環境変数やモックで外部サービスをスキップ
- 認証テスト用のヘルパー関数を使用

---

## 推奨されるテストパターン

### ✅ 各テストでデータをクリーンアップ

```typescript
import { beforeEach, describe, expect, it } from "vitest"
import { drizzle } from "drizzle-orm/d1"
import { SELF } from "cloudflare:test"
import * as schema from "../db/schema"

describe("users API", () => {
  beforeEach(async () => {
    const env = (await SELF.fetch("http://localhost")).env
    const db = drizzle(env.policy_detective_db, { schema })
    await db.delete(schema.users) // テーブルのデータのみ削除
  })

  it("should return all users", async () => {
    const response = await SELF.fetch("http://localhost/users")
    expect(response.status).toBe(200)
    // ... アサーション
  })
})
```

---

### ✅ テスト用の環境変数やモックで外部サービスをスキップ

```typescript
// テスト用のモック関数
vi.mock("../lib/auth-code", () => ({
  sendDiscordWebhook: vi.fn(), // Discord Webhookをモック
}))
```

---

### ✅ テスト実行後は自動的にクリーンアップ

```typescript
afterEach(async () => {
  // 必要に応じてクリーンアップ
})
```

---

### ✅ テストごとに独立した環境を確保

```typescript
describe("chat test", () => {
  it("should create a chat", async () => {
    // このテストは他のテストに影響しない
  })

  it("should finish a chat", async () => {
    // このテストも独立している
  })
})
```

---


## テストの削除基準

以下のような特徴を持つテストは削除すべきです：

1. **実装が過度に複雑で保守コストが高い**
   - テストの保守に多くの時間がかかる
   - テストの価値が保守コストを下回る

2. **外部サービスへの依存が強い**
   - Discord Webhook、Gemini API、R2ストレージなど
   - モック化が困難

3. **テスト環境の分離が困難**
   - R2ストレージの分離が困難（現状）
   - 開発環境に副作用を与えるリスクがある

4. **開発環境に副作用を与えるリスクがある**
   - データベース全体のリセット
   - ストレージの削除

5. **テストの価値が低い**
   - ほぼ同じテストが他にある
   - 実装の変更に強く依存している

### テストファイルの配置

- テストファイルは`src/tests/`ディレクトリに配置
- 命名規則: `*.test.ts` または `*.test.tsx`
- 例: `src/routes/users.ts` → `src/tests/users.test.ts`

## まとめ

- **副作用の少ないテストのみを作成**
- **開発環境に影響を与えない**
- **外部サービスへの実際のリクエストを避ける**
- **保守コストが高すぎるテストは削除**

これらの原則に従うことで、安全かつ効率的なテストを実現します。

#!/usr/bin/env bun

/**
 * AGENTS.mdとCLAUDE.mdを同期するスクリプト
 * 最終更新日時が新しい方で古い方を上書きする
 */

import { copyFileSync, existsSync, statSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const CLAUDE_MD = resolve(__dirname, "../CLAUDE.md")
const AGENTS_MD = resolve(__dirname, "../AGENTS.md")

function syncDocs() {
  // 両方のファイルが存在するか確認
  if (!existsSync(CLAUDE_MD)) {
    console.error("❌ CLAUDE.md が見つかりません")
    process.exit(1)
  }

  if (!existsSync(AGENTS_MD)) {
    console.log("⚠️  AGENTS.md が見つかりません。CLAUDE.md からコピーします。")
    copyFileSync(CLAUDE_MD, AGENTS_MD)
    console.log("✅ AGENTS.md を作成しました")
    return
  }

  // 最終更新日時を取得
  const claudeStat = statSync(CLAUDE_MD)
  const agentsStat = statSync(AGENTS_MD)

  const claudeTime = claudeStat.mtimeMs
  const agentsTime = agentsStat.mtimeMs

  // 更新日時を比較
  if (claudeTime > agentsTime) {
    console.log(
      `📝 CLAUDE.md (${new Date(claudeTime).toISOString()}) が新しいため、AGENTS.md を上書きします`,
    )
    copyFileSync(CLAUDE_MD, AGENTS_MD)
    console.log("✅ AGENTS.md を更新しました")
  } else if (agentsTime > claudeTime) {
    console.log(
      `📝 AGENTS.md (${new Date(agentsTime).toISOString()}) が新しいため、CLAUDE.md を上書きします`,
    )
    copyFileSync(AGENTS_MD, CLAUDE_MD)
    console.log("✅ CLAUDE.md を更新しました")
  } else {
    console.log("✅ AGENTS.md と CLAUDE.md は既に同期されています")
  }
}

syncDocs()

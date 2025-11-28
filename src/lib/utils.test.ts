import { describe, expect, it } from "vitest"
import { cn } from "./utils"

describe("cn", () => {
  it("空の入力で空文字列を返す", () => {
    expect(cn()).toBe("")
  })

  it("単一のクラス名を返す", () => {
    expect(cn("foo")).toBe("foo")
  })

  it("複数のクラス名を結合する", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("条件付きクラス名を処理する", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz")
    expect(cn("foo", true && "bar", "baz")).toBe("foo bar baz")
  })

  it("Tailwindのクラスを正しくマージする", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
  })

  it("オブジェクト形式のクラス名を処理する", () => {
    expect(cn({ foo: true, bar: false })).toBe("foo")
  })

  it("配列形式のクラス名を処理する", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar")
  })

  it("undefined と null を無視する", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar")
  })
})

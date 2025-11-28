import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Button } from "./button"

describe("Button", () => {
  it("テキストを正しくレンダリングする", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument()
  })

  it("クリックイベントを発火する", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole("button"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("disabled状態でクリックできない", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>
    )

    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it("variant propでスタイルを変更できる", () => {
    const { rerender } = render(<Button variant="default">Default</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-primary")

    rerender(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-destructive")

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole("button")).toHaveClass("border")

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole("button")).toHaveClass("hover:bg-accent")
  })

  it("size propでサイズを変更できる", () => {
    const { rerender } = render(<Button size="default">Default</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-9")

    rerender(<Button size="sm">Small</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-8")

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-10")

    rerender(<Button size="icon">Icon</Button>)
    expect(screen.getByRole("button")).toHaveClass("size-9")
  })

  it("asChild propでSlotとしてレンダリングする", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    const link = screen.getByRole("link", { name: "Link Button" })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/test")
  })

  it("追加のclassNameを適用する", () => {
    render(<Button className="custom-class">Button</Button>)
    expect(screen.getByRole("button")).toHaveClass("custom-class")
  })

  it("data-slot属性を持つ", () => {
    render(<Button>Button</Button>)
    expect(screen.getByRole("button")).toHaveAttribute("data-slot", "button")
  })
})

import { expect, test } from "@playwright/test";

test("scroll animations survive deep-link reloads and responsive reinitialization", async ({ page }) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 960 });

  for (const id of ["systems", "contact"]) {
    await page.goto(`/#${id}`);
    await expect(page.locator("html")).toHaveClass(/gsap-smooth/);
    await expect.poll(() => page.locator(`#${id}`).evaluate(el => {
      const rect = el.getBoundingClientRect();
      const expected = el.id === "contact" ? Math.max(94, innerHeight - rect.height) : 94;
      return Math.abs(rect.top - expected);
    })).toBeLessThan(5);
    await page.reload();
    await expect(page.locator("h1")).toContainText("BUILDING");
    await expect(page.locator("html")).toHaveClass(/gsap-smooth/);
    await expect.poll(() => page.locator(`#${id}`).evaluate(el => {
      const rect = el.getBoundingClientRect();
      const expected = el.id === "contact" ? Math.max(94, innerHeight - rect.height) : 94;
      return Math.abs(rect.top - expected);
    })).toBeLessThan(5);
    expect(errors).toEqual([]);
  }

  await page.setViewportSize({ width: 900, height: 960 });
  await expect(page.locator("html")).not.toHaveClass(/gsap-smooth/);
  await page.setViewportSize({ width: 1440, height: 960 });
  await expect(page.locator("html")).toHaveClass(/gsap-smooth/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveClass(/gsap-smooth/);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("html")).toHaveClass(/gsap-smooth/);

  await page.locator('nav a[href="/#work"]').click();
  await expect.poll(() => page.locator("#work").evaluate(el => Math.abs(el.getBoundingClientRect().top - 94))).toBeLessThan(5);
  const nodes = page.locator(".project-visual").first().locator(".diagram-node");
  await expect(nodes.first()).toHaveCSS("opacity", "1");
  await expect(nodes.last()).toHaveCSS("opacity", "1");
  expect(errors).toEqual([]);
});

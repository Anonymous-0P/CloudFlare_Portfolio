import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("WCAG checks and mobile performance observations", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.addInitScript(() => {
    const measurements = { lcp: 0, cls: 0 };
    (window as unknown as { measurements: typeof measurements }).measurements =
      measurements;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) measurements.lcp = entry.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & {
          hadRecentInput: boolean;
          value: number;
        };
        if (!shift.hadRecentInput) measurements.cls += shift.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto("/");
  await page.waitForTimeout(2000);
  console.log(
    "Local mobile, 4x CPU slowdown:",
    await page.evaluate(
      () => (window as unknown as { measurements: unknown }).measurements,
    ),
  );
  await session.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  ).toEqual([]);
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/work/rotra-logistics/");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
test("desktop content, WebGL, case studies and layer keyboard controls", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on('response', response => {if(response.status()>=400 && response.url().startsWith('http://127.0.0.1:4173')) errors.push(`${response.status()} ${response.url()}`)});
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("BUILDING");
  await page.waitForTimeout(1800);
  await page.screenshot({ path: "test-results/desktop-hero.png" });
  await expect(page.locator(".hero-canvas canvas")).toBeVisible();
  await page.getByRole("tab", { name: "API", exact: false }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Application", exact: false }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("Python");
  await page.getByRole("button", { name: "Long random sequence" }).click();
  await expect(page.locator(".signal-value")).toContainText("96");
  for (const slug of [
    "rotra-logistics",
    "thetatracker",
    "certifypro",
    "merlin-hydraulics",
  ]) {
    await page.goto(`/work/${slug}/`);
    await expect(
      page.getByRole("heading", { name: "My contribution" }),
    ).toBeVisible();
  }
  expect(errors).toEqual([]);
});
test("mobile navigation, layout and reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("link", { name: "Selected work 04" }).click();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "test-results/mobile-hero.png" });
  const overflowing = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflowing).toBe(false);
  await page.getByRole("tab", { name: "Security", exact: false }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Nmap");
  await page.screenshot({
    path: "test-results/mobile-full.png",
    fullPage: true,
  });
  for (const width of [320,768,1440]) {
    await page.setViewportSize({width,height:960});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth), `Overflow at ${width}px`).toBe(false);
  }
});
test("WebGL unavailable keeps content usable and navigation works without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = (() =>
      null) as typeof HTMLCanvasElement.prototype.getContext;
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".hero-canvas .sculpture-fallback")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await context.close();
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await nojs.newPage();
  await staticPage.goto("/");
  await expect(staticPage.locator("h1")).toBeVisible();
  await staticPage.getByRole("link", { name: "Explore selected work" }).click();
  await expect(staticPage).toHaveURL(/#work/);
  await staticPage.locator(".case-link").first().click();
  await expect(staticPage.locator("h1")).toContainText("Rotra");
  await nojs.close();
});

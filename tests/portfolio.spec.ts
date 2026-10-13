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

test("Engineering Core controls, scroll narrative, history and runtime fallbacks", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");
  await expect(page.locator(".hero-canvas canvas")).toBeVisible();
  await expect(page.locator("html")).toHaveClass(/gsap-smooth/);
  await page.locator(".core-controls").getByRole("button", { name: "Security", exact: true }).click();
  await expect(page.locator(".core-description")).toContainText("Security considered");
  await expect(page.getByRole("tab", { name: "Security" })).toHaveAttribute("aria-selected", "true");

  await page.evaluate(() => {
    const canvas = document.querySelector(".hero-canvas canvas") as HTMLCanvasElement;
    canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true }));
  });
  await expect(page.locator(".hero-canvas .sculpture-fallback")).toBeVisible();

  await page.getByRole("link", { name: "Explore selected work" }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator('nav a[href="/#work"]')).toHaveAttribute("aria-current", "location");
  await expect(page.locator(".hero-canvas canvas")).toHaveCount(0);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(page.locator(".hero-canvas canvas")).toBeVisible();
  await expect(page.locator(".hero-canvas .sculpture-fallback")).toBeHidden();
  await page.locator('nav a[href="/#about"]').click();
  await expect(page).toHaveURL(/#about$/);
  await page.goBack();
  await expect(page).toHaveURL(/#work$/);
  await expect.poll(() => page.locator("#work").evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(160);
  await expect.poll(() => page.locator("#smooth-wrapper").evaluate(el => el.scrollTop)).toBe(0);
  await page.goForward();
  await expect(page).toHaveURL(/#about$/);
  await expect.poll(() => page.locator("#about").evaluate(el => Math.abs(el.getBoundingClientRect().top - 94))).toBeLessThan(5);
  await page.evaluate(() => window.scrollBy({ top: 200, behavior: "instant" }));
  await page.locator('nav a[href="/#about"]').click();
  await expect.poll(() => page.locator("#about").evaluate(el => Math.abs(el.getBoundingClientRect().top - 94))).toBeLessThan(5);

  await page.evaluate(() => {
    const el = document.querySelector("#systems") as HTMLElement;
    window.scrollTo({ top: el.offsetTop - innerHeight * 0.35, behavior: "instant" });
  });
  await expect(page.getByRole("tab", { name: "Client", exact: false })).toHaveAttribute("aria-selected", "true");
  await expect.poll(() => page.locator("#systems").evaluate(el => Math.abs(el.getBoundingClientRect().top - innerHeight * 0.35))).toBeLessThan(5);
  await expect(page.locator(".system-node.active")).toHaveCount(1);
  await page.screenshot({ path: "test-results/engineering-desktop.png" });
  const first = await page.locator('[role="tab"][aria-selected="true"]').getAttribute("id");
  await page.evaluate(() => window.scrollBy({ top: 350, behavior: "instant" }));
  await expect.poll(() => page.locator('[role="tab"][aria-selected="true"]').getAttribute("id")).not.toBe(first);
  await page.getByRole("tab", { name: "Data", exact: false }).click();
  await page.evaluate(() => window.scrollBy({ top: 20, behavior: "instant" }));
  await expect(page.getByRole("tab", { name: "Data", exact: false })).toHaveAttribute("aria-selected", "true");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).not.toHaveClass(/gsap-smooth/);
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator('[data-count="10,000+"]')).toHaveText("10,000+");
  await expect(page.locator('[data-count="14M+"]')).toHaveText("14M+");
});

test("mobile Escape, touch scrolling, and readable architecture at narrow widths", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/gsap-smooth/);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.getByRole("tab", { name: "Infrastructure" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Linux VPS");
  await expect(page.locator(".architecture-diagram")).toBeVisible();
  for (const width of [320, 390, 768, 1024, 1920]) {
    await page.setViewportSize({ width, height: 960 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), "overflow at " + width).toBe(false);
  }
});

import { expect, test } from "@playwright/test";

test("用户 CRUD 复用表格 hook 后仍支持翻页、查询、编辑和刷新", async ({ page }) => {
  await page.goto("/#/curd/users");
  const rows = page.locator(".ant-table-tbody tr[data-row-key]");
  await expect(rows).toHaveCount(5);
  await page.locator('.ant-pagination-item-2').click();
  await expect(rows.first()).toContainText("小王");
  await page.getByPlaceholder("请输入姓名").fill("小红");
  await page.getByRole("button", { name: /^查\s*询$/ }).click();
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText("小红");
  await rows.first().getByRole("button", { name: /编\s*辑/ }).click();
  const dialog = page.getByRole("dialog");
  await dialog.locator('.ant-form-item').filter({ hasText: "描述" }).getByRole("textbox").fill("编辑后的描述");
  await dialog.getByRole("button", { name: /保\s*存/ }).click();
  await expect(dialog).not.toBeVisible();
  await expect(rows.first()).toContainText("编辑后的描述");
  await page.getByRole("button", { name: /^重\s*置$/ }).click();
  await expect(rows).toHaveCount(5);
});


test("e-boxes 多组件同步、批量更新、重置和刷新", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/#/eBoxUse");
  await page.getByRole("button", { name: /增\s*加/, exact: true }).click();
  await expect(page.getByTestId("preview-count")).toHaveText("1");
  await page.getByLabel("每次增减").fill("5");
  await page.getByRole("button", { name: /增\s*加/, exact: true }).click();
  await expect(page.getByTestId("preview-count")).toHaveText("6");
  await page.getByLabel("减少计数").click();
  await expect(page.getByTestId("preview-count")).toHaveText("1");
  await page.getByLabel("工作空间名称").fill("测试空间");
  await expect(page.getByRole("heading", { name: "测试空间", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "批量应用设置" }).click();
  await expect(page.getByText("通知已关闭", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "重置示例" }).click();
  await expect(page.getByTestId("preview-count")).toHaveText("0");
  await expect(page.getByLabel("每次增减")).toHaveValue("1");
  await page.screenshot({ path: test.info().outputPath("ebox-main.png") });
  await page.getByRole("button", { name: /增\s*加/, exact: true }).click();
  await page.reload();
  await expect(page.getByTestId("preview-count")).toHaveText("0");
  expect(errors).toEqual([]);
});

import { expect, test } from "@playwright/test";

test.describe("正常系", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/ip-address-converter");
    });

    test.describe("初期表示確認", () => {

        test("タイトルが正しく表示されること。", async ({ page }) => {

            await expect(page).toHaveTitle("IP Address Converter");
        });
    });
});

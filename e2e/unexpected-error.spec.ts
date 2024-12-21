import { expect, test } from "@playwright/test";

test.describe("異常系", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("http://127.0.0.1:3001/ip-address-converter/");
    });

    test.describe("画面表示確認", () => {

        test("エラー画面が正しく表示されること。", async ({ page }) => {

            // コンソールログ
            const messages: string[] = [];
            page.on("console", message => messages.push(message.text()));

            // 通常ページ要素
            const normalHeading = page.locator("h2");
            const convert = page.getByRole("button", { name: "Convert" });

            // エラーページ要素
            const icon = page.locator("i");
            const errorHeading = page.locator("h1");
            const retry = page.getByRole("button", { name: "Retry" });
            const reload = page.getByRole("button", { name: "Reload" });

            // 通常ページ表示
            await expect(normalHeading).toBeVisible();
            await expect(normalHeading).toHaveText("IP Address Converter");
            await expect(errorHeading).toBeHidden();

            // 想定外エラー発生
            await convert.click();

            // エラーページ表示
            await expect(icon).toBeVisible();
            await expect(icon).toHaveClass(/bi-exclamation-triangle/);

            await expect(normalHeading).toBeHidden();
            await expect(errorHeading).toBeVisible();
            await expect(errorHeading).toHaveText("Something went wrong.");

            await expect(retry).toBeVisible();
            await expect(retry).toHaveClass(/btn-primary/);

            await expect(reload).toBeVisible();
            await expect(reload).toHaveClass(/btn-outline-primary/);

            // コンソールログ出力なし
            expect(messages).toHaveLength(0);
        });
    });

    test.describe("ボタン動作確認", () => {

        test("Retryボタンが正しく動作すること。", async ({ page }) => {

            const normalHeading = page.locator("h2");
            const errorHeading = page.locator("h1");

            // 想定外エラー発生
            await page.getByRole("button", { name: "Convert" }).click();

            await expect(normalHeading).toBeHidden();
            await expect(errorHeading).toBeVisible();
            await expect(errorHeading).toHaveText("Something went wrong.");

            // Retryボタン押下
            await page.getByRole("button", { name: "Retry" }).click();

            await expect(normalHeading).toBeVisible();
            await expect(normalHeading).toHaveText("IP Address Converter");
            await expect(errorHeading).toBeHidden();
        });

        test("Reloadボタンが正しく動作すること。", async ({ page }) => {

            const normalHeading = page.locator("h2");
            const errorHeading = page.locator("h1");

            // 想定外エラー発生
            await page.getByRole("button", { name: "Convert" }).click();

            await expect(normalHeading).toBeHidden();
            await expect(errorHeading).toBeVisible();
            await expect(errorHeading).toHaveText("Something went wrong.");

            // Reloadボタン押下
            await page.getByRole("button", { name: "Reload" }).click();

            await expect(normalHeading).toBeVisible();
            await expect(normalHeading).toHaveText("IP Address Converter");
            await expect(errorHeading).toBeHidden();
        });
    });
});

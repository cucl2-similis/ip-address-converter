import { expect, test } from "@playwright/test";

test.describe("正常系", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/ip-address-converter");
    });

    test.describe("初期表示確認", () => {

        test("タイトルが正しく表示されること。", async ({ page }) => {

            await expect(page).toHaveTitle("IP Address Converter");
        });

        test("見出しが正しく表示されること。", async ({ page }) => {

            const heading = page.locator("h2");
            await expect(heading).toHaveText("IP Address Converter");
        });

        test("Formが正しく表示されること。", async ({ page }) => {

            const form = page.locator("form");

            const heading = form.locator("h4");
            await expect(heading).toHaveText("Form");

            const label = form.getByText("IP Address / CIDR", { exact: true });
            await expect(label).toBeVisible();

            let ipv4Input = form.getByLabel("IP Address", { exact: true });
            let cidrInput = form.getByLabel("CIDR", { exact: true });
            await expect(ipv4Input).toBeVisible();
            await expect(cidrInput).toBeVisible();

            ipv4Input = form.getByPlaceholder("0.0.0.0", { exact: true });
            cidrInput = form.getByPlaceholder("0", { exact: true });
            await expect(ipv4Input).toBeEmpty();
            await expect(cidrInput).toBeEmpty();

            const inputGroupText = form.locator("span.input-group-text");
            await expect(inputGroupText).toHaveText("/");

            const convertButton = form.getByRole("button", {name: "Convert"});
            await expect(convertButton).toBeVisible();
            await expect(convertButton).toHaveClass(/btn-primary/);

            const clearButton = form.getByRole("button", {name: "Clear"});
            await expect(clearButton).toBeVisible();
            await expect(clearButton).toHaveClass(/btn-outline-primary/);
        });

        test("Resultが正しく表示されること。", async ({ page }) => {

            const result = page.locator("div.border.rounded")
                               .filter({ hasText: "Result" });

            const rows = result.locator("div.row > div.row");
            const resultRow               = rows.nth(0);
            const ipRow                   = rows.nth(1);
            const classRow                = rows.nth(2);
            const cidrRow                 = rows.nth(3);
            const subnetMaskRow           = rows.nth(4);
            const networkAddressRow       = rows.nth(5);
            const broadcastAddressRow     = rows.nth(6);
            const upperAvailableRangeRow  = rows.nth(7);
            const middleAvailableRangeRow = rows.nth(8);
            const lowerAvailableRangeRow  = rows.nth(9);

            const boldClass = ".fw-bold";
            const monoClass = ".font-monospace";

            const expectedDecIp = "---.---.---.---";
            const expectedBinIp = "--------.--------.--------.--------";

            const heading = resultRow.locator("h4");
            await expect(heading).toHaveText("Result");

            await expect(ipRow.locator(boldClass)).toHaveText("IP");
            await expect(ipRow.locator(monoClass).nth(0)).toHaveText(expectedDecIp);
            await expect(ipRow.locator(monoClass).nth(1)).toHaveText(expectedBinIp);

            await expect(classRow.locator(boldClass)).toHaveText("Class");
            await expect(classRow).toContainText("-");

            await expect(cidrRow.locator(boldClass)).toHaveText("CIDR");
            await expect(cidrRow).toContainText("/-- ( -- IPs )");

            await expect(subnetMaskRow.locator(boldClass)).toHaveText("Subnet mask");
            await expect(subnetMaskRow.locator(monoClass).nth(0)).toHaveText(expectedDecIp);
            await expect(subnetMaskRow.locator(monoClass).nth(1)).toHaveText(expectedBinIp);

            await expect(networkAddressRow.locator(boldClass)).toHaveText("Network address");
            await expect(networkAddressRow.locator(monoClass).nth(0)).toHaveText(expectedDecIp);
            await expect(networkAddressRow.locator(monoClass).nth(1)).toHaveText(expectedBinIp);

            await expect(broadcastAddressRow.locator(boldClass)).toHaveText("Broadcast address");
            await expect(broadcastAddressRow.locator(monoClass).nth(0)).toHaveText(expectedDecIp);
            await expect(broadcastAddressRow.locator(monoClass).nth(1)).toHaveText(expectedBinIp);

            await expect(upperAvailableRangeRow.locator(boldClass)).toHaveText("Available range");
            await expect(upperAvailableRangeRow.locator(monoClass).nth(0)).toHaveText(expectedDecIp);
            await expect(upperAvailableRangeRow.locator(monoClass).nth(1)).toHaveText(expectedBinIp);

            const list = middleAvailableRangeRow.getByText("to", { exact: true });
            await expect(list).toHaveCount(3);
            await expect(list.nth(0)).toBeHidden();
            await expect(list.nth(1)).toBeVisible();
            await expect(list.nth(2)).toBeVisible();

            await expect(lowerAvailableRangeRow.locator(monoClass).nth(0)).toHaveText(expectedDecIp);
            await expect(lowerAvailableRangeRow.locator(monoClass).nth(1)).toHaveText(expectedBinIp);
        });

        test("IPアドレス表が正しく表示されること。", async ({ page }) => {

            const accordion = page.locator("div.accordion")
                                  .filter({hasText: "Simple IP Address Table"});

            const heading = accordion.locator(".accordion-header")
                                     .locator("h5");
            await expect(heading).toBeVisible();
            await expect(heading).toHaveText("Simple IP Address Table");

            const table = accordion.locator("#single-item-accordion-item");
            await expect(table).toBeHidden();
        });

        test("Footerが正しく表示されること。", async ({ page }) => {

            const footer = page.locator("footer");

            const icon = footer.locator("i");
            await expect(icon).toBeVisible();
            await expect(icon).toHaveClass(/bi-github/);

            const anchor = footer.locator("a");
            await expect(anchor).toBeVisible();
            await expect(anchor).toHaveText("Repository");
            await expect(anchor).toHaveAttribute("href", "https://github.com/cucl2-similis/ip-address-converter");
        });
    });
});

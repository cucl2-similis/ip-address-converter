import { expect, Locator, test } from "@playwright/test";

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

            const convertButton = form.getByRole("button", { name: "Convert" });
            await expect(convertButton).toBeVisible();
            await expect(convertButton).toHaveClass(/btn-primary/);

            const clearButton = form.getByRole("button", { name: "Clear" });
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
                                  .filter({ hasText: "Simple IP Address Table" });

            const heading = accordion.locator(".accordion-header")
                                     .locator("h5");
            await expect(heading).toBeVisible();
            await expect(heading).toHaveText("Simple IP Address Table");

            const table = accordion.locator(".accordion-body");
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

    test.describe("ボタン動作確認", () => {

        test("入力チェックが正しく行われること。", async ({ page }) => {

            const ipv4 = page.getByLabel("IP Address", { exact: true });
            const cidr = page.getByLabel("CIDR", { exact: true });

            const convert = page.getByRole("button", { name: "Convert" });
            const clear = page.getByRole("button", { name: "Clear" });

            const noErrorInputInfo = "OK";
            const ipv4EmptyMessage = "IP Address field is required.";
            const ipv4FormatErrMsg = "IP Address must be in format \"IPv4 (000.000.000.000)\".";
            const cidrRangeMessage = "When Address Class is C, CIDR must be between 24 and 32.";
            const cidrFormatErrMsg = "CIDR must be numeric.";

            // 入力フォーム初期表示
            await expect(ipv4).toBeEmpty();
            await expect(cidr).toBeEmpty();
            await expect(ipv4).toHaveAttribute("placeholder", "0.0.0.0");
            await expect(cidr).toHaveAttribute("placeholder", "0");

            // Convertボタン押下
            await convert.click();

            // エラーメッセージ表示
            await expect(page.getByText(noErrorInputInfo, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4EmptyMessage, { exact: true })).toBeVisible();
            await expect(page.getByText(ipv4FormatErrMsg, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrRangeMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrFormatErrMsg, { exact: true })).toBeHidden();

            // 異常な値へ入力値を変更
            await ipv4.fill("a");

            // エラーメッセージ変更
            await expect(page.getByText(noErrorInputInfo, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4EmptyMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4FormatErrMsg, { exact: true })).toBeVisible();
            await expect(page.getByText(cidrRangeMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrFormatErrMsg, { exact: true })).toBeHidden();

            // 正常な値へ入力値を変更
            await ipv4.fill("192.168.10.1");

            // OKメッセージ表示
            await expect(cidr).toHaveAttribute("placeholder", "24");
            await expect(page.getByText(noErrorInputInfo, { exact: true })).toBeVisible();
            await expect(page.getByText(ipv4EmptyMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4FormatErrMsg, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrRangeMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrFormatErrMsg, { exact: true })).toBeHidden();

            // Convertボタン押下
            await convert.click();

            // メッセージ非表示
            await expect(ipv4).toHaveValue("192.168.10.1");
            await expect(cidr).toBeEmpty();
            await expect(cidr).toHaveAttribute("placeholder", "24");
            await expect(page.getByText(noErrorInputInfo, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4EmptyMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4FormatErrMsg, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrRangeMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrFormatErrMsg, { exact: true })).toBeHidden();

            // Clearボタン押下
            await clear.click();

            // 入力フォーム初期表示
            await expect(ipv4).toBeEmpty();
            await expect(cidr).toBeEmpty();
            await expect(ipv4).toHaveAttribute("placeholder", "0.0.0.0");
            await expect(cidr).toHaveAttribute("placeholder", "0");
            await expect(page.getByText(noErrorInputInfo, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4EmptyMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4FormatErrMsg, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrRangeMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrFormatErrMsg, { exact: true })).toBeHidden();

            // 正常な値を入力
            await ipv4.fill("192.168.10.1");
            await cidr.fill("26");

            // メッセージ非表示
            await expect(page.getByText(noErrorInputInfo, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4EmptyMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4FormatErrMsg, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrRangeMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrFormatErrMsg, { exact: true })).toBeHidden();

            // Convertボタン押下
            await convert.click();

            // メッセージ非表示
            await expect(ipv4).toHaveValue("192.168.10.1");
            await expect(cidr).toHaveValue("26");
            await expect(page.getByText(noErrorInputInfo, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4EmptyMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4FormatErrMsg, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrRangeMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrFormatErrMsg, { exact: true })).toBeHidden();

            // 異常な値へ入力値を変更
            await cidr.fill("20");

            // メッセージ非表示
            await expect(page.getByText(noErrorInputInfo, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4EmptyMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4FormatErrMsg, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrRangeMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrFormatErrMsg, { exact: true })).toBeHidden();

            // Convertボタン押下
            await convert.click();

            // エラーメッセージ表示
            await expect(ipv4).toHaveValue("192.168.10.1");
            await expect(cidr).toHaveValue("20");
            await expect(page.getByText(noErrorInputInfo, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4EmptyMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4FormatErrMsg, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrRangeMessage, { exact: true })).toBeVisible();
            await expect(page.getByText(cidrFormatErrMsg, { exact: true })).toBeHidden();

            // 異常な値へ入力値を変更
            await cidr.fill("a");

            // エラーメッセージ変更
            await expect(page.getByText(noErrorInputInfo, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4EmptyMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4FormatErrMsg, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrRangeMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrFormatErrMsg, { exact: true })).toBeVisible();

            // Clearボタン押下
            await clear.click();

            // 入力フォーム初期表示
            await expect(ipv4).toBeEmpty();
            await expect(cidr).toBeEmpty();
            await expect(ipv4).toHaveAttribute("placeholder", "0.0.0.0");
            await expect(cidr).toHaveAttribute("placeholder", "0");
            await expect(page.getByText(noErrorInputInfo, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4EmptyMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(ipv4FormatErrMsg, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrRangeMessage, { exact: true })).toBeHidden();
            await expect(page.getByText(cidrFormatErrMsg, { exact: true })).toBeHidden();
        });

        test("変換結果が正しく表示されること。", async ({ page }) => {

            const ipv4 = page.getByLabel("IP Address", { exact: true });
            const cidr = page.getByLabel("CIDR", { exact: true });

            const clear = page.getByRole("button", { name: "Clear" });

            const resultRows = page.locator("div.border.rounded")
                                   .filter({ hasText: "Result" })
                                   .locator("div.row > div.row");
            const ipRow               = resultRows.nth(1);
            const classRow            = resultRows.nth(2);
            const cidrRow             = resultRows.nth(3);
            const subnetMaskRow       = resultRows.nth(4);
            const networkAddressRow   = resultRows.nth(5);
            const broadcastAddressRow = resultRows.nth(6);
            const firstAvailableIpRow = resultRows.nth(7);
            const lastAvailableIpRow  = resultRows.nth(9);

            const boldClass = ".fw-bold";
            const secondary = ".text-secondary";
            const monoClass = ".font-monospace";
            const monoAndSecondary = monoClass + ">" + secondary;
            const secondaryAndBold = secondary + ">" + boldClass;

            const defaultDecIp = "---.---.---.---";
            const defaultBinIp = "--------.--------.--------.--------";

            // 初期表示
            await expect(ipRow.locator(monoClass).nth(0)).toHaveText(defaultDecIp);
            await expect(ipRow.locator(monoClass).nth(1)).toHaveText(defaultBinIp);

            await expect(classRow).toContainText("-");
            await expect(cidrRow).toContainText("/-- ( -- IPs )");

            await expect(subnetMaskRow.locator(monoClass).nth(0)).toHaveText(defaultDecIp);
            await expect(subnetMaskRow.locator(monoClass).nth(1)).toHaveText(defaultBinIp);

            await expect(networkAddressRow.locator(monoClass).nth(0)).toHaveText(defaultDecIp);
            await expect(networkAddressRow.locator(monoClass).nth(1)).toHaveText(defaultBinIp);

            await expect(broadcastAddressRow.locator(monoClass).nth(0)).toHaveText(defaultDecIp);
            await expect(broadcastAddressRow.locator(monoClass).nth(1)).toHaveText(defaultBinIp);

            await expect(firstAvailableIpRow.locator(monoClass).nth(0)).toHaveText(defaultDecIp);
            await expect(firstAvailableIpRow.locator(monoClass).nth(1)).toHaveText(defaultBinIp);

            await expect(lastAvailableIpRow.locator(monoClass).nth(0)).toHaveText(defaultDecIp);
            await expect(lastAvailableIpRow.locator(monoClass).nth(1)).toHaveText(defaultBinIp);

            // 変換処理実行
            await ipv4.fill("192.168.10.1");
            await ipv4.press("Enter");

            // 変換結果表示
            await expect(ipRow.locator(monoClass).nth(0)).toHaveText("192.168.10.1");
            await expect(ipRow.locator(monoClass).nth(1)).toHaveText("11000000.10101000.00001010.00000001");
            await expect(ipRow.locator(monoAndSecondary)).toHaveText("11000000.10101000.00001010");
            await expect(ipRow.locator(secondaryAndBold)).toHaveText("110");

            await expect(classRow).toContainText("C ( Private )");
            await expect(cidrRow).toContainText("/24 ( 254 IPs )");

            await expect(subnetMaskRow.locator(monoClass).nth(0)).toHaveText("255.255.255.0");
            await expect(subnetMaskRow.locator(monoClass).nth(1)).toHaveText("11111111.11111111.11111111.00000000");
            await expect(subnetMaskRow.locator(monoAndSecondary)).toHaveText("11111111.11111111.11111111");

            await expect(networkAddressRow.locator(monoClass).nth(0)).toHaveText("192.168.10.0");
            await expect(networkAddressRow.locator(monoClass).nth(1)).toHaveText("11000000.10101000.00001010.00000000");
            await expect(networkAddressRow.locator(monoAndSecondary)).toHaveText("11000000.10101000.00001010");

            await expect(broadcastAddressRow.locator(monoClass).nth(0)).toHaveText("192.168.10.255");
            await expect(broadcastAddressRow.locator(monoClass).nth(1)).toHaveText("11000000.10101000.00001010.11111111");
            await expect(broadcastAddressRow.locator(monoAndSecondary)).toHaveText("11000000.10101000.00001010");

            await expect(firstAvailableIpRow.locator(monoClass).nth(0)).toHaveText("192.168.10.1");
            await expect(firstAvailableIpRow.locator(monoClass).nth(1)).toHaveText("11000000.10101000.00001010.00000001");
            await expect(firstAvailableIpRow.locator(monoAndSecondary)).toHaveText("11000000.10101000.00001010");

            await expect(lastAvailableIpRow.locator(monoClass).nth(0)).toHaveText("192.168.10.254");
            await expect(lastAvailableIpRow.locator(monoClass).nth(1)).toHaveText("11000000.10101000.00001010.11111110");
            await expect(lastAvailableIpRow.locator(monoAndSecondary)).toHaveText("11000000.10101000.00001010");

            // 入力チェックエラーによる変換処理失敗
            await cidr.fill("20");
            await cidr.press("Enter");

            // 結果表示変更なし
            await expect(classRow).toContainText("C ( Private )");
            await expect(cidrRow).toContainText("/24 ( 254 IPs )");

            // 変換処理実行
            await cidr.fill("28");
            await cidr.press("Enter");

            // 変換結果表示
            await expect(ipRow.locator(monoClass).nth(0)).toHaveText("192.168.10.1");
            await expect(ipRow.locator(monoClass).nth(1)).toHaveText("11000000.10101000.00001010.00000001");
            await expect(ipRow.locator(monoAndSecondary)).toHaveText("11000000.10101000.00001010.0000");
            await expect(ipRow.locator(secondaryAndBold)).toHaveText("110");

            await expect(classRow).toContainText("C ( Private )");
            await expect(cidrRow).toContainText("/28 ( 14 IPs )");

            await expect(subnetMaskRow.locator(monoClass).nth(0)).toHaveText("255.255.255.240");
            await expect(subnetMaskRow.locator(monoClass).nth(1)).toHaveText("11111111.11111111.11111111.11110000");
            await expect(subnetMaskRow.locator(monoAndSecondary)).toHaveText("11111111.11111111.11111111.1111");

            await expect(networkAddressRow.locator(monoClass).nth(0)).toHaveText("192.168.10.0");
            await expect(networkAddressRow.locator(monoClass).nth(1)).toHaveText("11000000.10101000.00001010.00000000");
            await expect(networkAddressRow.locator(monoAndSecondary)).toHaveText("11000000.10101000.00001010.0000");

            await expect(broadcastAddressRow.locator(monoClass).nth(0)).toHaveText("192.168.10.15");
            await expect(broadcastAddressRow.locator(monoClass).nth(1)).toHaveText("11000000.10101000.00001010.00001111");
            await expect(broadcastAddressRow.locator(monoAndSecondary)).toHaveText("11000000.10101000.00001010.0000");

            await expect(firstAvailableIpRow.locator(monoClass).nth(0)).toHaveText("192.168.10.1");
            await expect(firstAvailableIpRow.locator(monoClass).nth(1)).toHaveText("11000000.10101000.00001010.00000001");
            await expect(firstAvailableIpRow.locator(monoAndSecondary)).toHaveText("11000000.10101000.00001010.0000");

            await expect(lastAvailableIpRow.locator(monoClass).nth(0)).toHaveText("192.168.10.14");
            await expect(lastAvailableIpRow.locator(monoClass).nth(1)).toHaveText("11000000.10101000.00001010.00001110");
            await expect(lastAvailableIpRow.locator(monoAndSecondary)).toHaveText("11000000.10101000.00001010.0000");

            // クリアボタン押下
            await clear.click();

            // 初期表示
            await expect(ipRow.locator(monoClass).nth(0)).toHaveText(defaultDecIp);
            await expect(ipRow.locator(monoClass).nth(1)).toHaveText(defaultBinIp);

            await expect(classRow).toContainText("-");
            await expect(cidrRow).toContainText("/-- ( -- IPs )");

            await expect(subnetMaskRow.locator(monoClass).nth(0)).toHaveText(defaultDecIp);
            await expect(subnetMaskRow.locator(monoClass).nth(1)).toHaveText(defaultBinIp);

            await expect(networkAddressRow.locator(monoClass).nth(0)).toHaveText(defaultDecIp);
            await expect(networkAddressRow.locator(monoClass).nth(1)).toHaveText(defaultBinIp);

            await expect(broadcastAddressRow.locator(monoClass).nth(0)).toHaveText(defaultDecIp);
            await expect(broadcastAddressRow.locator(monoClass).nth(1)).toHaveText(defaultBinIp);

            await expect(firstAvailableIpRow.locator(monoClass).nth(0)).toHaveText(defaultDecIp);
            await expect(firstAvailableIpRow.locator(monoClass).nth(1)).toHaveText(defaultBinIp);

            await expect(lastAvailableIpRow.locator(monoClass).nth(0)).toHaveText(defaultDecIp);
            await expect(lastAvailableIpRow.locator(monoClass).nth(1)).toHaveText(defaultBinIp);
        });

        test("IPアドレス表が正しく動作すること。", async ({ page }) => {

            // IPv4入力フォーム
            const ipv4 = page.getByLabel("IP Address", { exact: true });

            // IPアドレス表
            const accordion = page.locator("div.accordion")
                                  .filter({ hasText: "Simple IP Address Table" });
            const header = accordion.locator(".accordion-header");
            const table = accordion.locator(".accordion-body");
            const trList = table.locator("tbody > tr");

            // IPアドレス表<td>リスト
            const tdListPublicFormerA = trList.nth(0).locator("td");
            const tdListPrivateBlockA = trList.nth(1).locator("td");
            const tdListPublicLatterA = trList.nth(2).locator("td");
            const tdListLocalhostData = trList.nth(3).locator("td");
            const tdListPublicFormerB = trList.nth(4).locator("td");
            const tdListPrivateBlockB = trList.nth(5).locator("td");
            const tdListPublicLatterB = trList.nth(6).locator("td");
            const tdListPublicFormerC = trList.nth(7).locator("td");
            const tdListPrivateBlockC = trList.nth(8).locator("td");
            const tdListPublicLatterC = trList.nth(9).locator("td");

            // ラジオボタン
            const labelDec = table.locator("label").getByText("DEC", { exact: true });
            const labelBin = table.locator("label").getByText("BIN", { exact: true });
            const radioDec = table.getByRole("radio", { name: "DEC" });
            const radioBin = table.getByRole("radio", { name: "BIN" });

            // 指定された<td>にclass="table-info"が含まれないことをアサート
            const assertNotInfoTr = async (tdList: Locator) => {
                for (const td of await tdList.all()) {
                    await expect(td).not.toHaveClass(/table-info/);
                }
            };

            // 10進数の想定結果
            const expectedDecPublicFormerA = ["Class A", "Public",  "1.0.0.0",     "-", "9.255.255.255"  ];
            const expectedDecPrivateBlockA = [           "Private", "10.0.0.0",    "-", "10.255.255.255" ];
            const expectedDecPublicLatterA = [           "Public",  "11.0.0.0",    "-", "126.255.255.255"];
            const expectedDecLocalhostData = ["localhost",          "127.0.0.0",   "-", "127.255.255.255"];
            const expectedDecPublicFormerB = ["Class B", "Public",  "128.0.0.0",   "-", "172.15.255.255" ];
            const expectedDecPrivateBlockB = [           "Private", "172.16.0.0",  "-", "172.31.255.255" ];
            const expectedDecPublicLatterB = [           "Public",  "172.32.0.0",  "-", "191.255.255.255"];
            const expectedDecPublicFormerC = ["Class C", "Public",  "192.0.0.0",   "-", "192.167.255.255"];
            const expectedDecPrivateBlockC = [           "Private", "192.168.0.0", "-", "192.168.255.255"];
            const expectedDecPublicLatterC = [           "Public",  "192.169.0.0", "-", "223.255.255.255"];

            // 2進数の想定結果
            const expectedBinPublicFormerA = ["Class A", "Public",  "00000001.00000000.00000000.00000000", "-", "00001001.11111111.11111111.11111111"];
            const expectedBinPrivateBlockA = [           "Private", "00001010.00000000.00000000.00000000", "-", "00001010.11111111.11111111.11111111"];
            const expectedBinPublicLatterA = [           "Public",  "00001011.00000000.00000000.00000000", "-", "01111110.11111111.11111111.11111111"];
            const expectedBinLocalhostData = ["localhost",          "01111111.00000000.00000000.00000000", "-", "01111111.11111111.11111111.11111111"];
            const expectedBinPublicFormerB = ["Class B", "Public",  "10000000.00000000.00000000.00000000", "-", "10101100.00001111.11111111.11111111"];
            const expectedBinPrivateBlockB = [           "Private", "10101100.00010000.00000000.00000000", "-", "10101100.00011111.11111111.11111111"];
            const expectedBinPublicLatterB = [           "Public",  "10101100.00100000.00000000.00000000", "-", "10111111.11111111.11111111.11111111"];
            const expectedBinPublicFormerC = ["Class C", "Public",  "11000000.00000000.00000000.00000000", "-", "11000000.10100111.11111111.11111111"];
            const expectedBinPrivateBlockC = [           "Private", "11000000.10101000.00000000.00000000", "-", "11000000.10101000.11111111.11111111"];
            const expectedBinPublicLatterC = [           "Public",  "11000000.10101001.00000000.00000000", "-", "11011111.11111111.11111111.11111111"];

            // 初期表示
            await expect(table).toBeHidden();

            // IPアドレス表アコーディオン展開
            await header.click();

            await expect(table).toBeVisible();
            await expect(radioDec).toBeChecked();
            await expect(radioBin).not.toBeChecked();

            // 10進数IPアドレス表
            await expect(tdListPublicFormerA).toContainText(expectedDecPublicFormerA);
            await expect(tdListPrivateBlockA).toContainText(expectedDecPrivateBlockA);
            await expect(tdListPublicLatterA).toContainText(expectedDecPublicLatterA);
            await expect(tdListLocalhostData).toContainText(expectedDecLocalhostData);
            await expect(tdListPublicFormerB).toContainText(expectedDecPublicFormerB);
            await expect(tdListPrivateBlockB).toContainText(expectedDecPrivateBlockB);
            await expect(tdListPublicLatterB).toContainText(expectedDecPublicLatterB);
            await expect(tdListPublicFormerC).toContainText(expectedDecPublicFormerC);
            await expect(tdListPrivateBlockC).toContainText(expectedDecPrivateBlockC);
            await expect(tdListPublicLatterC).toContainText(expectedDecPublicLatterC);

            // 色付きの行なし
            assertNotInfoTr(tdListPublicFormerA);
            assertNotInfoTr(tdListPrivateBlockA);
            assertNotInfoTr(tdListPublicLatterA);
            assertNotInfoTr(tdListLocalhostData);
            assertNotInfoTr(tdListPublicFormerB);
            assertNotInfoTr(tdListPrivateBlockB);
            assertNotInfoTr(tdListPublicLatterB);
            assertNotInfoTr(tdListPublicFormerC);
            assertNotInfoTr(tdListPrivateBlockC);
            assertNotInfoTr(tdListPublicLatterC);

            // 変換処理実行
            await ipv4.fill("172.16.10.1");
            await ipv4.press("Enter");

            // 対象行のみ色付き
            assertNotInfoTr(tdListPublicFormerA);
            assertNotInfoTr(tdListPrivateBlockA);
            assertNotInfoTr(tdListPublicLatterA);
            assertNotInfoTr(tdListLocalhostData);

            await expect(tdListPublicFormerB).toHaveCount(5);
            await expect(tdListPublicFormerB.nth(0)).toHaveClass(/table-info/);
            await expect(tdListPublicFormerB.nth(1)).not.toHaveClass(/table-info/);
            await expect(tdListPublicFormerB.nth(2)).not.toHaveClass(/table-info/);
            await expect(tdListPublicFormerB.nth(3)).not.toHaveClass(/table-info/);
            await expect(tdListPublicFormerB.nth(4)).not.toHaveClass(/table-info/);

            for (const td of await tdListPrivateBlockB.all()) {
                await expect(td).toHaveClass(/table-info/);
            }

            assertNotInfoTr(tdListPublicLatterB);
            assertNotInfoTr(tdListPublicFormerC);
            assertNotInfoTr(tdListPrivateBlockC);
            assertNotInfoTr(tdListPublicLatterC);

            // ラジオボタン切替
            await labelBin.click();

            await expect(radioDec).not.toBeChecked();
            await expect(radioBin).toBeChecked();

            // 2進数IPアドレス表
            await expect(tdListPublicFormerA).toContainText(expectedBinPublicFormerA);
            await expect(tdListPrivateBlockA).toContainText(expectedBinPrivateBlockA);
            await expect(tdListPublicLatterA).toContainText(expectedBinPublicLatterA);
            await expect(tdListLocalhostData).toContainText(expectedBinLocalhostData);
            await expect(tdListPublicFormerB).toContainText(expectedBinPublicFormerB);
            await expect(tdListPrivateBlockB).toContainText(expectedBinPrivateBlockB);
            await expect(tdListPublicLatterB).toContainText(expectedBinPublicLatterB);
            await expect(tdListPublicFormerC).toContainText(expectedBinPublicFormerC);
            await expect(tdListPrivateBlockC).toContainText(expectedBinPrivateBlockC);
            await expect(tdListPublicLatterC).toContainText(expectedBinPublicLatterC);

            // 対象行のみ色付き
            assertNotInfoTr(tdListPublicFormerA);
            assertNotInfoTr(tdListPrivateBlockA);
            assertNotInfoTr(tdListPublicLatterA);
            assertNotInfoTr(tdListLocalhostData);

            await expect(tdListPublicFormerB).toHaveCount(5);
            await expect(tdListPublicFormerB.nth(0)).toHaveClass(/table-info/);
            await expect(tdListPublicFormerB.nth(1)).not.toHaveClass(/table-info/);
            await expect(tdListPublicFormerB.nth(2)).not.toHaveClass(/table-info/);
            await expect(tdListPublicFormerB.nth(3)).not.toHaveClass(/table-info/);
            await expect(tdListPublicFormerB.nth(4)).not.toHaveClass(/table-info/);

            for (const td of await tdListPrivateBlockB.all()) {
                await expect(td).toHaveClass(/table-info/);
            }

            assertNotInfoTr(tdListPublicLatterB);
            assertNotInfoTr(tdListPublicFormerC);
            assertNotInfoTr(tdListPrivateBlockC);
            assertNotInfoTr(tdListPublicLatterC);

            // クリアボタン押下
            await page.getByRole("button", { name: "Clear" }).click();

            await expect(radioDec).not.toBeChecked();
            await expect(radioBin).toBeChecked();

            // 2進数IPアドレス表
            await expect(tdListPublicFormerA).toContainText(expectedBinPublicFormerA);
            await expect(tdListPrivateBlockA).toContainText(expectedBinPrivateBlockA);
            await expect(tdListPublicLatterA).toContainText(expectedBinPublicLatterA);
            await expect(tdListLocalhostData).toContainText(expectedBinLocalhostData);
            await expect(tdListPublicFormerB).toContainText(expectedBinPublicFormerB);
            await expect(tdListPrivateBlockB).toContainText(expectedBinPrivateBlockB);
            await expect(tdListPublicLatterB).toContainText(expectedBinPublicLatterB);
            await expect(tdListPublicFormerC).toContainText(expectedBinPublicFormerC);
            await expect(tdListPrivateBlockC).toContainText(expectedBinPrivateBlockC);
            await expect(tdListPublicLatterC).toContainText(expectedBinPublicLatterC);

            // 色付きの行なし
            assertNotInfoTr(tdListPublicFormerA);
            assertNotInfoTr(tdListPrivateBlockA);
            assertNotInfoTr(tdListPublicLatterA);
            assertNotInfoTr(tdListLocalhostData);
            assertNotInfoTr(tdListPublicFormerB);
            assertNotInfoTr(tdListPrivateBlockB);
            assertNotInfoTr(tdListPublicLatterB);
            assertNotInfoTr(tdListPublicFormerC);
            assertNotInfoTr(tdListPrivateBlockC);
            assertNotInfoTr(tdListPublicLatterC);

            // ラジオボタン切替
            await labelDec.click();

            await expect(radioDec).toBeChecked();
            await expect(radioBin).not.toBeChecked();

            // 10進数IPアドレス表
            await expect(tdListPublicFormerA).toContainText(expectedDecPublicFormerA);
            await expect(tdListPrivateBlockA).toContainText(expectedDecPrivateBlockA);
            await expect(tdListPublicLatterA).toContainText(expectedDecPublicLatterA);
            await expect(tdListLocalhostData).toContainText(expectedDecLocalhostData);
            await expect(tdListPublicFormerB).toContainText(expectedDecPublicFormerB);
            await expect(tdListPrivateBlockB).toContainText(expectedDecPrivateBlockB);
            await expect(tdListPublicLatterB).toContainText(expectedDecPublicLatterB);
            await expect(tdListPublicFormerC).toContainText(expectedDecPublicFormerC);
            await expect(tdListPrivateBlockC).toContainText(expectedDecPrivateBlockC);
            await expect(tdListPublicLatterC).toContainText(expectedDecPublicLatterC);

            // 色付きの行なし
            assertNotInfoTr(tdListPublicFormerA);
            assertNotInfoTr(tdListPrivateBlockA);
            assertNotInfoTr(tdListPublicLatterA);
            assertNotInfoTr(tdListLocalhostData);
            assertNotInfoTr(tdListPublicFormerB);
            assertNotInfoTr(tdListPrivateBlockB);
            assertNotInfoTr(tdListPublicLatterB);
            assertNotInfoTr(tdListPublicFormerC);
            assertNotInfoTr(tdListPrivateBlockC);
            assertNotInfoTr(tdListPublicLatterC);

            // IPアドレス表アコーディオン縮小
            await header.click();

            await expect(table).toBeHidden();
        });
    });
});

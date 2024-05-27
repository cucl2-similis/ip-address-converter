import { Form } from "@/app/_components/form";
import { Builder } from "@/app/_lib/builder";
import { AddressBlock } from "@/app/_lib/const";
import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { act, fireEvent, screen } from "@testing-library/react";
import { Root, createRoot } from "react-dom/client";

describe("Formコンポーネント", () => {

    let container: HTMLElement;
    let root: Root;

    beforeEach(() => {
        container = document.createElement("div");
        root = createRoot(container);
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    describe("表示内容確認", () => {

        test("見出し「Form」が表示されること。", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });

            expect(container.textContent).toEqual(expect.stringContaining("Form"));
        });

        test("ラベル「IP Address / CIDR」が表示されること。", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });

            expect(container.textContent).toEqual(expect.stringContaining("IP Address / CIDR"));
        });

        test("ラベル「IP Address」と、対応するテキストボックスが表示されること。", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });

            const labelName = "IP Address";
            expect(container.textContent).toEqual(expect.stringContaining(labelName));

            const inputElement = screen.getByLabelText<HTMLInputElement>(labelName);
            expect(inputElement.tagName).toEqual("INPUT");
            expect(inputElement.type).toEqual("text");
        });

        test("ラベル「CIDR」と、対応するテキストボックスが表示されること。", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });

            const labelName = "CIDR";
            expect(container.textContent).toEqual(expect.stringContaining(labelName));

            const inputElement = screen.getByLabelText<HTMLInputElement>(labelName);
            expect(inputElement.tagName).toEqual("INPUT");
            expect(inputElement.type).toEqual("text");
        });

        test("ボタン「Convert」が表示されること。", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });

            const buttonElement = screen.getByRole("button", {name: "Convert"});
            expect(buttonElement.textContent).not.toBeUndefined();
        });
    });

    describe("Convertボタン動作確認", () => {

        test("入力値なしでのボタン押下の場合、変換結果DTO用のstateセッタ関数が呼び出されないこと。", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });

            const buttonElement = screen.getByRole("button", {name: "Convert"});
            fireEvent.click(buttonElement);

            expect(setResultDto).not.toHaveBeenCalled();
        });

        test("入力値に対応した変換結果DTOが、stateセッタ関数によって設定されること。", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });

            const ipv4InputElement = screen.getByLabelText<HTMLInputElement>("IP Address");
            const cidrInputElement = screen.getByLabelText<HTMLInputElement>("CIDR");
            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "24";

            const buttonElement = screen.getByRole("button", {name: "Convert"});
            fireEvent.click(buttonElement);

            expect(setResultDto).toHaveBeenCalledTimes(1);

            const resultDto = Builder.ofResultDto()
                    .decIpAddressArray([192, 168, 10, 1])
                    .decSubnetMaskArray([255, 255, 255, 0])
                    .decNetworkAddressArray([192, 168, 10, 0])
                    .decBroadcastAddressArray([192, 168, 10, 255])
                    .decFirstAvailableIpAddressArray([192, 168, 10, 1])
                    .decLastAvailableIpAddressArray([192, 168, 10, 254])
                    .binIpAddressArray(["11000000", "10101000", "00001010", "00000001"])
                    .binSubnetMaskArray(["11111111", "11111111", "11111111", "00000000"])
                    .binNetworkAddressArray(["11000000", "10101000", "00001010", "00000000"])
                    .binBroadcastAddressArray(["11000000", "10101000", "00001010", "11111111"])
                    .binFirstAvailableIpAddressArray(["11000000", "10101000", "00001010", "00000001"])
                    .binLastAvailableIpAddressArray(["11000000", "10101000", "00001010", "11111110"])
                    .cidr(24)
                    .addressBlock(AddressBlock.C_PRIVATE_BLOCK)
                    .numberOfAvailableIps(254)
                    .build();

            expect(setResultDto).toHaveBeenCalledWith(resultDto);
        });
    });

    describe("エラーメッセージ表示確認", () => {

        test("初期表示にエラーメッセージが含まれないこと。", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });
            const formElement = container.children[0] as HTMLFormElement;

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation"));
            expect(formElement.className).toEqual(expect.not.stringContaining("needs-validation was-validated"));
        });

        test("入力値が正常の場合、エラーメッセージが表示されないこと。", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });
            const formElement = container.children[0] as HTMLFormElement;

            const ipv4InputElement = screen.getByLabelText<HTMLInputElement>("IP Address");
            const cidrInputElement = screen.getByLabelText<HTMLInputElement>("CIDR");
            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "24";

            const buttonElement = screen.getByRole("button", {name: "Convert"});
            fireEvent.click(buttonElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation"));
            expect(formElement.className).toEqual(expect.not.stringContaining("needs-validation was-validated"));
        });

        test("入力値にエラーがある場合、対応するエラーメッセージが表示されること。", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });
            const formElement = container.children[0] as HTMLFormElement;

            const ipv4InputElement = screen.getByLabelText<HTMLInputElement>("IP Address");
            const cidrInputElement = screen.getByLabelText<HTMLInputElement>("CIDR");
            ipv4InputElement.value = "";
            cidrInputElement.value = "24";

            const buttonElement = screen.getByRole("button", {name: "Convert"});
            fireEvent.click(buttonElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.stringContaining("IP Address field is required."));
        });

        test("エラーメッセージ表示後、入力値の変更により表示メッセージが更新されること。#01", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });
            const formElement = container.children[0] as HTMLFormElement;

            const ipv4InputElement = screen.getByLabelText<HTMLInputElement>("IP Address");
            const cidrInputElement = screen.getByLabelText<HTMLInputElement>("CIDR");
            ipv4InputElement.value = "";
            cidrInputElement.value = "cidr";

            const buttonElement = screen.getByRole("button", {name: "Convert"});
            fireEvent.click(buttonElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.stringContaining("IP Address field is required."));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("CIDR must be numeric."));

            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "cidr";
            fireEvent.input(ipv4InputElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("IP Address field is required."));
            expect(formElement.textContent).toEqual(expect.stringContaining("CIDR must be numeric."));

            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "24";
            fireEvent.input(cidrInputElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(true);
            expect(formElement.textContent).toEqual(expect.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("IP Address field is required."));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("CIDR must be numeric."));
        });

        test("エラーメッセージ表示後、入力値の変更により表示メッセージが更新されること。#02", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });
            const formElement = container.children[0] as HTMLFormElement;

            const ipv4InputElement = screen.getByLabelText<HTMLInputElement>("IP Address");
            const cidrInputElement = screen.getByLabelText<HTMLInputElement>("CIDR");
            ipv4InputElement.value = "";
            cidrInputElement.value = "24";

            const buttonElement = screen.getByRole("button", {name: "Convert"});
            fireEvent.click(buttonElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.stringContaining("IP Address field is required."));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("CIDR must be numeric."));

            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "24";
            fireEvent.input(ipv4InputElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(true);
            expect(formElement.textContent).toEqual(expect.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("IP Address field is required."));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("CIDR must be numeric."));

            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "cidr";
            fireEvent.input(cidrInputElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("IP Address field is required."));
            expect(formElement.textContent).toEqual(expect.stringContaining("CIDR must be numeric."));
        });

        test("エラーメッセージ表示後、入力値の変更により表示メッセージが更新されること。#03", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });
            const formElement = container.children[0] as HTMLFormElement;

            const ipv4InputElement = screen.getByLabelText<HTMLInputElement>("IP Address");
            const cidrInputElement = screen.getByLabelText<HTMLInputElement>("CIDR");
            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "cidr";

            const buttonElement = screen.getByRole("button", {name: "Convert"});
            fireEvent.click(buttonElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("IP Address field is required."));
            expect(formElement.textContent).toEqual(expect.stringContaining("CIDR must be numeric."));

            ipv4InputElement.value = "";
            cidrInputElement.value = "cidr";
            fireEvent.input(ipv4InputElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.stringContaining("IP Address field is required."));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("CIDR must be numeric."));

            ipv4InputElement.value = "";
            cidrInputElement.value = "24";
            fireEvent.input(cidrInputElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.stringContaining("IP Address field is required."));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("CIDR must be numeric."));
        });

        test("エラーメッセージ表示後、入力値の変更により表示メッセージが更新されること。#04", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });
            const formElement = container.children[0] as HTMLFormElement;

            const ipv4InputElement = screen.getByLabelText<HTMLInputElement>("IP Address");
            const cidrInputElement = screen.getByLabelText<HTMLInputElement>("CIDR");
            ipv4InputElement.value = "";
            cidrInputElement.value = "24";

            const buttonElement = screen.getByRole("button", {name: "Convert"});
            fireEvent.click(buttonElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.stringContaining("IP Address field is required."));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("CIDR must be numeric."));

            ipv4InputElement.value = "";
            cidrInputElement.value = "cidr";
            fireEvent.input(cidrInputElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.stringContaining("IP Address field is required."));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("CIDR must be numeric."));

            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "cidr";
            fireEvent.input(ipv4InputElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("IP Address field is required."));
            expect(formElement.textContent).toEqual(expect.stringContaining("CIDR must be numeric."));
        });

        test("エラーメッセージ表示後、入力値の変更により表示メッセージが更新されること。#05", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });
            const formElement = container.children[0] as HTMLFormElement;

            const ipv4InputElement = screen.getByLabelText<HTMLInputElement>("IP Address");
            const cidrInputElement = screen.getByLabelText<HTMLInputElement>("CIDR");
            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "8";

            const buttonElement = screen.getByRole("button", {name: "Convert"});
            fireEvent.click(buttonElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("When Address Class is A, CIDR must be between 8 and 15."));
            expect(formElement.textContent).toEqual(expect.stringContaining("When Address Class is C, CIDR must be between 24 and 32."));

            ipv4InputElement.value = "10.0.0.1";
            cidrInputElement.value = "8";
            fireEvent.input(ipv4InputElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(true);
            expect(formElement.textContent).toEqual(expect.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("When Address Class is A, CIDR must be between 8 and 15."));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("When Address Class is C, CIDR must be between 24 and 32."));

            ipv4InputElement.value = "10.0.0.1";
            cidrInputElement.value = "24";
            fireEvent.input(cidrInputElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.stringContaining("When Address Class is A, CIDR must be between 8 and 15."));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("When Address Class is C, CIDR must be between 24 and 32."));
        });

        test("エラーメッセージ表示後、入力値の変更により表示メッセージが更新されること。#06", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });
            const formElement = container.children[0] as HTMLFormElement;

            const ipv4InputElement = screen.getByLabelText<HTMLInputElement>("IP Address");
            const cidrInputElement = screen.getByLabelText<HTMLInputElement>("CIDR");
            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "8";

            const buttonElement = screen.getByRole("button", {name: "Convert"});
            fireEvent.click(buttonElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("When Address Class is A, CIDR must be between 8 and 15."));
            expect(formElement.textContent).toEqual(expect.stringContaining("When Address Class is C, CIDR must be between 24 and 32."));

            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "24";
            fireEvent.input(cidrInputElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(true);
            expect(formElement.textContent).toEqual(expect.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("When Address Class is A, CIDR must be between 8 and 15."));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("When Address Class is C, CIDR must be between 24 and 32."));

            ipv4InputElement.value = "10.0.0.1";
            cidrInputElement.value = "24";
            fireEvent.input(ipv4InputElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.stringContaining("When Address Class is A, CIDR must be between 8 and 15."));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("When Address Class is C, CIDR must be between 24 and 32."));
        });

        test("エラーメッセージ表示後、正常な入力値でのConvertボタン押下により、メッセージが非表示となること。", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });
            const formElement = container.children[0] as HTMLFormElement;

            const ipv4InputElement = screen.getByLabelText<HTMLInputElement>("IP Address");
            const cidrInputElement = screen.getByLabelText<HTMLInputElement>("CIDR");
            ipv4InputElement.value = "";
            cidrInputElement.value = "24";

            const buttonElement = screen.getByRole("button", {name: "Convert"});
            fireEvent.click(buttonElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.stringContaining("IP Address field is required."));

            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "24";
            fireEvent.input(ipv4InputElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(true);
            expect(formElement.textContent).toEqual(expect.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("IP Address field is required."));

            fireEvent.click(buttonElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation"));
            expect(formElement.className).toEqual(expect.not.stringContaining("needs-validation was-validated"));
            expect(formElement.textContent).toEqual(expect.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("IP Address field is required."));
        });

        test("エラーメッセージ表示後、異常な入力値でのConvertボタン押下により、メッセージが再表示されること。", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });
            const formElement = container.children[0] as HTMLFormElement;

            const ipv4InputElement = screen.getByLabelText<HTMLInputElement>("IP Address");
            const cidrInputElement = screen.getByLabelText<HTMLInputElement>("CIDR");
            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "cidr";

            const buttonElement = screen.getByRole("button", {name: "Convert"});
            fireEvent.click(buttonElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.stringContaining("CIDR must be numeric."));

            ipv4InputElement.value = "";
            cidrInputElement.value = "cidr";
            fireEvent.input(ipv4InputElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.stringContaining("IP Address field is required."));

            fireEvent.click(buttonElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.stringContaining("IP Address field is required."));
        });

        test("正常な入力値でのConvertボタン押下によるメッセージ非表示化後、メッセージが更新されなくなること。", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });
            const formElement = container.children[0] as HTMLFormElement;

            const ipv4InputElement = screen.getByLabelText<HTMLInputElement>("IP Address");
            const cidrInputElement = screen.getByLabelText<HTMLInputElement>("CIDR");
            ipv4InputElement.value = "";
            cidrInputElement.value = "24";

            const buttonElement = screen.getByRole("button", {name: "Convert"});
            fireEvent.click(buttonElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(false);
            expect(formElement.textContent).toEqual(expect.not.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.stringContaining("IP Address field is required."));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("CIDR must be numeric."));

            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "24";
            fireEvent.input(ipv4InputElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation was-validated"));
            expect(formElement.checkValidity()).toEqual(true);
            expect(formElement.textContent).toEqual(expect.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("IP Address field is required."));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("CIDR must be numeric."));

            fireEvent.click(buttonElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation"));
            expect(formElement.className).toEqual(expect.not.stringContaining("needs-validation was-validated"));
            expect(formElement.textContent).toEqual(expect.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("IP Address field is required."));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("CIDR must be numeric."));

            ipv4InputElement.value = "";
            cidrInputElement.value = "24";
            fireEvent.input(ipv4InputElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation"));
            expect(formElement.className).toEqual(expect.not.stringContaining("needs-validation was-validated"));
            expect(formElement.textContent).toEqual(expect.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("IP Address field is required."));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("CIDR must be numeric."));

            ipv4InputElement.value = "";
            cidrInputElement.value = "cidr";
            fireEvent.input(cidrInputElement);

            expect(formElement.className).toEqual(expect.stringContaining("needs-validation"));
            expect(formElement.className).toEqual(expect.not.stringContaining("needs-validation was-validated"));
            expect(formElement.textContent).toEqual(expect.stringContaining("OK"));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("IP Address field is required."));
            expect(formElement.textContent).toEqual(expect.not.stringContaining("CIDR must be numeric."));
        });
    });
});

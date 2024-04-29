import { Result } from "@/app/_components/result";
import { Assertions } from "@/app/_lib/assertions";
import { Builder } from "@/app/_lib/builder";
import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { act, fireEvent, screen } from "@testing-library/react";
import { Root, createRoot } from "react-dom/client";

describe("Resultコンポーネント", () => {

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

    const selectorsOfSubheading = "div.col-md-3.col-lg-2.fw-bold.text-md-end";

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
            .build();

    describe("静的表示確認", () => {

        test("見出し「Result」が表示されること。", () => {

            act(() => {
                root.render(<Result resultDto={null} />);
            });

            expect(container.textContent).toEqual(expect.stringContaining("Result"));
        });

        test("見出し「IP」が表示されること。", () => {

            act(() => {
                root.render(<Result resultDto={null} />);
            });

            expect(container.textContent).toEqual(expect.stringContaining("IP"));
        });

        test("見出し「Class」が表示されること。", () => {

            act(() => {
                root.render(<Result resultDto={null} />);
            });

            expect(container.textContent).toEqual(expect.stringContaining("Class"));
        });

        test("見出し「CIDR」が表示されること。", () => {

            act(() => {
                root.render(<Result resultDto={null} />);
            });

            expect(container.textContent).toEqual(expect.stringContaining("CIDR"));
        });

        test("見出し「Subnet mask」が表示されること。", () => {

            act(() => {
                root.render(<Result resultDto={null} />);
            });

            expect(container.textContent).toEqual(expect.stringContaining("Subnet mask"));
        });

        test("見出し「Network address」が表示されること。", () => {

            act(() => {
                root.render(<Result resultDto={null} />);
            });

            expect(container.textContent).toEqual(expect.stringContaining("Network address"));
        });

        test("見出し「Broadcast address」が表示されること。", () => {

            act(() => {
                root.render(<Result resultDto={null} />);
            });

            expect(container.textContent).toEqual(expect.stringContaining("Broadcast address"));
        });

        test("見出し「Available range」が表示されること。", () => {

            act(() => {
                root.render(<Result resultDto={null} />);
            });

            expect(container.textContent).toEqual(expect.stringContaining("Available range"));
        });
    });

    describe("動的表示確認", () => {

        test("変換結果DTO未設定の場合、IPアドレスが初期表示であること。", () => {

            act(() => {
                root.render(<Result resultDto={null} />);
            });

            const textContent = "IP";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const actual = element.parentElement.textContent;

            expect(actual).toEqual(expect.stringContaining("---.---.---.---"));
            expect(actual).toEqual(expect.stringContaining("--------.--------.--------.--------"));
        });

        test("変換結果DTO設定済の場合、IPアドレスが正しく表示されること。", () => {

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            const textContent = "IP";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const actual = element.parentElement.textContent;

            expect(actual).toEqual(expect.stringContaining("192.168.10.1"));
            expect(actual).toEqual(expect.stringContaining("11000000.10101000.00001010.00000001"));
            expect(actual).toEqual(expect.not.stringContaining("---.---.---.---"));
            expect(actual).toEqual(expect.not.stringContaining("--------.--------.--------.--------"));
        });

        test("変換結果DTO未設定の場合、アドレスクラスが初期表示であること。", () => {

            act(() => {
                root.render(<Result resultDto={null} />);
            });

            const textContent = "Class";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const actual = element.parentElement.textContent;

            expect(actual).toEqual(expect.stringContaining("-"));
        });

        test("変換結果DTO設定済の場合、アドレスクラスが正しく表示されること。", () => {

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            const textContent = "Class";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const actual = element.parentElement.textContent;

            expect(actual).toEqual(expect.stringContaining("C"));
            expect(actual).toEqual(expect.not.stringContaining("-"));
        });

        test("変換結果DTO未設定の場合、CIDRが初期表示であること。", () => {

            act(() => {
                root.render(<Result resultDto={null} />);
            });

            const textContent = "CIDR";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const actual = element.parentElement.textContent;

            expect(actual).toEqual(expect.stringContaining("/-- ( -- IPs )"));
        });

        test("変換結果DTO設定済の場合、CIDRが正しく表示されること。", () => {

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            const textContent = "CIDR";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const actual = element.parentElement.textContent;

            expect(actual).toEqual(expect.stringContaining("/24 ( 254 IPs )"));
            expect(actual).toEqual(expect.not.stringContaining("/-- ( -- IPs )"));
        });

        test("変換結果DTO未設定の場合、サブネットマスクが初期表示であること。", () => {

            act(() => {
                root.render(<Result resultDto={null} />);
            });

            const textContent = "Subnet mask";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const actual = element.parentElement.textContent;

            expect(actual).toEqual(expect.stringContaining("---.---.---.---"));
            expect(actual).toEqual(expect.stringContaining("--------.--------.--------.--------"));
        });

        test("変換結果DTO設定済の場合、サブネットマスクが正しく表示されること。", () => {

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            const textContent = "Subnet mask";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const actual = element.parentElement.textContent;

            expect(actual).toEqual(expect.stringContaining("255.255.255.0"));
            expect(actual).toEqual(expect.stringContaining("11111111.11111111.11111111.00000000"));
            expect(actual).toEqual(expect.not.stringContaining("---.---.---.---"));
            expect(actual).toEqual(expect.not.stringContaining("--------.--------.--------.--------"));
        });

        test("変換結果DTO未設定の場合、ネットワークアドレスが初期表示であること。", () => {

            act(() => {
                root.render(<Result resultDto={null} />);
            });

            const textContent = "Network address";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const actual = element.parentElement.textContent;

            expect(actual).toEqual(expect.stringContaining("---.---.---.---"));
            expect(actual).toEqual(expect.stringContaining("--------.--------.--------.--------"));
        });

        test("変換結果DTO設定済の場合、ネットワークアドレスが正しく表示されること。", () => {

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            const textContent = "Network address";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const actual = element.parentElement.textContent;

            expect(actual).toEqual(expect.stringContaining("192.168.10.0"));
            expect(actual).toEqual(expect.stringContaining("11000000.10101000.00001010.00000000"));
            expect(actual).toEqual(expect.not.stringContaining("---.---.---.---"));
            expect(actual).toEqual(expect.not.stringContaining("--------.--------.--------.--------"));
        });

        test("変換結果DTO未設定の場合、ブロードキャストアドレスが初期表示であること。", () => {

            act(() => {
                root.render(<Result resultDto={null} />);
            });

            const textContent = "Broadcast address";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const actual = element.parentElement.textContent;

            expect(actual).toEqual(expect.stringContaining("---.---.---.---"));
            expect(actual).toEqual(expect.stringContaining("--------.--------.--------.--------"));
        });

        test("変換結果DTO設定済の場合、ブロードキャストアドレスが正しく表示されること。", () => {

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            const textContent = "Broadcast address";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const actual = element.parentElement.textContent;

            expect(actual).toEqual(expect.stringContaining("192.168.10.255"));
            expect(actual).toEqual(expect.stringContaining("11000000.10101000.00001010.11111111"));
            expect(actual).toEqual(expect.not.stringContaining("---.---.---.---"));
            expect(actual).toEqual(expect.not.stringContaining("--------.--------.--------.--------"));
        });

        test("変換結果DTO未設定の場合、利用可能範囲IPアドレスが初期表示であること。", () => {

            act(() => {
                root.render(<Result resultDto={null} />);
            });

            const textContent = "Available range";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const first = element.parentElement;
            const to = first.nextElementSibling;
            Assertions.assertNotNull(to);
            const last = to.nextElementSibling;
            Assertions.assertNotNull(last);
            Assertions.assertNotNull(first.textContent);
            Assertions.assertNotNull(to.textContent);
            Assertions.assertNotNull(last.textContent);
            const actual = first.textContent + to.textContent + last.textContent;

            const decExpected = new RegExp("---.---.---.---" + ".*" + "to" + ".*" + "---.---.---.---");
            const binExpected = new RegExp("--------.--------.--------.--------" + ".*" + "to" + ".*" + "--------.--------.--------.--------");
            expect(actual).toEqual(expect.stringMatching(decExpected));
            expect(actual).toEqual(expect.stringMatching(binExpected));
        });

        test("変換結果DTO設定済の場合、利用可能範囲IPアドレスが正しく表示されること。", () => {

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            const textContent = "Available range";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const first = element.parentElement;
            const to = first.nextElementSibling;
            Assertions.assertNotNull(to);
            const last = to.nextElementSibling;
            Assertions.assertNotNull(last);
            Assertions.assertNotNull(first.textContent);
            Assertions.assertNotNull(to.textContent);
            Assertions.assertNotNull(last.textContent);
            const actual = first.textContent + to.textContent + last.textContent;

            const decExpected = new RegExp("192.168.10.1" + ".*" + "to" + ".*" + "192.168.10.254");
            const binExpected = new RegExp("11000000.10101000.00001010.00000001" + ".*" + "to" + ".*" + "11000000.10101000.00001010.11111110");
            expect(actual).toEqual(expect.stringMatching(decExpected));
            expect(actual).toEqual(expect.stringMatching(binExpected));

            const decNotExpected = new RegExp("---.---.---.---" + ".*" + "to" + ".*" + "---.---.---.---");
            const binNotExpected = new RegExp("--------.--------.--------.--------" + ".*" + "to" + ".*" + "--------.--------.--------.--------");
            expect(actual).toEqual(expect.not.stringMatching(decNotExpected));
            expect(actual).toEqual(expect.not.stringMatching(binNotExpected));
        });

        test("ラジオボタンにレスポンシブ表示切替用オプションclass属性が設定されること。", () => {

            const expected = "d-md-none";

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            const ariaLabel = "result Decimal and Binary radio toggle button group";
            const selector = `[aria-label="${ariaLabel}"]`;
            const radioDivElement = container.querySelector<HTMLDivElement>(selector);
            Assertions.assertNotNull(radioDivElement);

            expect(radioDivElement.className).toEqual(expect.stringContaining(expected));
        });
    });

    describe("テキスト確認", () => {

        let expected: HTMLDivElement;
        let secondarySpan: HTMLSpanElement;
        let boldFontsSpan: HTMLSpanElement;
        let plainTextSpan: HTMLSpanElement;

        beforeEach(() => {
            expected = document.createElement("div");

            secondarySpan = document.createElement("span");
            boldFontsSpan = document.createElement("span");
            plainTextSpan = document.createElement("span");

            expected.className = "col-md-6 col-lg-8 font-monospace d-none d-md-block";
            secondarySpan.className = "text-secondary";
            boldFontsSpan.className = "fw-bold";
        });

        afterEach(() => {
            plainTextSpan.remove();
            boldFontsSpan.remove();
            secondarySpan.remove();
            expected.remove();
        });

        test("2進数IPアドレスに、太字フォント及びセカンダリテキスト表示が適用されること。", () => {

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            const textContent = "IP";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const actual = element.parentElement.lastChild;

            secondarySpan.append(boldFontsSpan);
            boldFontsSpan.append("110");
            secondarySpan.append("00000.10101000.00001010");
            plainTextSpan.append(".00000001");

            expected.append(secondarySpan);
            expected.append(plainTextSpan);

            expect(actual).toEqual(expected);
        });

        test("2進数サブネットマスクに、セカンダリテキスト表示が適用されること。", () => {

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            const textContent = "Subnet mask";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const actual = element.parentElement.lastChild;

            secondarySpan.append(boldFontsSpan);
            secondarySpan.append("11111111.11111111.11111111");
            plainTextSpan.append(".00000000");

            expected.append(secondarySpan);
            expected.append(plainTextSpan);

            expect(actual).toEqual(expected);
        });

        test("2進数ネットワークアドレスに、セカンダリテキスト表示が適用されること。", () => {

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            const textContent = "Network address";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const actual = element.parentElement.lastChild;

            secondarySpan.append(boldFontsSpan);
            secondarySpan.append("11000000.10101000.00001010");
            plainTextSpan.append(".00000000");

            expected.append(secondarySpan);
            expected.append(plainTextSpan);

            expect(actual).toEqual(expected);
        });

        test("2進数ブロードキャストアドレスに、セカンダリテキスト表示が適用されること。", () => {

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            const textContent = "Broadcast address";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const actual = element.parentElement.lastChild;

            secondarySpan.append(boldFontsSpan);
            secondarySpan.append("11000000.10101000.00001010");
            plainTextSpan.append(".11111111");

            expected.append(secondarySpan);
            expected.append(plainTextSpan);

            expect(actual).toEqual(expected);
        });

        test("2進数利用可能範囲IPアドレスに、セカンダリテキスト表示が適用されること。", () => {

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            const textContent = "Available range";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            Assertions.assertNotNull(element.parentElement);
            const to = element.parentElement.nextElementSibling;
            Assertions.assertNotNull(to);
            const lastDiv = to.nextElementSibling;
            Assertions.assertNotNull(lastDiv);
            const actualFirst = element.parentElement.lastChild;
            const actualLast = lastDiv.lastChild;

            secondarySpan.append(boldFontsSpan);
            secondarySpan.append("11000000.10101000.00001010");

            expected.append(secondarySpan);
            expected.append(plainTextSpan);

            plainTextSpan.append(".00000001");
            expect(actualFirst).toEqual(expected);

            plainTextSpan.replaceChildren(".11111110");
            expect(actualLast).toEqual(expected);
        });
    });

    describe("ラジオボタン切替動作確認", () => {

        test("IPアドレスの初期表示およびラジオボタン操作による表示切替が適切であること。", () => {

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            const textContent = "IP";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            const decResult = element.nextElementSibling;
            Assertions.assertNotNull(decResult);
            const binResult = decResult.nextElementSibling;
            Assertions.assertNotNull(binResult);

            const classNameForHidden = "d-none d-md-block";

            expect(decResult.className).toEqual(expect.not.stringContaining(classNameForHidden));
            expect(binResult.className).toEqual(expect.stringContaining(classNameForHidden));

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");

            fireEvent.click(binInputElement);

            expect(decResult.className).toEqual(expect.stringContaining(classNameForHidden));
            expect(binResult.className).toEqual(expect.not.stringContaining(classNameForHidden));

            fireEvent.click(decInputElement);

            expect(decResult.className).toEqual(expect.not.stringContaining(classNameForHidden));
            expect(binResult.className).toEqual(expect.stringContaining(classNameForHidden));
        });

        test("サブネットマスクの初期表示およびラジオボタン操作による表示切替が適切であること。", () => {

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            const textContent = "Subnet mask";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            const decResult = element.nextElementSibling;
            Assertions.assertNotNull(decResult);
            const binResult = decResult.nextElementSibling;
            Assertions.assertNotNull(binResult);

            const classNameForHidden = "d-none d-md-block";

            expect(decResult.className).toEqual(expect.not.stringContaining(classNameForHidden));
            expect(binResult.className).toEqual(expect.stringContaining(classNameForHidden));

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");

            fireEvent.click(binInputElement);

            expect(decResult.className).toEqual(expect.stringContaining(classNameForHidden));
            expect(binResult.className).toEqual(expect.not.stringContaining(classNameForHidden));

            fireEvent.click(decInputElement);

            expect(decResult.className).toEqual(expect.not.stringContaining(classNameForHidden));
            expect(binResult.className).toEqual(expect.stringContaining(classNameForHidden));
        });

        test("ネットワークアドレスの初期表示およびラジオボタン操作による表示切替が適切であること。", () => {

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            const textContent = "Network address";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            const decResult = element.nextElementSibling;
            Assertions.assertNotNull(decResult);
            const binResult = decResult.nextElementSibling;
            Assertions.assertNotNull(binResult);

            const classNameForHidden = "d-none d-md-block";

            expect(decResult.className).toEqual(expect.not.stringContaining(classNameForHidden));
            expect(binResult.className).toEqual(expect.stringContaining(classNameForHidden));

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");

            fireEvent.click(binInputElement);

            expect(decResult.className).toEqual(expect.stringContaining(classNameForHidden));
            expect(binResult.className).toEqual(expect.not.stringContaining(classNameForHidden));

            fireEvent.click(decInputElement);

            expect(decResult.className).toEqual(expect.not.stringContaining(classNameForHidden));
            expect(binResult.className).toEqual(expect.stringContaining(classNameForHidden));
        });

        test("ブロードキャストアドレスの初期表示およびラジオボタン操作による表示切替が適切であること。", () => {

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            const textContent = "Broadcast address";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            const decResult = element.nextElementSibling;
            Assertions.assertNotNull(decResult);
            const binResult = decResult.nextElementSibling;
            Assertions.assertNotNull(binResult);

            const classNameForHidden = "d-none d-md-block";

            expect(decResult.className).toEqual(expect.not.stringContaining(classNameForHidden));
            expect(binResult.className).toEqual(expect.stringContaining(classNameForHidden));

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");

            fireEvent.click(binInputElement);

            expect(decResult.className).toEqual(expect.stringContaining(classNameForHidden));
            expect(binResult.className).toEqual(expect.not.stringContaining(classNameForHidden));

            fireEvent.click(decInputElement);

            expect(decResult.className).toEqual(expect.not.stringContaining(classNameForHidden));
            expect(binResult.className).toEqual(expect.stringContaining(classNameForHidden));
        });

        test("利用可能範囲IPアドレスの初期表示およびラジオボタン操作による表示切替が適切であること。", () => {

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            const textContent = "Available range";
            const nodeList = container.querySelectorAll(selectorsOfSubheading);
            const element = getElementByTextContent(nodeList, textContent);

            Assertions.assertNotNull(element);
            const decFirst = element.nextElementSibling;
            Assertions.assertNotNull(decFirst);
            const binFirst = decFirst.nextElementSibling;
            Assertions.assertNotNull(binFirst);

            Assertions.assertNotNull(element.parentElement);
            const to = element.parentElement.nextElementSibling;
            Assertions.assertNotNull(to);
            const last = to.nextElementSibling;
            Assertions.assertNotNull(last);
            const decLast = last.children[0];
            const binLast = last.children[1];

            const classNameForHidden = "d-none d-md-block";

            expect(decFirst.className).toEqual(expect.not.stringContaining(classNameForHidden));
            expect(decLast.className).toEqual(expect.not.stringContaining(classNameForHidden));
            expect(binFirst.className).toEqual(expect.stringContaining(classNameForHidden));
            expect(binLast.className).toEqual(expect.stringContaining(classNameForHidden));

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");

            fireEvent.click(binInputElement);

            expect(decFirst.className).toEqual(expect.stringContaining(classNameForHidden));
            expect(decLast.className).toEqual(expect.stringContaining(classNameForHidden));
            expect(binFirst.className).toEqual(expect.not.stringContaining(classNameForHidden));
            expect(binLast.className).toEqual(expect.not.stringContaining(classNameForHidden));

            fireEvent.click(decInputElement);

            expect(decFirst.className).toEqual(expect.not.stringContaining(classNameForHidden));
            expect(decLast.className).toEqual(expect.not.stringContaining(classNameForHidden));
            expect(binFirst.className).toEqual(expect.stringContaining(classNameForHidden));
            expect(binLast.className).toEqual(expect.stringContaining(classNameForHidden));
        });
    });
});

function getElementByTextContent<E extends Element>(nodeList: NodeListOf<E>, textContent: string): E | undefined {
    return Array.from(nodeList)
                .filter(element => element.textContent != null)
                .find(element => element.textContent!.includes(textContent));
}

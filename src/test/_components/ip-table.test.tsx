import { IpTable } from "@/app/_components/ip-table";
import { Assertions } from "@/app/_lib/assertions";
import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { act, fireEvent, screen } from "@testing-library/react";
import { Root, createRoot } from "react-dom/client";

describe("IpTableコンポーネント", () => {

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

        test("アコーディオンヘッダに「Simple IP Address Table」が表示されること。", () => {

            const expected = "Simple IP Address Table";
            const accordionClassName = "accordion";
            const accordionHeaderClassName = "accordion-header";

            act(() => {
                root.render(<IpTable/>);
            });

            const accordionDivElement = container.getElementsByClassName(accordionClassName)[0];
            const accordionHeaderDivElement = accordionDivElement.getElementsByClassName(accordionHeaderClassName)[0];

            expect(accordionHeaderDivElement.textContent).toEqual(expect.stringContaining(expected));
        });

        test("IPアドレス表アコーディオン用ラジオボタンが表示されること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const ariaLabel = "ip-table Decimal and Binary radio toggle button group";
            const selector = `[aria-label="${ariaLabel}"]`;
            const radioDivElement = container.querySelector<HTMLDivElement>(selector);
            Assertions.assertNotNull(radioDivElement);

            const decLabelName = "DEC";
            expect(radioDivElement.textContent).toEqual(expect.stringContaining(decLabelName));
            const decInputElement = screen.getByLabelText<HTMLInputElement>(decLabelName);
            expect(decInputElement.tagName).toEqual("INPUT");
            expect(decInputElement.type).toEqual("radio");

            const binLabelName = "BIN";
            expect(radioDivElement.textContent).toEqual(expect.stringContaining(binLabelName));
            const binInputElement = screen.getByLabelText<HTMLInputElement>(binLabelName);
            expect(binInputElement.tagName).toEqual("INPUT");
            expect(binInputElement.type).toEqual("radio");
        });
    });

    describe("表示テキスト確認", () => {

        let expected: HTMLTableCellElement;

        let secondarySpan: HTMLSpanElement;
        let boldFontsSpan: HTMLSpanElement;
        let plainTextSpan: HTMLSpanElement;

        beforeEach(() => {
            expected = document.createElement("td");

            secondarySpan = document.createElement("span");
            boldFontsSpan = document.createElement("span");
            plainTextSpan = document.createElement("span");

            expected.className = "font-monospace";
            secondarySpan.className = "text-secondary";
            boldFontsSpan.className = "fw-bold";
        });

        afterEach(() => {
            plainTextSpan.remove();
            boldFontsSpan.remove();
            secondarySpan.remove();
            expected.remove();
        });

        test("クラスAパブリック前半2進数IPアドレスに、太字フォント及びセカンダリテキスト表示が適用されること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 0;
            expected.append(secondarySpan);
            expected.append(plainTextSpan);

            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");
            fireEvent.click(binInputElement);

            const tbody = container.getElementsByTagName("tbody")[0];
            const actualLast = tbody.children[tableRowNum].lastChild;
            const actualFirst = actualLast?.previousSibling?.previousSibling;

            boldFontsSpan.append("0");
            secondarySpan.append(boldFontsSpan, "0000001");
            plainTextSpan.append(".00000000.00000000.00000000");
            expect(actualFirst).toEqual(expected);

            boldFontsSpan.replaceChildren("0");
            secondarySpan.replaceChildren(boldFontsSpan, "0001001");
            plainTextSpan.replaceChildren(".11111111.11111111.11111111");
            expect(actualLast).toEqual(expected);
        });

        test("クラスAプライベート2進数IPアドレスに、太字フォント及びセカンダリテキスト表示が適用されること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 1;
            expected.append(secondarySpan);
            expected.append(plainTextSpan);

            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");
            fireEvent.click(binInputElement);

            const tbody = container.getElementsByTagName("tbody")[0];
            const actualLast = tbody.children[tableRowNum].lastChild;
            const actualFirst = actualLast?.previousSibling?.previousSibling;

            boldFontsSpan.append("0");
            secondarySpan.append(boldFontsSpan, "0001010");
            plainTextSpan.append(".00000000.00000000.00000000");
            expect(actualFirst).toEqual(expected);

            boldFontsSpan.replaceChildren("0");
            secondarySpan.replaceChildren(boldFontsSpan, "0001010");
            plainTextSpan.replaceChildren(".11111111.11111111.11111111");
            expect(actualLast).toEqual(expected);
        });

        test("クラスAパブリック後半2進数IPアドレスに、太字フォント及びセカンダリテキスト表示が適用されること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 2;
            expected.append(secondarySpan);
            expected.append(plainTextSpan);

            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");
            fireEvent.click(binInputElement);

            const tbody = container.getElementsByTagName("tbody")[0];
            const actualLast = tbody.children[tableRowNum].lastChild;
            const actualFirst = actualLast?.previousSibling?.previousSibling;

            boldFontsSpan.append("0");
            secondarySpan.append(boldFontsSpan, "0001011");
            plainTextSpan.append(".00000000.00000000.00000000");
            expect(actualFirst).toEqual(expected);

            boldFontsSpan.replaceChildren("0");
            secondarySpan.replaceChildren(boldFontsSpan, "1111110");
            plainTextSpan.replaceChildren(".11111111.11111111.11111111");
            expect(actualLast).toEqual(expected);
        });

        test("ローカルホスト2進数IPアドレスに、太字フォント及びセカンダリテキスト表示が適用されないこと。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 3;
            expected.append(secondarySpan);
            expected.append(plainTextSpan);

            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");
            fireEvent.click(binInputElement);

            const tbody = container.getElementsByTagName("tbody")[0];
            const actualLast = tbody.children[tableRowNum].lastChild;
            const actualFirst = actualLast?.previousSibling?.previousSibling;

            secondarySpan.append(boldFontsSpan);
            plainTextSpan.append("01111111.00000000.00000000.00000000");
            expect(actualFirst).toEqual(expected);

            secondarySpan.replaceChildren(boldFontsSpan);
            plainTextSpan.replaceChildren("01111111.11111111.11111111.11111111");
            expect(actualLast).toEqual(expected);
        });

        test("クラスBパブリック前半2進数IPアドレスに、太字フォント及びセカンダリテキスト表示が適用されること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 4;
            expected.append(secondarySpan);
            expected.append(plainTextSpan);

            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");
            fireEvent.click(binInputElement);

            const tbody = container.getElementsByTagName("tbody")[0];
            const actualLast = tbody.children[tableRowNum].lastChild;
            const actualFirst = actualLast?.previousSibling?.previousSibling;

            boldFontsSpan.append("10");
            secondarySpan.append(boldFontsSpan, "000000.00000000");
            plainTextSpan.append(".00000000.00000000");
            expect(actualFirst).toEqual(expected);

            boldFontsSpan.replaceChildren("10");
            secondarySpan.replaceChildren(boldFontsSpan, "101100.00001111");
            plainTextSpan.replaceChildren(".11111111.11111111");
            expect(actualLast).toEqual(expected);
        });

        test("クラスBプライベート2進数IPアドレスに、太字フォント及びセカンダリテキスト表示が適用されること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 5;
            expected.append(secondarySpan);
            expected.append(plainTextSpan);

            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");
            fireEvent.click(binInputElement);

            const tbody = container.getElementsByTagName("tbody")[0];
            const actualLast = tbody.children[tableRowNum].lastChild;
            const actualFirst = actualLast?.previousSibling?.previousSibling;

            boldFontsSpan.append("10");
            secondarySpan.append(boldFontsSpan, "101100.00010000");
            plainTextSpan.append(".00000000.00000000");
            expect(actualFirst).toEqual(expected);

            boldFontsSpan.replaceChildren("10");
            secondarySpan.replaceChildren(boldFontsSpan, "101100.00011111");
            plainTextSpan.replaceChildren(".11111111.11111111");
            expect(actualLast).toEqual(expected);
        });

        test("クラスBパブリック後半2進数IPアドレスに、太字フォント及びセカンダリテキスト表示が適用されること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 6;
            expected.append(secondarySpan);
            expected.append(plainTextSpan);

            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");
            fireEvent.click(binInputElement);

            const tbody = container.getElementsByTagName("tbody")[0];
            const actualLast = tbody.children[tableRowNum].lastChild;
            const actualFirst = actualLast?.previousSibling?.previousSibling;

            boldFontsSpan.append("10");
            secondarySpan.append(boldFontsSpan, "101100.00100000");
            plainTextSpan.append(".00000000.00000000");
            expect(actualFirst).toEqual(expected);

            boldFontsSpan.replaceChildren("10");
            secondarySpan.replaceChildren(boldFontsSpan, "111111.11111111");
            plainTextSpan.replaceChildren(".11111111.11111111");
            expect(actualLast).toEqual(expected);
        });

        test("クラスCパブリック前半2進数IPアドレスに、太字フォント及びセカンダリテキスト表示が適用されること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 7;
            expected.append(secondarySpan);
            expected.append(plainTextSpan);

            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");
            fireEvent.click(binInputElement);

            const tbody = container.getElementsByTagName("tbody")[0];
            const actualLast = tbody.children[tableRowNum].lastChild;
            const actualFirst = actualLast?.previousSibling?.previousSibling;

            boldFontsSpan.append("110");
            secondarySpan.append(boldFontsSpan, "00000.00000000.00000000");
            plainTextSpan.append(".00000000");
            expect(actualFirst).toEqual(expected);

            boldFontsSpan.replaceChildren("110");
            secondarySpan.replaceChildren(boldFontsSpan, "00000.10100111.11111111");
            plainTextSpan.replaceChildren(".11111111");
            expect(actualLast).toEqual(expected);
        });

        test("クラスCプライベート2進数IPアドレスに、太字フォント及びセカンダリテキスト表示が適用されること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 8;
            expected.append(secondarySpan);
            expected.append(plainTextSpan);

            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");
            fireEvent.click(binInputElement);

            const tbody = container.getElementsByTagName("tbody")[0];
            const actualLast = tbody.children[tableRowNum].lastChild;
            const actualFirst = actualLast?.previousSibling?.previousSibling;

            boldFontsSpan.append("110");
            secondarySpan.append(boldFontsSpan, "00000.10101000.00000000");
            plainTextSpan.append(".00000000");
            expect(actualFirst).toEqual(expected);

            boldFontsSpan.replaceChildren("110");
            secondarySpan.replaceChildren(boldFontsSpan, "00000.10101000.11111111");
            plainTextSpan.replaceChildren(".11111111");
            expect(actualLast).toEqual(expected);
        });

        test("クラスCパブリック後半2進数IPアドレスに、太字フォント及びセカンダリテキスト表示が適用されること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 9;
            expected.append(secondarySpan);
            expected.append(plainTextSpan);

            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");
            fireEvent.click(binInputElement);

            const tbody = container.getElementsByTagName("tbody")[0];
            const actualLast = tbody.children[tableRowNum].lastChild;
            const actualFirst = actualLast?.previousSibling?.previousSibling;

            boldFontsSpan.append("110");
            secondarySpan.append(boldFontsSpan, "00000.10101001.00000000");
            plainTextSpan.append(".00000000");
            expect(actualFirst).toEqual(expected);

            boldFontsSpan.replaceChildren("110");
            secondarySpan.replaceChildren(boldFontsSpan, "11111.11111111.11111111");
            plainTextSpan.replaceChildren(".11111111");
            expect(actualLast).toEqual(expected);
        });
    });

    describe("ラジオボタン切替動作確認", () => {

        test("クラスAパブリックIP前半行の、初期表示およびラジオボタン切替後表示が適切であること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 0;
            const decExpected = "Class A"
                        .concat("Public")
                        .concat("1.0.0.0")
                        .concat("-")
                        .concat("9.255.255.255");
            const binExpected = "Class A"
                        .concat("Public")
                        .concat("00000001.00000000.00000000.00000000")
                        .concat("-")
                        .concat("00001001.11111111.11111111.11111111");

            const tbody = container.getElementsByTagName("tbody")[0];
            let actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");

            fireEvent.click(binInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(binExpected);

            fireEvent.click(decInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);
        });

        test("クラスAプライベートIP行の、初期表示およびラジオボタン切替後表示が適切であること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 1;
            const decExpected = "Private"
                        .concat("10.0.0.0")
                        .concat("-")
                        .concat("10.255.255.255");
            const binExpected = "Private"
                        .concat("00001010.00000000.00000000.00000000")
                        .concat("-")
                        .concat("00001010.11111111.11111111.11111111");

            const tbody = container.getElementsByTagName("tbody")[0];
            let actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");

            fireEvent.click(binInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(binExpected);

            fireEvent.click(decInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);
        });

        test("クラスAパブリックIP後半行の、初期表示およびラジオボタン切替後表示が適切であること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 2;
            const decExpected = "Public"
                        .concat("11.0.0.0")
                        .concat("-")
                        .concat("126.255.255.255");
            const binExpected = "Public"
                        .concat("00001011.00000000.00000000.00000000")
                        .concat("-")
                        .concat("01111110.11111111.11111111.11111111");

            const tbody = container.getElementsByTagName("tbody")[0];
            let actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");

            fireEvent.click(binInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(binExpected);

            fireEvent.click(decInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);
        });

        test("ローカルホスト行の、初期表示およびラジオボタン切替後表示が適切であること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 3;
            const decExpected = "localhost"
                        .concat("127.0.0.0")
                        .concat("-")
                        .concat("127.255.255.255");
            const binExpected = "localhost"
                        .concat("01111111.00000000.00000000.00000000")
                        .concat("-")
                        .concat("01111111.11111111.11111111.11111111");

            const tbody = container.getElementsByTagName("tbody")[0];
            let actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");

            fireEvent.click(binInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(binExpected);

            fireEvent.click(decInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);
        });

        test("クラスBパブリックIP前半行の、初期表示およびラジオボタン切替後表示が適切であること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 4;
            const decExpected = "Class B"
                        .concat("Public")
                        .concat("128.0.0.0")
                        .concat("-")
                        .concat("172.15.255.255");
            const binExpected = "Class B"
                        .concat("Public")
                        .concat("10000000.00000000.00000000.00000000")
                        .concat("-")
                        .concat("10101100.00001111.11111111.11111111");

            const tbody = container.getElementsByTagName("tbody")[0];
            let actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");

            fireEvent.click(binInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(binExpected);

            fireEvent.click(decInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);
        });

        test("クラスBプライベートIP行の、初期表示およびラジオボタン切替後表示が適切であること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 5;
            const decExpected = "Private"
                        .concat("172.16.0.0")
                        .concat("-")
                        .concat("172.31.255.255");
            const binExpected = "Private"
                        .concat("10101100.00010000.00000000.00000000")
                        .concat("-")
                        .concat("10101100.00011111.11111111.11111111");

            const tbody = container.getElementsByTagName("tbody")[0];
            let actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");

            fireEvent.click(binInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(binExpected);

            fireEvent.click(decInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);
        });

        test("クラスBパブリックIP後半行の、初期表示およびラジオボタン切替後表示が適切であること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 6;
            const decExpected = "Public"
                        .concat("172.32.0.0")
                        .concat("-")
                        .concat("191.255.255.255");
            const binExpected = "Public"
                        .concat("10101100.00100000.00000000.00000000")
                        .concat("-")
                        .concat("10111111.11111111.11111111.11111111");

            const tbody = container.getElementsByTagName("tbody")[0];
            let actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");

            fireEvent.click(binInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(binExpected);

            fireEvent.click(decInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);
        });

        test("クラスCパブリックIP前半行の、初期表示およびラジオボタン切替後表示が適切であること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 7;
            const decExpected = "Class C"
                        .concat("Public")
                        .concat("192.0.0.0")
                        .concat("-")
                        .concat("192.167.255.255");
            const binExpected = "Class C"
                        .concat("Public")
                        .concat("11000000.00000000.00000000.00000000")
                        .concat("-")
                        .concat("11000000.10100111.11111111.11111111");

            const tbody = container.getElementsByTagName("tbody")[0];
            let actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");

            fireEvent.click(binInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(binExpected);

            fireEvent.click(decInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);
        });

        test("クラスCプライベートIP行の、初期表示およびラジオボタン切替後表示が適切であること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 8;
            const decExpected = "Private"
                        .concat("192.168.0.0")
                        .concat("-")
                        .concat("192.168.255.255");
            const binExpected = "Private"
                        .concat("11000000.10101000.00000000.00000000")
                        .concat("-")
                        .concat("11000000.10101000.11111111.11111111");

            const tbody = container.getElementsByTagName("tbody")[0];
            let actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");

            fireEvent.click(binInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(binExpected);

            fireEvent.click(decInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);
        });

        test("クラスCパブリックIP後半行の、初期表示およびラジオボタン切替後表示が適切であること。", () => {

            act(() => {
                root.render(<IpTable/>);
            });

            const tableRowNum = 9;
            const decExpected = "Public"
                        .concat("192.169.0.0")
                        .concat("-")
                        .concat("223.255.255.255");
            const binExpected = "Public"
                        .concat("11000000.10101001.00000000.00000000")
                        .concat("-")
                        .concat("11011111.11111111.11111111.11111111");

            const tbody = container.getElementsByTagName("tbody")[0];
            let actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");

            fireEvent.click(binInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(binExpected);

            fireEvent.click(decInputElement);
            actual = tbody.children[tableRowNum].textContent;
            expect(actual).toEqual(decExpected);
        });
    });
});

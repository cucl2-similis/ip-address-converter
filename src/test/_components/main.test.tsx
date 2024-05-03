import { IpAddressConverter } from "@/app/_components/main";
import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { act } from "@testing-library/react";
import { Root, createRoot } from "react-dom/client";

describe("IpAddressConverterコンポーネント", () => {

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

        test("見出し「IP Address Converter」が表示されること。", () => {

            act(() => {
                root.render(<IpAddressConverter/>);
            });

            expect(container.textContent).toEqual(expect.stringContaining("IP Address Converter"));
        });
    });

    describe("ページ構成確認", () => {

        test("トップレベル要素が、属性をcontainerクラスとする単一のdiv要素であること。", () => {

            act(() => {
                root.render(<IpAddressConverter/>);
            });

            expect(container.children).toHaveLength(1);
            const topElement = container.children[0];
            expect(topElement).toBeInstanceOf(HTMLDivElement);
            const divElement = topElement as HTMLDivElement;
            expect(divElement.className).toEqual("container");
        });

        test("子コンポーネント<Form/>の見出し「Form」が表示されること。", () => {

            act(() => {
                root.render(<IpAddressConverter/>);
            });

            expect(container.textContent).toEqual(expect.stringContaining("Form"));
        });

        test("子コンポーネント<Result/>の見出し「Result」が表示されること。", () => {

            act(() => {
                root.render(<IpAddressConverter/>);
            });

            expect(container.textContent).toEqual(expect.stringContaining("Result"));
        });

        test("子コンポーネント<IpTable/>の見出し「Simple IP Address Table」が表示されること。", () => {

            act(() => {
                root.render(<IpAddressConverter/>);
            });

            expect(container.textContent).toEqual(expect.stringContaining("Simple IP Address Table"));
        });
    });
});

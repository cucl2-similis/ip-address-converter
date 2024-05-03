import { BinSpan } from "@/app/_components/bin-span";
import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { act } from "@testing-library/react";
import { Root, createRoot } from "react-dom/client";

describe("BinSpanコンポーネント", () => {

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

    describe("表示テキスト確認", () => {

        let expectedContainer: HTMLDivElement;

        let secondarySpan: HTMLSpanElement;
        let boldFontsSpan: HTMLSpanElement;
        let plainTextSpan: HTMLSpanElement;

        beforeEach(() => {
            expectedContainer = document.createElement("div");

            secondarySpan = document.createElement("span");
            boldFontsSpan = document.createElement("span");
            plainTextSpan = document.createElement("span");

            secondarySpan.className = "text-secondary";
            boldFontsSpan.className = "fw-bold";
        });

        afterEach(() => {
            plainTextSpan.remove();
            boldFontsSpan.remove();
            secondarySpan.remove();
            expectedContainer.remove();
        });

        test("インデックスに0が指定された場合、太字フォント及びセカンダリテキスト表示が適用されないこと。", () => {

            const binIpAddress = "11000000.10101000.00001010.00000001";
            const endIndexForBold = 0;
            const endIndexForSecondary = 0;

            act(() => {
                root.render(<BinSpan binIpAddress={binIpAddress} endIndexForBold={endIndexForBold} endIndexForSecondary={endIndexForSecondary} />);
            });

            secondarySpan.append(boldFontsSpan);
            plainTextSpan.append(binIpAddress);

            expectedContainer.append(secondarySpan);
            expectedContainer.append(plainTextSpan);

            expect(container).toEqual(expectedContainer);
        });

        test("指定されたインデックスに応じて、セカンダリテキスト表示が適用されること。", () => {

            const binIpAddress = "11000000.10101000.00001010.00000001";
            const endIndexForBold = 0;
            const endIndexForSecondary = 24 + 2;

            act(() => {
                root.render(<BinSpan binIpAddress={binIpAddress} endIndexForBold={endIndexForBold} endIndexForSecondary={endIndexForSecondary} />);
            });

            secondarySpan.append(boldFontsSpan);
            secondarySpan.append("11000000.10101000.00001010");
            plainTextSpan.append(".00000001");

            expectedContainer.append(secondarySpan);
            expectedContainer.append(plainTextSpan);

            expect(container).toEqual(expectedContainer);
        });

        test("指定されたインデックスに応じて、太字フォント及びセカンダリテキスト表示が適用されること。", () => {

            const binIpAddress = "11000000.10101000.00001010.00000001";
            const endIndexForBold = 3;
            const endIndexForSecondary = 24 + 2;

            act(() => {
                root.render(<BinSpan binIpAddress={binIpAddress} endIndexForBold={endIndexForBold} endIndexForSecondary={endIndexForSecondary} />);
            });

            secondarySpan.append(boldFontsSpan);
            boldFontsSpan.append("110");
            secondarySpan.append("00000.10101000.00001010");
            plainTextSpan.append(".00000001");

            expectedContainer.append(secondarySpan);
            expectedContainer.append(plainTextSpan);

            expect(container).toEqual(expectedContainer);
        });
    });
});

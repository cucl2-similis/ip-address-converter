import { BinInfo } from "@/app/_components/bin-info";
import { Builder } from "@/app/_lib/builder";
import { Radio } from "@/app/_lib/const";
import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { act } from "@testing-library/react";
import { Root, createRoot } from "react-dom/client";

describe("BinInfoコンポーネント", () => {

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

        let expectedContainer: HTMLDivElement;

        let binaryInfoDiv: HTMLDivElement;
        let secondarySpan: HTMLSpanElement;
        let boldFontsSpan: HTMLSpanElement;
        let plainTextSpan: HTMLSpanElement;

        beforeEach(() => {
            expectedContainer = document.createElement("div");

            binaryInfoDiv = document.createElement("div");
            secondarySpan = document.createElement("span");
            boldFontsSpan = document.createElement("span");
            plainTextSpan = document.createElement("span");

            binaryInfoDiv.className = "col-md-6 col-lg-8 font-monospace";
            secondarySpan.className = "text-secondary";
            boldFontsSpan.className = "fw-bold";

            expectedContainer.append(binaryInfoDiv);
        });

        afterEach(() => {
            plainTextSpan.remove();
            boldFontsSpan.remove();
            secondarySpan.remove();
            binaryInfoDiv.remove();
            expectedContainer.remove();
        });

        test("変換結果DTO未設定の場合、2進数情報が初期表示であること。", () => {

            act(() => {
                root.render(<BinInfo radio={Radio.BIN} resultDto={null} getBinInfoFrom={resultDto => ""} />);
            });

            expect(container.textContent).toEqual(expect.stringContaining("--------.--------.--------.--------"));
        });

        test("変換結果DTO設定済の場合、2進数情報取得関数によって返却された値が表示されること。", () => {

            const resultDto = Builder.ofResultDto().build();
            const expected = "11000000.10101000.00001010.00000001";

            act(() => {
                root.render(<BinInfo radio={Radio.BIN} resultDto={resultDto} getBinInfoFrom={resultDto => expected} />);
            });

            expect(container.textContent).toEqual(expect.stringContaining(expected));
        });

        test("変換結果DTO設定済の場合、オクテットを区切る2進数サブネットマスクに対応したセカンダリテキスト表示が適用されること。", () => {

            const resultDto = Builder.ofResultDto()
                                     .binSubnetMaskArray(["11111111", "11111111", "11111111", "00000000"])
                                     .build();
            const binInfoStr = "11000000.10101000.00001010.00000001";

            act(() => {
                root.render(<BinInfo radio={Radio.BIN} resultDto={resultDto} getBinInfoFrom={resultDto => binInfoStr} />);
            });

            secondarySpan.append(boldFontsSpan);
            secondarySpan.append("11000000.10101000.00001010");
            plainTextSpan.append(".00000001");

            binaryInfoDiv.append(secondarySpan);
            binaryInfoDiv.append(plainTextSpan);

            expect(container).toEqual(expectedContainer);
        });

        test("変換結果DTO設定済の場合、オクテットをまたぐ2進数サブネットマスクに対応したセカンダリテキスト表示が適用されること。", () => {

            const resultDto = Builder.ofResultDto()
                                     .binSubnetMaskArray(["11111111", "11111111", "11110000", "00000000"])
                                     .build();
            const binInfoStr = "11000000.10101000.00001010.00000001";

            act(() => {
                root.render(<BinInfo radio={Radio.BIN} resultDto={resultDto} getBinInfoFrom={resultDto => binInfoStr} />);
            });

            secondarySpan.append(boldFontsSpan);
            secondarySpan.append("11000000.10101000.0000");
            plainTextSpan.append("1010.00000001");

            binaryInfoDiv.append(secondarySpan);
            binaryInfoDiv.append(plainTextSpan);

            expect(container).toEqual(expectedContainer);
        });

        test("太字フォント適用文字列終了インデックス取得関数が設定された場合、表示される2進数情報に太字フォントが適用されること。", () => {

            const resultDto = Builder.ofResultDto()
                                     .binSubnetMaskArray(["11111111", "11111111", "11111111", "00000000"])
                                     .build();
            const binInfoStr = "11000000.10101000.00001010.00000001";
            const endIndexForBold = 3;

            act(() => {
                root.render(<BinInfo radio={Radio.BIN} resultDto={resultDto} getBinInfoFrom={resultDto => binInfoStr} getEndIndexForBoldFrom={resultDto => endIndexForBold} />);
            });

            secondarySpan.append(boldFontsSpan);
            boldFontsSpan.append("110");
            secondarySpan.append("00000.10101000.00001010");
            plainTextSpan.append(".00000001");

            binaryInfoDiv.append(secondarySpan);
            binaryInfoDiv.append(plainTextSpan);

            expect(container).toEqual(expectedContainer);
        });
    });

    describe("ラジオボタン切替動作確認", () => {

        test("項目「2進数」が選択された場合、非表示とならないこと。", () => {

            const resultDto = Builder.ofResultDto().build();
            act(() => {
                root.render(<BinInfo radio={Radio.BIN} resultDto={resultDto} getBinInfoFrom={resultDto => ""} />);
            });

            const binInfoDivElement = container.children[0];
            expect(binInfoDivElement.className).toEqual(expect.not.stringContaining("d-none d-md-block"));
        });

        test("項目「10進数」が選択された場合、非表示となること。", () => {

            const resultDto = Builder.ofResultDto().build();

            act(() => {
                root.render(<BinInfo radio={Radio.DEC} resultDto={resultDto} getBinInfoFrom={resultDto => ""} />);
            });

            const binInfoDivElement = container.children[0];
            expect(binInfoDivElement.className).toEqual(expect.stringContaining("d-none d-md-block"));
        });
    });
});

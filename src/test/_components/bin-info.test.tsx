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

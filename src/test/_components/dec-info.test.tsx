import { DecInfo } from "@/app/_components/dec-info";
import { Builder } from "@/app/_lib/builder";
import { Radio } from "@/app/_lib/const";
import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { act } from "@testing-library/react";
import { Root, createRoot } from "react-dom/client";

describe("DecInfoコンポーネント", () => {

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

        test("変換結果DTO未設定の場合、10進数情報が初期表示であること。", () => {

            act(() => {
                root.render(<DecInfo radio={Radio.DEC} resultDto={null} getDecInfoFrom={resultDto => ""} />);
            });

            expect(container.textContent).toEqual(expect.stringContaining("---.---.---.---"));
        });

        test("変換結果DTO設定済の場合、10進数情報取得関数によって返却された値が表示されること。", () => {

            const resultDto = Builder.ofResultDto().build();
            const expected = "192.168.10.1";

            act(() => {
                root.render(<DecInfo radio={Radio.DEC} resultDto={resultDto} getDecInfoFrom={resultDto => expected} />);
            });

            expect(container.textContent).toEqual(expect.stringContaining(expected));
        });

        test("オプションclass属性が設定された場合、class属性が追加されること。", () => {

            const expected = "expectedOptionalClass";

            act(() => {
                root.render(<DecInfo radio={Radio.DEC} resultDto={null} getDecInfoFrom={resultDto => ""} optionalClass={expected} />);
            });

            const decInfoDivElement = container.children[0];
            expect(decInfoDivElement.className).toEqual(expect.stringContaining(expected));
        });
    });

    describe("ラジオボタン切替動作確認", () => {

        test("項目「10進数」が選択された場合、非表示とならないこと。", () => {

            const resultDto = Builder.ofResultDto().build();
            act(() => {
                root.render(<DecInfo radio={Radio.DEC} resultDto={resultDto} getDecInfoFrom={resultDto => ""} />);
            });

            const decInfoDivElement = container.children[0];
            expect(decInfoDivElement.className).toEqual(expect.not.stringContaining("d-none d-md-block"));
        });

        test("項目「2進数」が選択された場合、非表示となること。", () => {

            const resultDto = Builder.ofResultDto().build();

            act(() => {
                root.render(<DecInfo radio={Radio.BIN} resultDto={resultDto} getDecInfoFrom={resultDto => ""} />);
            });

            const decInfoDivElement = container.children[0];
            expect(decInfoDivElement.className).toEqual(expect.stringContaining("d-none d-md-block"));
        });
    });
});

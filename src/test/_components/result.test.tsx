import { Result } from "@/app/_components/result";
import { ResultDto } from "@/app/_lib/result-dto";
import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { act } from "@testing-library/react";
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
    });

    describe("動的表示確認", () => {

        test("変換結果DTOが設定されない場合、10進数IPアドレスが初期表示であること。", () => {

            act(() => {
                root.render(<Result resultDto={null} />);
            });

            expect(container.textContent).toEqual(expect.stringContaining("---.---.---.---"));
        });

        test("変換結果DTOに10進数IPアドレス配列が設定された場合、設定したIP文字列が表示されること。", () => {

            const resultDto = new ResultDto();
            resultDto.setDecIpAddressArray([192, 168, 10, 1]);

            act(() => {
                root.render(<Result resultDto={resultDto} />);
            });

            expect(container.textContent).toEqual(expect.stringContaining("192.168.10.1"));
            expect(container.textContent).toEqual(expect.not.stringContaining("---.---.---.---"));
        });
    });
});

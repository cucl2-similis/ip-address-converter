import { RadioButton } from "@/app/_components/radio-button";
import { Radio } from "@/app/_lib/const";
import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { act, fireEvent, screen } from "@testing-library/react";
import { Root, createRoot } from "react-dom/client";

describe("RadioButtonコンポーネント", () => {

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

        test("ラベル「DEC」「BIN」と、対応するラジオボタンが表示されること。", () => {

            const prefix = "test";
            const radio = Radio.DEC;
            const setRadio = jest.fn();
            act(() => {
                root.render(<RadioButton prefix={prefix} radio={radio} setRadio={setRadio} />);
            });

            const decLabelName = "DEC";
            expect(container.textContent).toEqual(expect.stringContaining(decLabelName));
            const decInputElement = screen.getByLabelText<HTMLInputElement>(decLabelName);
            expect(decInputElement.tagName).toEqual("INPUT");
            expect(decInputElement.type).toEqual("radio");

            const binLabelName = "BIN";
            expect(container.textContent).toEqual(expect.stringContaining(binLabelName));
            const binInputElement = screen.getByLabelText<HTMLInputElement>(binLabelName);
            expect(binInputElement.tagName).toEqual("INPUT");
            expect(binInputElement.type).toEqual("radio");
        });

        test("オプションclass属性が設定された場合、class属性が追加されること。", () => {

            const expected = "expectedOptionalClass";
            const prefix = "test";
            const radio = Radio.DEC;
            const setRadio = jest.fn();

            act(() => {
                root.render(<RadioButton prefix={prefix} radio={radio} setRadio={setRadio} optionalClass={expected} />);
            });

            const radioDivElement = container.children[0];
            expect(radioDivElement.className).toEqual(expect.stringContaining(expected));
        });

        test("ラジオボタングループ識別用接頭辞が適切に付加されること。", () => {

            const expected = "expectedPrefix";
            const radio = Radio.DEC;
            const setRadio = jest.fn();

            act(() => {
                root.render(<RadioButton prefix={expected} radio={radio} setRadio={setRadio} />);
            });

            const radioDivElement = container.children[0];
            expect(radioDivElement.getAttribute("aria-label")).toEqual(expected + " Decimal and Binary radio toggle button group");

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            expect(decInputElement.name).toEqual(expected + "-btn-radio");
            expect(decInputElement.id).toEqual(expected + "-btn-radio-dec");

            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");
            expect(binInputElement.name).toEqual(expected + "-btn-radio");
            expect(binInputElement.id).toEqual(expected + "-btn-radio-bin");
        });
    });

    describe("切替動作確認", () => {

        test("ラジオボタン切り替え時、stateセッタ関数に正しいラジオボタン選択肢が渡されること。", () => {

            const prefix = "test";
            const radio = Radio.DEC;
            const setRadio = jest.fn();
            act(() => {
                root.render(<RadioButton prefix={prefix} radio={radio} setRadio={setRadio} />);
            });

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");

            fireEvent.click(binInputElement);
            decInputElement.checked = !decInputElement.checked;
            binInputElement.checked = !binInputElement.checked;

            expect(setRadio).toHaveBeenCalledTimes(1);
            expect(setRadio).toHaveBeenCalledWith(Radio.BIN);

            fireEvent.click(decInputElement);
            decInputElement.checked = !decInputElement.checked;
            binInputElement.checked = !binInputElement.checked;

            expect(setRadio).toHaveBeenCalledTimes(2);
            expect(setRadio).toHaveBeenCalledWith(Radio.DEC);
        });

        test("引数のstate変数が項目「10進数」の場合、ラジオボタンの選択肢「DEC」が選択されること。", () => {

            const prefix = "test";
            const radio = Radio.DEC;
            const setRadio = jest.fn();
            act(() => {
                root.render(<RadioButton prefix={prefix} radio={radio} setRadio={setRadio} />);
            });

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");

            expect(decInputElement.checked).toEqual(true);
            expect(binInputElement.checked).toEqual(false);
        });

        test("引数のstate変数が項目「2進数」の場合、ラジオボタンの選択肢「BIN」が選択されること。", () => {

            const prefix = "test";
            const radio = Radio.BIN;
            const setRadio = jest.fn();
            act(() => {
                root.render(<RadioButton prefix={prefix} radio={radio} setRadio={setRadio} />);
            });

            const decInputElement = screen.getByLabelText<HTMLInputElement>("DEC");
            const binInputElement = screen.getByLabelText<HTMLInputElement>("BIN");

            expect(decInputElement.checked).toEqual(false);
            expect(binInputElement.checked).toEqual(true);
        });
    });
});

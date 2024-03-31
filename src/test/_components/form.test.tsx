import { Form } from "@/app/_components/form";
import { ResultDto } from "@/app/_lib/result-dto";
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

        test("ラベル「IP Address / CIDR」と、対応するテキストボックスが表示されること。", () => {

            const setResultDto = jest.fn();
            act(() => {
                root.render(<Form setResultDto={setResultDto} />);
            });

            const labelName = "IP Address / CIDR";
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

            const inputElement = screen.getByLabelText<HTMLInputElement>("IP Address / CIDR");
            inputElement.value = "192.168.10.1/24";

            const buttonElement = screen.getByRole("button", {name: "Convert"});
            fireEvent.click(buttonElement);

            expect(setResultDto).toHaveBeenCalledTimes(1);

            const resultDto = new ResultDto();
            resultDto.setDecIpAddressArray([192, 168, 10, 1]);
            resultDto.setCidr(24)
            expect(setResultDto).toHaveBeenCalledWith(resultDto);
        });
    });
});

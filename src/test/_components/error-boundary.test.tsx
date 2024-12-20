import { EventHandlerErrorBoundary, EventHandlerErrorPublisher } from "@/app/_components/error-boundary";
import { InvalidCallError } from "@/app/_lib/errors";
import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { act, fireEvent, screen } from "@testing-library/react";
import os from "os";
import { Root, createRoot } from "react-dom/client";

// useState関数が [null, null] を返却するようreactモジュールをモック化
jest.mock("react", () => {
    const originalModule = jest.requireActual<typeof import("react")>("react");
    return {
        __esModule: true,
        ...originalModule,
        useState: () => [null, null]
    };
});

describe("EventHandlerErrorBoundaryコンポーネント", () => {

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

    describe("例外送出処理確認", () => {

        const actualModule = jest.requireActual<typeof import("react")>("react");
        const mockedModule = jest.requireMock<typeof import("react")>("react");
        const useStateMock = mockedModule.useState;

        /*
         * テストの独立性を保つためEventHandlerErrorBrokerクラスのstaticフィールドを初期化
         * 
         * EventHandlerErrorBrokerクラスはエクスポートされておらず直接操作できないため
         * EventHandlerErrorBoundary内部で設定されているuseState関数の戻り値をモックにすることで対応する
         */
        beforeEach(() => {

            // useStateを[null, null]を返却するモック関数に変更する
            mockedModule.useState = useStateMock;

            // EventHandlerErrorBoundaryを呼び出して
            // 内部でモックしたuseStateを利用させることにより
            // EventHandlerErrorBrokerのstaticフィールドをnullで初期化する
            act(() => {
                root.render(
                    <EventHandlerErrorBoundary>
                        <></>
                    </EventHandlerErrorBoundary>
                );
            });

            // useStateを実際のreactモジュールの関数に戻す
            mockedModule.useState = actualModule.useState;
        });

        test("ラップされたイベントハンドラが正常終了した場合、例外が送出されないこと。", () => {

            const handleClick = jest.fn();

            act(() => {
                root.render(
                    <EventHandlerErrorBoundary>
                        <button onClick={EventHandlerErrorPublisher.wrap(handleClick)}>Button</button>
                    </EventHandlerErrorBoundary>
                );
            });

            expect(handleClick).not.toThrow();

            expect(() => {
                const buttonElement = screen.getByRole("button", {name: "Button"});
                fireEvent.click(buttonElement);
            }).not.toThrow();

            expect(handleClick).toHaveBeenCalled();
        });

        test("ラップされたイベントハンドラ内でエラーが発生した場合、境界コンポーネントから再送出されること。", () => {

            const handleClick = jest.fn(() => {throw new Error("EventHandlerError")});

            act(() => {
                root.render(
                    <EventHandlerErrorBoundary>
                        <button onClick={EventHandlerErrorPublisher.wrap(handleClick)}>Button</button>
                    </EventHandlerErrorBoundary>
                );
            });

            // EventHandlerErrorBoundaryから再送出されるエラーによって
            // 発生するコンポーネントエラーのログ出力を一時的に抑制
            const consoleErrorBackup = console.error;
            console.error = () => {};

            expect(handleClick).toThrow("EventHandlerError");

            expect(() => {
                const buttonElement = screen.getByRole("button", {name: "Button"});
                fireEvent.click(buttonElement);
            }).toThrow("EventHandlerError");

            expect(handleClick).toHaveBeenCalled();

            // エラーログ出力関数を元に戻す
            console.error = consoleErrorBackup;
        });

        test("境界コンポーネントが使用されていない場合、無効呼出エラーが送出されること。", () => {

            const handleClick = jest.fn(() => {throw new Error("EventHandlerError")});
            const handleClickWrapper = EventHandlerErrorPublisher.wrap(handleClick);

            act(() => {
                root.render(
                    <button onClick={() => {
                        try {
                            handleClickWrapper();
                        } catch (error) {
                            expect(error).toBeInstanceOf(InvalidCallError);
                            const invalidCallError = error as InvalidCallError;
                            expect(invalidCallError.message).toEqual("'EventHandlerErrorBroker.setError' is null."
                                                                   + os.EOL
                                                                   + "'EventHandlerErrorBoundary' might not wrap components."
                                                                   + os.EOL
                                                                   + "'EventHandlerErrorPublisher' must be called in wrapped components.");
                            return;
                        }
                        throw new Error("No error was thrown.");
                    }}>Button</button>
                );
            });

            expect(handleClick).toThrow("EventHandlerError");

            const buttonElement = screen.getByRole("button", {name: "Button"});
            fireEvent.click(buttonElement);

            expect(handleClick).toHaveBeenCalled();
        });
    });
});

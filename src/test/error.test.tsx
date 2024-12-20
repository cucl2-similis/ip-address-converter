import { AssertionError } from "@/app/_lib/errors";
import Error from "@/app/error";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { act, fireEvent, screen } from "@testing-library/react";
import { Root, createRoot } from "react-dom/client";

describe("Errorコンポーネント", () => {

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

        test("アイコンbi-exclamation-triangleが表示されること。", () => {

            const error = new AssertionError("ErrorTest");
            const reset = jest.fn();
            act(() => {
                root.render(<Error error={error} reset={reset} />);
            });

            const icon = container.querySelector("i");
            expect(icon).not.toBeNull();
            expect(icon?.className).not.toBeNull();
            expect(icon?.className).toEqual(expect.stringContaining("bi-exclamation-triangle"));
            expect(icon?.className).toEqual(expect.stringContaining("text-warning"));
        });

        test("メッセージ「Something went wrong.」が表示されること。", () => {

            const error = new AssertionError("ErrorTest");
            const reset = jest.fn();
            act(() => {
                root.render(<Error error={error} reset={reset} />);
            });

            const h1Element = screen.getByRole("heading", {level: 1});
            expect(h1Element.textContent).toEqual("Something went wrong.");
        });

        test("ボタン「Retry」が表示されること。", () => {

            const error = new AssertionError("ErrorTest");
            const reset = jest.fn();
            act(() => {
                root.render(<Error error={error} reset={reset} />);
            });

            const buttonElement = screen.getByRole("button", {name: "Retry"});
            expect(buttonElement).toBeDefined();
        });

        test("ボタン「Reload」が表示されること。", () => {

            const error = new AssertionError("ErrorTest");
            const reset = jest.fn();
            act(() => {
                root.render(<Error error={error} reset={reset} />);
            });

            const buttonElement = screen.getByRole("button", {name: "Reload"});
            expect(buttonElement).toBeDefined();
        });
    });

    describe("Retryボタン動作確認", () => {

        test("Retryボタン押下によりreset関数が呼び出されること。", () => {

            const error = new AssertionError("ErrorTest");
            const reset = jest.fn();
            act(() => {
                root.render(<Error error={error} reset={reset} />);
            });

            const buttonElement = screen.getByRole("button", {name: "Retry"});
            fireEvent.click(buttonElement);

            expect(reset).toHaveBeenCalled();
        });
    });

    describe("Reloadボタン動作確認", () => {

        const origin = window.location;
        const object = { reload: jest.fn() };
        beforeAll(() => {
            Object.defineProperty(window, "location", { configurable: true, value: object });
        });
        afterAll(() => {
            Object.defineProperty(window, "location", { configurable: true, value: origin });
        });

        test("Reloadボタン押下によりwindow.location.reload()が呼び出されること。", () => {

            const error = new AssertionError("ErrorTest");
            const reset = jest.fn();
            act(() => {
                root.render(<Error error={error} reset={reset} />);
            });

            const buttonElement = screen.getByRole("button", {name: "Reload"});
            fireEvent.click(buttonElement);

            expect(window.location.reload).toHaveBeenCalled();
        });
    });
});

import { Subheading } from "@/app/_components/subheading";
import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { act } from "@testing-library/react";
import { Root, createRoot } from "react-dom/client";

describe("Subheadingコンポーネント", () => {

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

    describe("HTML要素出力確認", () => {

        test("属性と内容が正しく出力されること。", () => {

            act(() => {
                root.render(<Subheading>TestSubheading</Subheading>);
            });

            const expected = document.createElement("div");
            expected.className = "col-md-3 col-lg-2 fw-bold text-md-end";
            expected.textContent = "TestSubheading";

            const actual = container.children[0];

            expect(actual).toEqual(expected);
        });
    });
});

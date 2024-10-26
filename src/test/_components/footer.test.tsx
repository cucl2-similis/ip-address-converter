import { Footer } from "@/app/_components/footer";
import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { act } from "@testing-library/react";
import { Root, createRoot } from "react-dom/client";

describe("Footerコンポーネント", () => {

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

    describe("構成要素確認", () => {

        test("フッターの構成が正しいこと。", () => {

            act(() => {
                root.render(<Footer/>);
            });

            const topElement = container.children[0];
            expect(topElement).toBeInstanceOf(HTMLElement);
            const footerElement = topElement as HTMLElement;
            expect(footerElement.tagName).toEqual("FOOTER");

            const divElement = footerElement.children[0];
            const firstElement  = divElement.children[0];
            const secondElement = divElement.children[1];

            expect(firstElement).toBeInstanceOf(HTMLElement);
            const iconElement = firstElement as HTMLElement;
            expect(iconElement.tagName).toEqual("I");
            expect(iconElement.className).toEqual("bi bi-github");

            expect(secondElement).toBeInstanceOf(HTMLAnchorElement);
            const anchorElement = secondElement as HTMLAnchorElement;
            expect(anchorElement.tagName).toEqual("A");
            expect(anchorElement.href).toEqual("https://github.com/cucl2-similis/ip-address-converter");

            const linkTextElement =  anchorElement.children[0];
            expect(linkTextElement).toBeInstanceOf(HTMLSpanElement);
            const spanElement = linkTextElement as HTMLSpanElement;
            expect(spanElement.tagName).toEqual("SPAN");
            expect(spanElement.textContent).toEqual(" Repository");
        });
    });
});

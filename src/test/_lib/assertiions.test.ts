import { Assertions } from "@/app/_lib/assertions";
import { describe, expect, test } from "@jest/globals";

describe("Assertions", () => {

    describe("assertNotNull", () => {

        test("引数がnullの場合、例外が送出されること。", () => {

            expect(() => {
                Assertions.assertNotNull(null);
            }).toThrow();
        });

        test("引数がundefinedの場合、例外が送出されること。", () => {

            expect(() => {
                Assertions.assertNotNull(undefined);
            }).toThrow();
        });

        test("引数がnullまたはundefined以外の場合、例外が送出されないこと。", () => {

            const formElement = document.createElement("form");

            expect(() => {
                Assertions.assertNotNull(formElement);
            }).not.toThrow();
        });
    });
});

import { Assertions } from "@/app/_lib/assertions";
import { AssertionError } from "@/app/_lib/errors";
import { describe, expect, test } from "@jest/globals";

describe("Assertions", () => {

    describe("assertNotNull", () => {

        test("引数がnullの場合、例外が送出されること。", () => {

            expect(() => {
                Assertions.assertNotNull(null);
            }).toThrow(AssertionError);

            expect(() => {
                Assertions.assertNotNull(null);
            }).toThrow("Parameter is null.");
        });

        test("引数がundefinedの場合、例外が送出されること。", () => {

            expect(() => {
                Assertions.assertNotNull(undefined);
            }).toThrow(AssertionError);

            expect(() => {
                Assertions.assertNotNull(undefined);
            }).toThrow("Parameter is undefined.");
        });

        test("引数がnullまたはundefined以外の場合、例外が送出されないこと。", () => {

            const formElement = document.createElement("form");

            expect(() => {
                Assertions.assertNotNull(formElement);
            }).not.toThrow();
        });
    });
});

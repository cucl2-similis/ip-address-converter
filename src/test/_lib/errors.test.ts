import { AssertionError, InvalidCallError } from "@/app/_lib/errors";
import { describe, expect, test } from "@jest/globals";

describe("AssertionError", () => {

    describe("name", () => {

        test("エラー名称が正しく設定されること。", () => {

            const expected = "AssertionError";
            const actual = new AssertionError("");

            expect(actual.name).toEqual(expected);
            expect(actual.toString()).toEqual(expected);
        });
    });

    describe("message", () => {

        test("エラーメッセージが正しく設定されること。", () => {

            const expected = "Expected Error Message";
            const actual = new AssertionError(expected);

            expect(actual.message).toEqual(expected);
        });
    });
});

describe("InvalidCallError", () => {

    describe("name", () => {

        test("エラー名称が正しく設定されること。", () => {

            const expected = "InvalidCallError";
            const actual = new InvalidCallError("");

            expect(actual.name).toEqual(expected);
            expect(actual.toString()).toEqual(expected);
        });
    });

    describe("message", () => {

        test("エラーメッセージが正しく設定されること。", () => {

            const expected = "Expected Error Message";
            const actual = new InvalidCallError(expected);

            expect(actual.message).toEqual(expected);
        });
    });
});

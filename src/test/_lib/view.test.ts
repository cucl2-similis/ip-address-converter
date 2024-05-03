import { View } from "@/app/_lib/view";
import { describe, expect, jest, test } from "@jest/globals";

describe("View", () => {

    describe("updateErrorMessage", () => {

        test("引数「errorMessage」が省略された場合、エラーメッセージが非表示設定になること。", () => {

            const setWasValidated = jest.fn();
            const setInvalidFeedback = jest.fn();
            const setResultDto = jest.fn();
            const view = new View(setWasValidated, setInvalidFeedback, setResultDto);

            view.updateErrorMessage();

            expect(setWasValidated).toHaveBeenCalledTimes(1);
            expect(setWasValidated).toHaveBeenCalledWith(false);

            expect(setInvalidFeedback).toHaveBeenCalledTimes(1);
            expect(setInvalidFeedback).toHaveBeenCalledWith("");
        });

        test("引数「errorMessage」が空文字の場合、エラーメッセージに空文字が設定されること。", () => {

            const setWasValidated = jest.fn();
            const setInvalidFeedback = jest.fn();
            const setResultDto = jest.fn();
            const view = new View(setWasValidated, setInvalidFeedback, setResultDto);

            view.updateErrorMessage("");

            expect(setWasValidated).toHaveBeenCalledTimes(1);
            expect(setWasValidated).toHaveBeenCalledWith(true);

            expect(setInvalidFeedback).toHaveBeenCalledTimes(1);
            expect(setInvalidFeedback).toHaveBeenCalledWith("");
        });

        test("引数「errorMessage」が「エラー」の場合、エラーメッセージに「エラー」が設定されること。", () => {

            const setWasValidated = jest.fn();
            const setInvalidFeedback = jest.fn();
            const setResultDto = jest.fn();
            const view = new View(setWasValidated, setInvalidFeedback, setResultDto);

            view.updateErrorMessage("エラー");

            expect(setWasValidated).toHaveBeenCalledTimes(1);
            expect(setWasValidated).toHaveBeenCalledWith(true);

            expect(setInvalidFeedback).toHaveBeenCalledTimes(1);
            expect(setInvalidFeedback).toHaveBeenCalledWith("エラー");
        });
    });
});

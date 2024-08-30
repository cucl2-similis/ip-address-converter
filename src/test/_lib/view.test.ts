import { View } from "@/app/_lib/view";
import { describe, expect, jest, test } from "@jest/globals";

describe("View", () => {

    describe("updateDefaultCidrBasedOn", () => {

        test("IPv4文字列が未定義の場合、stateセッタ関数が呼び出されないこと。", () => {

            const setWasValidated = jest.fn();
            const setInvalidFeedback = jest.fn();
            const setDefaultCidr = jest.fn();
            const setResultDto = jest.fn();
            const view = new View(setWasValidated, setInvalidFeedback, setDefaultCidr, setResultDto);

            view.updateDefaultCidrBasedOn(undefined);

            expect(setDefaultCidr).not.toHaveBeenCalled();
        });

        test("IPv4文字列が文字列の場合、対応するCIDRデフォルト値が設定されること。", () => {

            const setWasValidated = jest.fn();
            const setInvalidFeedback = jest.fn();
            const setDefaultCidr = jest.fn();
            const setResultDto = jest.fn();
            const view = new View(setWasValidated, setInvalidFeedback, setDefaultCidr, setResultDto);

            const inputIpv4Val = "192.168.10.1";
            const expectedCidr = "24";

            view.updateDefaultCidrBasedOn(inputIpv4Val);

            expect(setDefaultCidr).toHaveBeenCalledTimes(1);
            expect(setDefaultCidr).toHaveBeenCalledWith(expectedCidr);
        });
    });

    describe("updateErrorMessage", () => {

        test("引数「errorMessage」が省略された場合、エラーメッセージが非表示設定になること。", () => {

            const setWasValidated = jest.fn();
            const setInvalidFeedback = jest.fn();
            const setDefaultCidr = jest.fn();
            const setResultDto = jest.fn();
            const view = new View(setWasValidated, setInvalidFeedback, setDefaultCidr, setResultDto);

            view.updateErrorMessage();

            expect(setWasValidated).toHaveBeenCalledTimes(1);
            expect(setWasValidated).toHaveBeenCalledWith(false);

            expect(setInvalidFeedback).toHaveBeenCalledTimes(1);
            expect(setInvalidFeedback).toHaveBeenCalledWith("");
        });

        test("引数「errorMessage」が空文字の場合、エラーメッセージに空文字が設定されること。", () => {

            const setWasValidated = jest.fn();
            const setInvalidFeedback = jest.fn();
            const setDefaultCidr = jest.fn();
            const setResultDto = jest.fn();
            const view = new View(setWasValidated, setInvalidFeedback, setDefaultCidr, setResultDto);

            view.updateErrorMessage("");

            expect(setWasValidated).toHaveBeenCalledTimes(1);
            expect(setWasValidated).toHaveBeenCalledWith(true);

            expect(setInvalidFeedback).toHaveBeenCalledTimes(1);
            expect(setInvalidFeedback).toHaveBeenCalledWith("");
        });

        test("引数「errorMessage」が「エラー」の場合、エラーメッセージに「エラー」が設定されること。", () => {

            const setWasValidated = jest.fn();
            const setInvalidFeedback = jest.fn();
            const setDefaultCidr = jest.fn();
            const setResultDto = jest.fn();
            const view = new View(setWasValidated, setInvalidFeedback, setDefaultCidr, setResultDto);

            view.updateErrorMessage("エラー");

            expect(setWasValidated).toHaveBeenCalledTimes(1);
            expect(setWasValidated).toHaveBeenCalledWith(true);

            expect(setInvalidFeedback).toHaveBeenCalledTimes(1);
            expect(setInvalidFeedback).toHaveBeenCalledWith("エラー");
        });
    });

    describe("updateErrorMessages", () => {

        test("引数「errorMessages」のうち最初の文字列がエラーメッセージに設定されること。", () => {

            const setWasValidated = jest.fn();
            const setInvalidFeedback = jest.fn();
            const setDefaultCidr = jest.fn();
            const setResultDto = jest.fn();
            const view = new View(setWasValidated, setInvalidFeedback, setDefaultCidr, setResultDto);

            const errorMessage01 = "errorMessage01";
            const errorMessage02 = "";
            const errorMessage03 = "errorMessage03";
            view.updateErrorMessages(errorMessage01, errorMessage02, errorMessage03);

            expect(setWasValidated).toHaveBeenCalledTimes(1);
            expect(setWasValidated).toHaveBeenCalledWith(true);

            expect(setInvalidFeedback).toHaveBeenCalledTimes(1);
            expect(setInvalidFeedback).toHaveBeenCalledWith(errorMessage01);
        });

        test("引数「errorMessages」のうち空文字を除く最初の文字列がエラーメッセージに設定されること。", () => {

            const setWasValidated = jest.fn();
            const setInvalidFeedback = jest.fn();
            const setDefaultCidr = jest.fn();
            const setResultDto = jest.fn();
            const view = new View(setWasValidated, setInvalidFeedback, setDefaultCidr, setResultDto);

            const errorMessage01 = "";
            const errorMessage02 = "errorMessage02";
            const errorMessage03 = "";
            view.updateErrorMessages(errorMessage01, errorMessage02, errorMessage03);

            expect(setWasValidated).toHaveBeenCalledTimes(1);
            expect(setWasValidated).toHaveBeenCalledWith(true);

            expect(setInvalidFeedback).toHaveBeenCalledTimes(1);
            expect(setInvalidFeedback).toHaveBeenCalledWith(errorMessage02);
        });

        test("引数「errorMessages」が全て空文字の場合、エラーメッセージに空文字が設定されること。", () => {

            const setWasValidated = jest.fn();
            const setInvalidFeedback = jest.fn();
            const setDefaultCidr = jest.fn();
            const setResultDto = jest.fn();
            const view = new View(setWasValidated, setInvalidFeedback, setDefaultCidr, setResultDto);

            const errorMessage01 = "";
            const errorMessage02 = "";
            const errorMessage03 = "";
            view.updateErrorMessages(errorMessage01, errorMessage02, errorMessage03);

            expect(setWasValidated).toHaveBeenCalledTimes(1);
            expect(setWasValidated).toHaveBeenCalledWith(true);

            expect(setInvalidFeedback).toHaveBeenCalledTimes(1);
            expect(setInvalidFeedback).toHaveBeenCalledWith("");
        });
    });
});

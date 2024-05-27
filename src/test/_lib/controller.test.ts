import { Builder } from "@/app/_lib/builder";
import { Controller } from "@/app/_lib/controller";
import { Converter } from "@/app/_lib/converter";
import { Validator } from "@/app/_lib/validator";
import { View } from "@/app/_lib/view";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { fireEvent } from "@testing-library/react";
import { Mock, UnknownFunction } from "jest-mock";

describe("Controller", () => {

    let setWasValidated: Mock<UnknownFunction>;
    let setInvalidFeedback: Mock<UnknownFunction>;
    let setResultDto: Mock<UnknownFunction>;

    let converter: Converter
    let validator: Validator;
    let view: View;

    let controller: Controller;

    beforeEach(() => {
        setWasValidated = jest.fn();
        setInvalidFeedback = jest.fn();
        setResultDto = jest.fn();

        converter = new Converter();
        validator = new Validator();
        view = new View(setWasValidated, setInvalidFeedback, setResultDto);

        controller = new Controller(converter, validator, view);
    });

    describe("convert", () => {

        test("<form>要素がnullの場合、例外が送出され後続処理が実行されないこと。", () => {

            const validate = jest.spyOn(validator, "validate");
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");

            const formElement = null;
            const ipv4InputElement = document.createElement("input");
            const cidrInputElement = document.createElement("input");

            expect(() => {
                controller.convert(formElement, ipv4InputElement, cidrInputElement);
            }).toThrow();

            expect(validate).not.toHaveBeenCalled();
            expect(updateErrorMessage).not.toHaveBeenCalled();
            expect(setResultDto).not.toHaveBeenCalled();
        });

        test("IPv4アドレス<input>要素がnullの場合、例外が送出され後続処理が実行されないこと。", () => {

            const validate = jest.spyOn(validator, "validate");
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");

            const formElement = document.createElement("form");
            const ipv4InputElement = null;
            const cidrInputElement = document.createElement("input");

            expect(() => {
                controller.convert(formElement, ipv4InputElement, cidrInputElement);
            }).toThrow();

            expect(validate).not.toHaveBeenCalled();
            expect(updateErrorMessage).not.toHaveBeenCalled();
            expect(setResultDto).not.toHaveBeenCalled();
        });

        test("CIDRブロック<input>要素がnullの場合、例外が送出され後続処理が実行されないこと。", () => {

            const validate = jest.spyOn(validator, "validate");
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");

            const formElement = document.createElement("form");
            const ipv4InputElement = document.createElement("input");
            const cidrInputElement = null;

            expect(() => {
                controller.convert(formElement, ipv4InputElement, cidrInputElement);
            }).toThrow();

            expect(validate).not.toHaveBeenCalled();
            expect(updateErrorMessage).not.toHaveBeenCalled();
            expect(setResultDto).not.toHaveBeenCalled();
        });

        test("IPv4アドレス<input>要素に入力チェックエラーありの場合、エラーメッセージ表示処理が実行されること。", () => {

            jest.spyOn(validator, "validate").mockImplementation(() => {});
            jest.spyOn(validator, "hasErrors").mockReturnValue(true);
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");

            const formElement = document.createElement("form");
            const ipv4InputElement = document.createElement("input");
            const cidrInputElement = document.createElement("input");

            const errorMessage = "IP Address field is required.";
            ipv4InputElement.setCustomValidity(errorMessage);

            controller.convert(formElement, ipv4InputElement, cidrInputElement);

            expect(updateErrorMessage).toHaveBeenCalledWith(errorMessage);
            expect(updateErrorMessage).not.toHaveBeenCalledWith();
            expect(setResultDto).not.toHaveBeenCalled();
        });

        test("CIDRブロック<input>要素に入力チェックエラーありの場合、エラーメッセージ表示処理が実行されること。", () => {

            jest.spyOn(validator, "validate").mockImplementation(() => {});
            jest.spyOn(validator, "hasErrors").mockReturnValue(true);
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");

            const formElement = document.createElement("form");
            const ipv4InputElement = document.createElement("input");
            const cidrInputElement = document.createElement("input");

            const errorMessage = "CIDR must be numeric.";
            cidrInputElement.setCustomValidity(errorMessage);

            controller.convert(formElement, ipv4InputElement, cidrInputElement);

            expect(updateErrorMessage).toHaveBeenCalledWith(errorMessage);
            expect(updateErrorMessage).not.toHaveBeenCalledWith();
            expect(setResultDto).not.toHaveBeenCalled();
        });

        test("IPv4アドレス<input>要素に入力チェックエラーありの場合、入力値変更イベント発生時関数が設定されること。", () => {

            const validate = jest.spyOn(validator, "validate").mockImplementation(() => {});
            const hasErrors = jest.spyOn(validator, "hasErrors").mockReturnValue(true);
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");

            const formElement = document.createElement("form");
            const ipv4InputElement = document.createElement("input");
            const cidrInputElement = document.createElement("input");

            const firstErrorMessage = "This is the first error message.";
            ipv4InputElement.setCustomValidity(firstErrorMessage);

            controller.convert(formElement, ipv4InputElement, cidrInputElement);

            expect(validate).toHaveBeenCalledTimes(1);
            expect(hasErrors).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).toHaveBeenLastCalledWith(firstErrorMessage);

            const secondErrorMessage = "This is the second error message.";
            ipv4InputElement.setCustomValidity(secondErrorMessage);
            fireEvent.input(ipv4InputElement);

            expect(validate).toHaveBeenCalledTimes(2);
            expect(hasErrors).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).toHaveBeenCalledTimes(2);
            expect(updateErrorMessage).toHaveBeenLastCalledWith(secondErrorMessage);
        });

        test("CIDRブロック<input>要素に入力チェックエラーありの場合、入力値変更イベント発生時関数が設定されること。", () => {

            const validate = jest.spyOn(validator, "validate").mockImplementation(() => {});
            const hasErrors = jest.spyOn(validator, "hasErrors").mockReturnValue(true);
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");

            const formElement = document.createElement("form");
            const ipv4InputElement = document.createElement("input");
            const cidrInputElement = document.createElement("input");

            const firstErrorMessage = "This is the first error message.";
            cidrInputElement.setCustomValidity(firstErrorMessage);

            controller.convert(formElement, ipv4InputElement, cidrInputElement);

            expect(validate).toHaveBeenCalledTimes(1);
            expect(hasErrors).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).toHaveBeenLastCalledWith(firstErrorMessage);

            const secondErrorMessage = "This is the second error message.";
            cidrInputElement.setCustomValidity(secondErrorMessage);
            fireEvent.input(cidrInputElement);

            expect(validate).toHaveBeenCalledTimes(2);
            expect(hasErrors).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).toHaveBeenCalledTimes(2);
            expect(updateErrorMessage).toHaveBeenLastCalledWith(secondErrorMessage);
        });

        test("入力チェックエラーなしの場合、入力値変更イベント発生時関数が削除されること。", () => {

            const validate = jest.spyOn(validator, "validate").mockImplementation(() => {});
            const hasErrors = jest.spyOn(validator, "hasErrors").mockReturnValue(false);
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");

            const formElement = document.createElement("form");
            const ipv4InputElement = document.createElement("input");
            const cidrInputElement = document.createElement("input");

            const ipv4ErrorMessage = "IP Address field is required.";
            const cidrErrorMessage = "CIDR must be numeric.";

            ipv4InputElement.setCustomValidity(ipv4ErrorMessage);
            cidrInputElement.setCustomValidity(cidrErrorMessage);

            const onInputFunction = () => {
                validator.validate(formElement, ipv4InputElement, cidrInputElement);
                view.updateErrorMessages(ipv4ErrorMessage, cidrErrorMessage);
            };
            ipv4InputElement.oninput = onInputFunction;
            cidrInputElement.oninput = onInputFunction;

            controller.convert(formElement, ipv4InputElement, cidrInputElement);

            expect(validate).toHaveBeenCalledTimes(1);
            expect(hasErrors).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).not.toHaveBeenCalledWith(ipv4ErrorMessage);
            expect(updateErrorMessage).not.toHaveBeenCalledWith(cidrInputElement);
            expect(updateErrorMessage).toHaveBeenCalledWith();

            fireEvent.input(ipv4InputElement);

            expect(validate).toHaveBeenCalledTimes(1);
            expect(hasErrors).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).not.toHaveBeenCalledWith(ipv4ErrorMessage);
            expect(updateErrorMessage).toHaveBeenCalledWith();

            fireEvent.input(cidrInputElement);

            expect(validate).toHaveBeenCalledTimes(1);
            expect(hasErrors).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).not.toHaveBeenCalledWith(cidrErrorMessage);
            expect(updateErrorMessage).toHaveBeenCalledWith();
        });

        test("<input>要素の値に対応した変換結果DTOが、stateセッタ関数によって設定されること。", () => {

            const ipv4InputValue = "192.168.10.1";
            const cidrInputValue = "24";

            jest.spyOn(validator, "validate").mockImplementation(() => {});
            jest.spyOn(validator, "hasErrors").mockReturnValue(false);

            const convert = jest.spyOn(converter, "convert").mockImplementation((ipv4Str, cidrStr) => {
                return ipv4Str !== ipv4InputValue || cidrStr !== cidrInputValue
                        ? Builder.ofResultDto()
                                 .build()
                        : Builder.ofResultDto()
                                 .decIpAddressArray([192, 168, 10, 1])
                                 .binIpAddressArray(["11000000", "10101000", "00001010", "00000001"])
                                 .cidr(24)
                                 .build();
            });

            const formElement = document.createElement("form");
            const ipv4InputElement = document.createElement("input");
            const cidrInputElement = document.createElement("input");

            ipv4InputElement.value = ipv4InputValue;
            cidrInputElement.value = cidrInputValue;
            controller.convert(formElement, ipv4InputElement, cidrInputElement);

            expect(convert).toHaveBeenCalledTimes(1);
            expect(setResultDto).toHaveBeenCalledTimes(1);

            const resultDto = Builder.ofResultDto()
                    .decIpAddressArray([192, 168, 10, 1])
                    .binIpAddressArray(["11000000", "10101000", "00001010", "00000001"])
                    .cidr(24)
                    .build();

            expect(setResultDto).toHaveBeenCalledWith(resultDto);
        });
    });
});

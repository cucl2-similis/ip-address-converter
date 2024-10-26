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
    let setDefaultCidr: Mock<UnknownFunction>;
    let setResultDto: Mock<UnknownFunction>;

    let converter: Converter
    let validator: Validator;
    let view: View;

    let controller: Controller;

    beforeEach(() => {
        setWasValidated = jest.fn();
        setInvalidFeedback = jest.fn();
        setDefaultCidr = jest.fn();
        setResultDto = jest.fn();

        converter = new Converter();
        validator = new Validator();
        view = new View(setWasValidated, setInvalidFeedback, setDefaultCidr, setResultDto);

        controller = new Controller(converter, validator, view);
    });

    describe("convert", () => {

        test("<form>要素がnullの場合、例外が送出され後続処理が実行されないこと。", () => {

            const validate = jest.spyOn(validator, "validate");
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");

            const formElement = null;
            const ipv4InputElement = document.createElement("input");
            const cidrInputElement = document.createElement("input");
            const defaultCidr = "24";

            expect(() => {
                controller.convert(formElement, ipv4InputElement, cidrInputElement, defaultCidr);
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
            const defaultCidr = "24";

            expect(() => {
                controller.convert(formElement, ipv4InputElement, cidrInputElement, defaultCidr);
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
            const defaultCidr = "24";

            expect(() => {
                controller.convert(formElement, ipv4InputElement, cidrInputElement, defaultCidr);
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
            const defaultCidr = "24";

            const errorMessage = "IP Address field is required.";
            ipv4InputElement.setCustomValidity(errorMessage);

            controller.convert(formElement, ipv4InputElement, cidrInputElement, defaultCidr);

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
            const defaultCidr = "24";

            const errorMessage = "CIDR must be numeric.";
            cidrInputElement.setCustomValidity(errorMessage);

            controller.convert(formElement, ipv4InputElement, cidrInputElement, defaultCidr);

            expect(updateErrorMessage).toHaveBeenCalledWith(errorMessage);
            expect(updateErrorMessage).not.toHaveBeenCalledWith();
            expect(setResultDto).not.toHaveBeenCalled();
        });

        test("IPv4アドレス<input>要素に入力チェックエラーありの場合、入力値変更イベントが更新されること。", () => {

            const validate = jest.spyOn(validator, "validate").mockImplementation(() => {});
            const hasErrors = jest.spyOn(validator, "hasErrors").mockReturnValue(true);
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");
            const updateDefaultCidrBasedOn = jest.spyOn(view, "updateDefaultCidrBasedOn");

            const formElement = document.createElement("form");
            const ipv4InputElement = document.createElement("input");
            const cidrInputElement = document.createElement("input");
            const defaultCidr = "24";

            const firstErrorMessage = "This is the first error message.";
            ipv4InputElement.setCustomValidity(firstErrorMessage);

            controller.convert(formElement, ipv4InputElement, cidrInputElement, defaultCidr);

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
            expect(updateDefaultCidrBasedOn).toHaveBeenCalledTimes(1);
            expect(updateDefaultCidrBasedOn).toHaveBeenCalledWith(ipv4InputElement.value);
        });

        test("CIDRブロック<input>要素に入力チェックエラーありの場合、入力値変更イベントが更新されること。", () => {

            const validate = jest.spyOn(validator, "validate").mockImplementation(() => {});
            const hasErrors = jest.spyOn(validator, "hasErrors").mockReturnValue(true);
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");
            const updateDefaultCidrBasedOn = jest.spyOn(view, "updateDefaultCidrBasedOn");

            const formElement = document.createElement("form");
            const ipv4InputElement = document.createElement("input");
            const cidrInputElement = document.createElement("input");
            const defaultCidr = "24";

            const firstErrorMessage = "This is the first error message.";
            cidrInputElement.setCustomValidity(firstErrorMessage);

            controller.convert(formElement, ipv4InputElement, cidrInputElement, defaultCidr);

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
            expect(updateDefaultCidrBasedOn).not.toHaveBeenCalled();
        });

        test("入力チェックエラーなしの場合、入力値変更イベントが初期化されること。", () => {

            const validate = jest.spyOn(validator, "validate").mockImplementation(() => {});
            const hasErrors = jest.spyOn(validator, "hasErrors").mockReturnValue(false);
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");
            const updateDefaultCidrBasedOn = jest.spyOn(view, "updateDefaultCidrBasedOn");

            const formElement = document.createElement("form");
            const ipv4InputElement = document.createElement("input");
            const cidrInputElement = document.createElement("input");
            const defaultCidr = "24";

            const ipv4ErrorMessage = "IP Address field is required.";
            const cidrErrorMessage = "CIDR must be numeric.";

            ipv4InputElement.setCustomValidity(ipv4ErrorMessage);
            cidrInputElement.setCustomValidity(cidrErrorMessage);

            controller.convert(formElement, ipv4InputElement, cidrInputElement, defaultCidr);

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
            expect(updateDefaultCidrBasedOn).toHaveBeenCalledTimes(1);
            expect(updateDefaultCidrBasedOn).toHaveBeenCalledWith(ipv4InputElement.value);

            fireEvent.input(cidrInputElement);

            expect(validate).toHaveBeenCalledTimes(1);
            expect(hasErrors).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).not.toHaveBeenCalledWith(cidrErrorMessage);
            expect(updateErrorMessage).toHaveBeenCalledWith();
        });

        test("CIDR入力なしの場合、<input>要素の値に対応した変換結果DTOが、stateセッタ関数によって設定されること。", () => {

            const ipv4InputValue = "192.168.10.1";
            const cidrInputValue = "";
            const defaultCidrVal = "24";

            const expectedCidr = 24;

            jest.spyOn(validator, "validate").mockImplementation(() => {});
            jest.spyOn(validator, "hasErrors").mockReturnValue(false);

            const convert = jest.spyOn(converter, "convert").mockImplementation((ipv4Str, cidrStr) => {
                return ipv4Str !== ipv4InputValue || cidrStr !== String(expectedCidr)
                        ? Builder.ofResultDto()
                                 .build()
                        : Builder.ofResultDto()
                                 .decIpAddressArray([192, 168, 10, 1])
                                 .binIpAddressArray(["11000000", "10101000", "00001010", "00000001"])
                                 .cidr(expectedCidr)
                                 .build();
            });

            const formElement = document.createElement("form");
            const ipv4InputElement = document.createElement("input");
            const cidrInputElement = document.createElement("input");

            ipv4InputElement.value = ipv4InputValue;
            cidrInputElement.value = cidrInputValue;
            controller.convert(formElement, ipv4InputElement, cidrInputElement, defaultCidrVal);

            expect(convert).toHaveBeenCalledTimes(1);
            expect(setResultDto).toHaveBeenCalledTimes(1);

            const resultDto = Builder.ofResultDto()
                    .decIpAddressArray([192, 168, 10, 1])
                    .binIpAddressArray(["11000000", "10101000", "00001010", "00000001"])
                    .cidr(expectedCidr)
                    .build();

            expect(setResultDto).toHaveBeenCalledWith(resultDto);
        });

        test("CIDR入力ありの場合、<input>要素の値に対応した変換結果DTOが、stateセッタ関数によって設定されること。", () => {

            const ipv4InputValue = "192.168.10.1";
            const cidrInputValue = "28";
            const defaultCidrVal = "24";

            const expectedCidr = 28;

            jest.spyOn(validator, "validate").mockImplementation(() => {});
            jest.spyOn(validator, "hasErrors").mockReturnValue(false);

            const convert = jest.spyOn(converter, "convert").mockImplementation((ipv4Str, cidrStr) => {
                return ipv4Str !== ipv4InputValue || cidrStr !== String(expectedCidr)
                        ? Builder.ofResultDto()
                                 .build()
                        : Builder.ofResultDto()
                                 .decIpAddressArray([192, 168, 10, 1])
                                 .binIpAddressArray(["11000000", "10101000", "00001010", "00000001"])
                                 .cidr(expectedCidr)
                                 .build();
            });

            const formElement = document.createElement("form");
            const ipv4InputElement = document.createElement("input");
            const cidrInputElement = document.createElement("input");

            ipv4InputElement.value = ipv4InputValue;
            cidrInputElement.value = cidrInputValue;
            controller.convert(formElement, ipv4InputElement, cidrInputElement, defaultCidrVal);

            expect(convert).toHaveBeenCalledTimes(1);
            expect(setResultDto).toHaveBeenCalledTimes(1);

            const resultDto = Builder.ofResultDto()
                    .decIpAddressArray([192, 168, 10, 1])
                    .binIpAddressArray(["11000000", "10101000", "00001010", "00000001"])
                    .cidr(expectedCidr)
                    .build();

            expect(setResultDto).toHaveBeenCalledWith(resultDto);
        });
    });

    describe("clear", () => {

        test("IPv4アドレス<input>要素がnullの場合、例外が送出され後続処理が実行されないこと。", () => {

            const updateDefaultCidrBasedOn = jest.spyOn(view, "updateDefaultCidrBasedOn");
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");
            const updateResult = jest.spyOn(view, "updateResult");

            const ipv4InputElement = null;
            const cidrInputElement = document.createElement("input");

            expect(() => {
                controller.clear(ipv4InputElement, cidrInputElement);
            }).toThrow();

            expect(updateDefaultCidrBasedOn).not.toHaveBeenCalled();
            expect(updateErrorMessage).not.toHaveBeenCalled();
            expect(updateResult).not.toHaveBeenCalled();
        });

        test("CIDRブロック<input>要素がnullの場合、例外が送出され後続処理が実行されないこと。", () => {

            const updateDefaultCidrBasedOn = jest.spyOn(view, "updateDefaultCidrBasedOn");
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");
            const updateResult = jest.spyOn(view, "updateResult");

            const ipv4InputElement = document.createElement("input");
            const cidrInputElement = null;

            expect(() => {
                controller.clear(ipv4InputElement, cidrInputElement);
            }).toThrow();

            expect(updateDefaultCidrBasedOn).not.toHaveBeenCalled();
            expect(updateErrorMessage).not.toHaveBeenCalled();
            expect(updateResult).not.toHaveBeenCalled();
        });

        test("<input>要素の入力値が初期化されること。", () => {

            const ipv4InputElement = document.createElement("input");
            const cidrInputElement = document.createElement("input");

            ipv4InputElement.value = "ipv4InputElementValue";
            cidrInputElement.value = "cidrInputElementValue";
            controller.clear(ipv4InputElement, cidrInputElement);

            expect(ipv4InputElement.value).toEqual("");
            expect(cidrInputElement.value).toEqual("");
        });

        test("<input>要素の入力値変更イベントが初期化されること。", () => {

            const updateDefaultCidrBasedOn = jest.spyOn(view, "updateDefaultCidrBasedOn");
            const ipv4IncorrectOnInputFunc = jest.fn();
            const cidrIncorrectOnInputFunc = jest.fn();

            const ipv4InputElement = document.createElement("input");
            const cidrInputElement = document.createElement("input");

            ipv4InputElement.oninput = ipv4IncorrectOnInputFunc;
            cidrInputElement.oninput = cidrIncorrectOnInputFunc;

            controller.clear(ipv4InputElement, cidrInputElement);

            expect(updateDefaultCidrBasedOn).toHaveBeenCalledTimes(1);
            expect(updateDefaultCidrBasedOn).toHaveBeenLastCalledWith("");

            const expectedIpv4Value = "ipv4InputElementValue";
            ipv4InputElement.value = expectedIpv4Value;

            fireEvent.input(ipv4InputElement);
            expect(ipv4IncorrectOnInputFunc).not.toHaveBeenCalled();
            expect(updateDefaultCidrBasedOn).toHaveBeenCalledTimes(2);
            expect(updateDefaultCidrBasedOn).toHaveBeenLastCalledWith(expectedIpv4Value);

            fireEvent.input(cidrInputElement);
            expect(cidrIncorrectOnInputFunc).not.toHaveBeenCalled();
        });

        test("画面表示内容が初期化されること。", () => {

            const updateDefaultCidrBasedOn = jest.spyOn(view, "updateDefaultCidrBasedOn");
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");
            const updateResult = jest.spyOn(view, "updateResult");

            const ipv4InputElement = document.createElement("input");
            const cidrInputElement = document.createElement("input");

            ipv4InputElement.value = "ipv4InputElementValue";

            controller.clear(ipv4InputElement, cidrInputElement);

            expect(updateDefaultCidrBasedOn).toHaveBeenCalledTimes(1);
            expect(updateDefaultCidrBasedOn).toHaveBeenLastCalledWith("");

            expect(updateErrorMessage).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).toHaveBeenLastCalledWith();

            expect(updateResult).toHaveBeenCalledTimes(1);
            expect(updateResult).toHaveBeenLastCalledWith(null);
        });
    });
});

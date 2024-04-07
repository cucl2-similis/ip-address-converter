import { Controller } from "@/app/_lib/controller";
import { ResultDto } from "@/app/_lib/result-dto";
import { Validator } from "@/app/_lib/validator";
import { View } from "@/app/_lib/view";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { fireEvent } from "@testing-library/react";
import { Mock, UnknownFunction } from "jest-mock";

describe("Controller", () => {

    let setWasValidated: Mock<UnknownFunction>;
    let setInvalidFeedback: Mock<UnknownFunction>;
    let setResultDto: Mock<UnknownFunction>;

    let validator: Validator;
    let view: View;

    let controller: Controller;

    beforeEach(() => {
        setWasValidated = jest.fn();
        setInvalidFeedback = jest.fn();
        setResultDto = jest.fn();

        validator = new Validator();
        view = new View(setWasValidated, setInvalidFeedback);

        controller = new Controller(validator, view, setResultDto);
    });

    describe("convert", () => {

        test("<form>要素がnullの場合、例外が送出され後続処理が実行されないこと。", () => {

            const validate = jest.spyOn(validator, "validate");
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");

            const formElement = null;
            const inputElement = document.createElement("input");

            expect(() => {
                controller.convert(formElement, inputElement);
            }).toThrow();

            expect(validate).not.toHaveBeenCalled();
            expect(updateErrorMessage).not.toHaveBeenCalled();
            expect(setResultDto).not.toHaveBeenCalled();
        });

        test("<input>要素がnullの場合、例外が送出され後続処理が実行されないこと。", () => {

            const validate = jest.spyOn(validator, "validate");
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");

            const formElement = document.createElement("form");
            const inputElement = null;

            expect(() => {
                controller.convert(formElement, inputElement);
            }).toThrow();

            expect(validate).not.toHaveBeenCalled();
            expect(updateErrorMessage).not.toHaveBeenCalled();
            expect(setResultDto).not.toHaveBeenCalled();
        });

        test("入力チェックエラーありの場合、エラーメッセージ表示処理が実行されること。", () => {

            jest.spyOn(validator, "validate").mockImplementation(() => {});
            jest.spyOn(validator, "hasErrors").mockReturnValue(true);
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");

            const formElement = document.createElement("form");
            const inputElement = document.createElement("input");

            const errorMessage = "This field is required.";
            inputElement.setCustomValidity(errorMessage);

            controller.convert(formElement, inputElement);

            expect(updateErrorMessage).toHaveBeenCalledWith(errorMessage);
            expect(updateErrorMessage).not.toHaveBeenCalledWith();
            expect(setResultDto).not.toHaveBeenCalled();
        });

        test("入力チェックエラーありの場合、入力値変更イベント発生時関数が設定されること。", () => {

            const validate = jest.spyOn(validator, "validate").mockImplementation(() => {});
            const hasErrors = jest.spyOn(validator, "hasErrors").mockReturnValue(true);
            const updateErrorMessage = jest.spyOn(view, "updateErrorMessage");

            const formElement = document.createElement("form");
            const inputElement = document.createElement("input");

            const firstErrorMessage = "This is the first error message.";
            inputElement.setCustomValidity(firstErrorMessage);

            controller.convert(formElement, inputElement);

            expect(validate).toHaveBeenCalledTimes(1);
            expect(hasErrors).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).toHaveBeenLastCalledWith(firstErrorMessage);

            const secondErrorMessage = "This is the second error message.";
            inputElement.setCustomValidity(secondErrorMessage);
            fireEvent.input(inputElement);

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
            const inputElement = document.createElement("input");

            const errorMessage = "This field is required.";
            inputElement.setCustomValidity(errorMessage);
            inputElement.oninput = () => {
                validator.validate(formElement, inputElement);
                view.updateErrorMessage(errorMessage);
            };

            controller.convert(formElement, inputElement);

            expect(validate).toHaveBeenCalledTimes(1);
            expect(hasErrors).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).not.toHaveBeenCalledWith(errorMessage);
            expect(updateErrorMessage).toHaveBeenCalledWith();

            fireEvent.input(inputElement);

            expect(validate).toHaveBeenCalledTimes(1);
            expect(hasErrors).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).toHaveBeenCalledTimes(1);
            expect(updateErrorMessage).not.toHaveBeenCalledWith(errorMessage);
            expect(updateErrorMessage).toHaveBeenCalledWith();
        });

        test("<input>要素の値に対応した変換結果DTOが、stateセッタ関数によって設定されること。", () => {

            jest.spyOn(validator, "validate").mockImplementation(() => {});
            jest.spyOn(validator, "hasErrors").mockReturnValue(false);

            const formElement = document.createElement("form");
            const inputElement = document.createElement("input");
            inputElement.value = "192.168.10.1/24";

            controller.convert(formElement, inputElement);

            expect(setResultDto).toHaveBeenCalledTimes(1);

            const resultDto = new ResultDto();
            resultDto.setDecIpAddressArray([192, 168, 10, 1]);
            resultDto.setCidr(24)
            expect(setResultDto).toHaveBeenCalledWith(resultDto);
        });
    });
});

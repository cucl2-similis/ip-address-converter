import { Validator } from "@/app/_lib/validator";
import { beforeEach, describe, expect, test } from "@jest/globals";

describe("Validator", () => {

    let validator: Validator;

    let formElement: HTMLFormElement;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
        validator = new Validator();

        formElement = document.createElement("form");
        inputElement = document.createElement("input");
        formElement.appendChild(inputElement);
    });

    describe("validate", () => {

        test("<input>要素の値が正常の場合、エラーメッセージが設定されないこと。", () => {

            inputElement.value = "192.168.10.1/24";

            validator.validate(formElement, inputElement);

            expect(formElement.checkValidity()).toEqual(true);
            expect(inputElement.validationMessage).toEqual("");
        });

        test("<input>要素の値が空文字の場合、対応するエラーメッセージが設定されること。", () => {

            inputElement.value = "";

            validator.validate(formElement, inputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(inputElement.validationMessage).toEqual("This field is required.");
        });
    });

    describe("hasErrors", () => {

        test("<input>要素の値が正常値の場合、falseが返却されること。", () => {

            inputElement.value = "192.168.10.1/24";

            validator.validate(formElement, inputElement);

            const actual = validator.hasErrors();
            expect(actual).toEqual(false);
        });

        test("<input>要素の値が異常値の場合、trueが返却されること。", () => {

            inputElement.value = "";

            validator.validate(formElement, inputElement);

            const actual = validator.hasErrors();
            expect(actual).toEqual(true);
        });

        test("事前にvalidateメソッドが呼び出されていない場合、例外が送出されること。", () => {

            expect(() => {
                validator.hasErrors();
            }).toThrow();
        });
    });
});

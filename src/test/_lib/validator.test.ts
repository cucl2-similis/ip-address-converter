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

        test("入力IPアドレスがIPv6形式の場合、対応するエラーメッセージが設定されること。", () => {

            inputElement.value = "::ffff:c0a8:a01";

            validator.validate(formElement, inputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(inputElement.validationMessage).toEqual("Input value must be in format \"IP/CIDR (000.000.000.000/00)\".");
        });

        test("入力IPアドレスがCIDRなしの場合、対応するエラーメッセージが設定されること。", () => {

            inputElement.value = "192.168.10.1";

            validator.validate(formElement, inputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(inputElement.validationMessage).toEqual("Input value must be in format \"IP/CIDR (000.000.000.000/00)\".");
        });

        test("入力IPアドレスの第一オクテットが256の場合、対応するエラーメッセージが設定されること。", () => {

            inputElement.value = "256.168.10.1/24";

            validator.validate(formElement, inputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(inputElement.validationMessage).toEqual("All octets must be between 0 and 255, and CIDR must be between 0 and 32.");
        });

        test("入力IPアドレスの第二オクテットが256の場合、対応するエラーメッセージが設定されること。", () => {

            inputElement.value = "192.256.10.1/24";

            validator.validate(formElement, inputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(inputElement.validationMessage).toEqual("All octets must be between 0 and 255, and CIDR must be between 0 and 32.");
        });

        test("入力IPアドレスの第三オクテットが256の場合、対応するエラーメッセージが設定されること。", () => {

            inputElement.value = "192.168.256.1/24";

            validator.validate(formElement, inputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(inputElement.validationMessage).toEqual("All octets must be between 0 and 255, and CIDR must be between 0 and 32.");
        });

        test("入力IPアドレスの第四オクテットが256の場合、対応するエラーメッセージが設定されること。", () => {

            inputElement.value = "192.168.10.256/24";

            validator.validate(formElement, inputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(inputElement.validationMessage).toEqual("All octets must be between 0 and 255, and CIDR must be between 0 and 32.");
        });

        test("入力IPアドレスのCIDRが33の場合、対応するエラーメッセージが設定されること。", () => {

            inputElement.value = "192.168.10.256/33";

            validator.validate(formElement, inputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(inputElement.validationMessage).toEqual("All octets must be between 0 and 255, and CIDR must be between 0 and 32.");
        });

        test("入力IPアドレスがクラスAかつCIDRが7の場合、対応するエラーメッセージが設定されること。", () => {

            inputElement.value = "10.0.0.1/7";

            validator.validate(formElement, inputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(inputElement.validationMessage).toEqual("When Address Class is A, CIDR must be between 8 and 15.");
        });

        test("入力IPアドレスがクラスAかつCIDRが16の場合、対応するエラーメッセージが設定されること。", () => {

            inputElement.value = "10.0.0.1/16";

            validator.validate(formElement, inputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(inputElement.validationMessage).toEqual("When Address Class is A, CIDR must be between 8 and 15.");
        });

        test("入力IPアドレスがクラスBかつCIDRが15の場合、対応するエラーメッセージが設定されること。", () => {

            inputElement.value = "172.16.0.1/15";

            validator.validate(formElement, inputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(inputElement.validationMessage).toEqual("When Address Class is B, CIDR must be between 16 and 23.");
        });

        test("入力IPアドレスがクラスBかつCIDRが24の場合、対応するエラーメッセージが設定されること。", () => {

            inputElement.value = "172.16.0.1/24";

            validator.validate(formElement, inputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(inputElement.validationMessage).toEqual("When Address Class is B, CIDR must be between 16 and 23.");
        });

        test("入力IPアドレスがクラスCかつCIDRが23の場合、対応するエラーメッセージが設定されること。", () => {

            inputElement.value = "192.168.10.1/23";

            validator.validate(formElement, inputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(inputElement.validationMessage).toEqual("When Address Class is C, CIDR must be between 24 and 32.");
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

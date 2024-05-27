import { Validator } from "@/app/_lib/validator";
import { beforeEach, describe, expect, test } from "@jest/globals";

describe("Validator", () => {

    let validator: Validator;

    let formElement: HTMLFormElement;
    let ipv4InputElement: HTMLInputElement;
    let cidrInputElement: HTMLInputElement;

    beforeEach(() => {
        validator = new Validator();

        formElement = document.createElement("form");
        ipv4InputElement = document.createElement("input");
        cidrInputElement = document.createElement("input");
        formElement.appendChild(ipv4InputElement);
        formElement.appendChild(cidrInputElement);
    });

    describe("validate", () => {

        test("<input>要素の値が正常の場合、エラーメッセージが設定されないこと。", () => {

            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "24";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(true);
            expect(ipv4InputElement.validationMessage).toEqual("");
            expect(cidrInputElement.validationMessage).toEqual("");
        });

        test("IPv4アドレスが空文字の場合、対応するエラーメッセージが設定されること。", () => {

            ipv4InputElement.value = "";
            cidrInputElement.value = "24";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(ipv4InputElement.validationMessage).toEqual("IP Address field is required.");
        });

        test("IPv4アドレスがIPv6形式の場合、対応するエラーメッセージが設定されること。", () => {

            ipv4InputElement.value = "::ffff:c0a8:a01";
            cidrInputElement.value = "24";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(ipv4InputElement.validationMessage).toEqual("IP Address must be in format \"IPv4 (000.000.000.000)\".");
        });

        test("IPv4アドレスの第一オクテットが256の場合、対応するエラーメッセージが設定されること。", () => {

            ipv4InputElement.value = "256.168.10.1";
            cidrInputElement.value = "24";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(ipv4InputElement.validationMessage).toEqual("All octets must be between 0 and 255.");
        });

        test("IPv4アドレスの第二オクテットが256の場合、対応するエラーメッセージが設定されること。", () => {

            ipv4InputElement.value = "192.256.10.1";
            cidrInputElement.value = "24";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(ipv4InputElement.validationMessage).toEqual("All octets must be between 0 and 255.");
        });

        test("IPv4アドレスの第三オクテットが256の場合、対応するエラーメッセージが設定されること。", () => {

            ipv4InputElement.value = "192.168.256.1";
            cidrInputElement.value = "24";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(ipv4InputElement.validationMessage).toEqual("All octets must be between 0 and 255.");
        });

        test("IPv4アドレスの第四オクテットが256の場合、対応するエラーメッセージが設定されること。", () => {

            ipv4InputElement.value = "192.168.10.256";
            cidrInputElement.value = "24";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(ipv4InputElement.validationMessage).toEqual("All octets must be between 0 and 255.");
        });

        test("IPv4アドレスの第一オクテットが0始まりの場合、対応するエラーメッセージが設定されること。", () => {

            ipv4InputElement.value = "01.168.10.1";
            cidrInputElement.value = "24";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(ipv4InputElement.validationMessage).toEqual("All octets must not start with 0.");
        });

        test("IPv4アドレスの第二オクテットが0始まりの場合、対応するエラーメッセージが設定されること。", () => {

            ipv4InputElement.value = "192.01.10.1";
            cidrInputElement.value = "24";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(ipv4InputElement.validationMessage).toEqual("All octets must not start with 0.");
        });

        test("IPv4アドレスの第三オクテットが0始まりの場合、対応するエラーメッセージが設定されること。", () => {

            ipv4InputElement.value = "192.168.01.1";
            cidrInputElement.value = "24";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(ipv4InputElement.validationMessage).toEqual("All octets must not start with 0.");
        });

        test("IPv4アドレスの第四オクテットが0始まりの場合、対応するエラーメッセージが設定されること。", () => {

            ipv4InputElement.value = "192.168.10.01";
            cidrInputElement.value = "24";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(ipv4InputElement.validationMessage).toEqual("All octets must not start with 0.");
        });

        test("CIDRが未入力の場合、入力チェックが行われないこと。", () => {

            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(true);
            expect(cidrInputElement.validationMessage).toEqual("");
        });

        test("CIDRが文字列の場合、対応するエラーメッセージが設定されること。", () => {

            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "cidr";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(cidrInputElement.validationMessage).toEqual("CIDR must be numeric.");
        });

        test("CIDRが33の場合、対応するエラーメッセージが設定されること。", () => {

            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "33";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(cidrInputElement.validationMessage).toEqual("CIDR must be between 0 and 32.");
        });

        test("CIDRが0始まりの場合、対応するエラーメッセージが設定されること。", () => {

            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "01";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(cidrInputElement.validationMessage).toEqual("CIDR must not start with 0.");
        });

        test("IPv4アドレスがクラスAかつCIDRが7の場合、対応するエラーメッセージが設定されること。", () => {

            ipv4InputElement.value = "10.0.0.1";
            cidrInputElement.value = "7";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(cidrInputElement.validationMessage).toEqual("When Address Class is A, CIDR must be between 8 and 15.");
        });

        test("IPv4アドレスがクラスAかつCIDRが16の場合、対応するエラーメッセージが設定されること。", () => {

            ipv4InputElement.value = "10.0.0.1";
            cidrInputElement.value = "16";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(cidrInputElement.validationMessage).toEqual("When Address Class is A, CIDR must be between 8 and 15.");
        });

        test("IPv4アドレスがクラスBかつCIDRが15の場合、対応するエラーメッセージが設定されること。", () => {

            ipv4InputElement.value = "172.16.0.1";
            cidrInputElement.value = "15";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(cidrInputElement.validationMessage).toEqual("When Address Class is B, CIDR must be between 16 and 23.");
        });

        test("IPv4アドレスがクラスBかつCIDRが24の場合、対応するエラーメッセージが設定されること。", () => {

            ipv4InputElement.value = "172.16.0.1";
            cidrInputElement.value = "24";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(cidrInputElement.validationMessage).toEqual("When Address Class is B, CIDR must be between 16 and 23.");
        });

        test("IPv4アドレスがクラスCかつCIDRが23の場合、対応するエラーメッセージが設定されること。", () => {

            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "23";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            expect(formElement.checkValidity()).toEqual(false);
            expect(cidrInputElement.validationMessage).toEqual("When Address Class is C, CIDR must be between 24 and 32.");
        });
    });

    describe("hasErrors", () => {

        test("<input>要素の値が正常値の場合、falseが返却されること。", () => {

            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "24";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            const actual = validator.hasErrors();
            expect(actual).toEqual(false);
        });

        test("IPv4アドレス<input>要素の値が異常値の場合、trueが返却されること。", () => {

            ipv4InputElement.value = "";
            cidrInputElement.value = "24";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

            const actual = validator.hasErrors();
            expect(actual).toEqual(true);
        });

        test("CIDRブロック<input>要素の値が異常値の場合、trueが返却されること。", () => {

            ipv4InputElement.value = "192.168.10.1";
            cidrInputElement.value = "cidr";

            validator.validate(formElement, ipv4InputElement, cidrInputElement);

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

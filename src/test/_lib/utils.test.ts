import { Assertions } from "@/app/_lib/assertions";
import { AddressBlock, AddressClass } from "@/app/_lib/const";
import { ArrayUtils, ConversionUtils, EventHandlerUtils, IpAddressUtils } from "@/app/_lib/utils";
import { describe, expect, jest, test } from "@jest/globals";
import { act, fireEvent } from "@testing-library/react";
import { createElement, KeyboardEvent } from "react";
import { createRoot } from "react-dom/client";

describe("ConversionUtils", () => {

    describe("convertDecimalToBinary", () => {

        test("引数の10進数が正しく8桁の2進数へ変換されること。", () => {

            const decimal = 192;
            const actual = ConversionUtils.convertDecimalToBinary(decimal);
            const expected = "11000000";
            expect(actual).toEqual(expected);
        });
    });

    describe("convertBinaryToDecimal", () => {

        test("引数の2進数が正しく10進数へ変換されること。", () => {

            const binary = "11000000";
            const actual = ConversionUtils.convertBinaryToDecimal(binary);
            const expected = 192;
            expect(actual).toEqual(expected);
        });
    });
});

describe("ArrayUtils", () => {

    describe("mapAnElementOfArray", () => {

        test("指定した要素番号の配列要素が、任意の変換関数によって置き換えられること。", () => {

            const array = [0, 1, 2, 3, 4];
            const index = 2;
            const mapper = (element: number) => element + 5;

            const actual = ArrayUtils.mapAnElementOfArray(array, index, mapper);
            const expected = [0, 1, 7, 3, 4];

            expect(actual).toEqual(expected);
        });
    });
});

describe("IpAddressUtils", () => {

    describe("determineAddressClassBy", () => {

        test("引数の10進数IPアドレスが数値配列の時、アドレスクラス未定義が返却されること。", () => {

            const decIpAddress = [0, 0, 0, 0];
            const actual = IpAddressUtils.determineAddressClassBy(decIpAddress);
            const expected = AddressClass.UNDEFINED;
            expect(actual).toEqual(expected);
        });

        test("引数の10進数IPアドレスが数値配列の時、対応するアドレスクラスが返却されること。", () => {

            const decIpAddress = [127, 0, 0, 1];
            const actual = IpAddressUtils.determineAddressClassBy(decIpAddress);
            const expected = AddressClass.LOCALHOST;
            expect(actual).toEqual(expected);
        });

        test("引数の10進数IPアドレスが文字列の時、アドレスクラス未定義が返却されること。", () => {

            const decIpAddress = "0.0.0.0";
            const actual = IpAddressUtils.determineAddressClassBy(decIpAddress);
            const expected = AddressClass.UNDEFINED;
            expect(actual).toEqual(expected);
        });

        test("引数の10進数IPアドレスが文字列の時、対応するアドレスクラスが返却されること。", () => {

            const decIpAddress = "127.0.0.1";
            const actual = IpAddressUtils.determineAddressClassBy(decIpAddress);
            const expected = AddressClass.LOCALHOST;
            expect(actual).toEqual(expected);
        });
    });

    describe("determineAddressBlockBy", () => {

        test("クラスA（パブリック前半）開始2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["00000001", "00000000", "00000000", "00000000"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.A_PUBLIC_FORMER;
            expect(actual).toEqual(expected);
        });

        test("クラスA（パブリック前半）終了2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["00001001", "11111111", "11111111", "11111111"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.A_PUBLIC_FORMER;
            expect(actual).toEqual(expected);
        });

        test("クラスA（プライベート）開始2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["00001010", "00000000", "00000000", "00000000"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.A_PRIVATE_BLOCK;
            expect(actual).toEqual(expected);
        });

        test("クラスA（プライベート）終了2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["00001010", "11111111", "11111111", "11111111"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.A_PRIVATE_BLOCK;
            expect(actual).toEqual(expected);
        });

        test("クラスA（パブリック後半）開始2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["00001011", "00000000", "00000000", "00000000"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.A_PUBLIC_LATTER;
            expect(actual).toEqual(expected);
        });

        test("クラスA（パブリック後半）終了2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["01111110", "11111111", "11111111", "11111111"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.A_PUBLIC_LATTER;
            expect(actual).toEqual(expected);
        });

        test("ローカルホスト開始2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["01111111", "00000000", "00000000", "00000000"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.LOCALHOST_BLOCK;
            expect(actual).toEqual(expected);
        });

        test("ローカルホスト終了2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["01111111", "11111111", "11111111", "11111111"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.LOCALHOST_BLOCK;
            expect(actual).toEqual(expected);
        });

        test("クラスB（パブリック前半）開始2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["10000000", "00000000", "00000000", "00000000"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.B_PUBLIC_FORMER;
            expect(actual).toEqual(expected);
        });

        test("クラスB（パブリック前半）終了2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["10101100", "00001111", "11111111", "11111111"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.B_PUBLIC_FORMER;
            expect(actual).toEqual(expected);
        });

        test("クラスB（プライベート）開始2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["10101100", "00010000", "00000000", "00000000"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.B_PRIVATE_BLOCK;
            expect(actual).toEqual(expected);
        });

        test("クラスB（プライベート）終了2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["10101100", "00011111", "11111111", "11111111"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.B_PRIVATE_BLOCK;
            expect(actual).toEqual(expected);
        });

        test("クラスB（パブリック後半）開始2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["10101100", "00100000", "00000000", "00000000"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.B_PUBLIC_LATTER;
            expect(actual).toEqual(expected);
        });

        test("クラスB（パブリック後半）終了2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["10111111", "11111111", "11111111", "11111111"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.B_PUBLIC_LATTER;
            expect(actual).toEqual(expected);
        });

        test("クラスC（パブリック前半）開始2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["11000000", "00000000", "00000000", "00000000"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.C_PUBLIC_FORMER;
            expect(actual).toEqual(expected);
        });

        test("クラスC（パブリック前半）終了2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["11000000", "10100111", "11111111", "11111111"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.C_PUBLIC_FORMER;
            expect(actual).toEqual(expected);
        });

        test("クラスC（プライベート）開始2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["11000000", "10101000", "00000000", "00000000"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.C_PRIVATE_BLOCK;
            expect(actual).toEqual(expected);
        });

        test("クラスC（プライベート）終了2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["11000000", "10101000", "11111111", "11111111"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.C_PRIVATE_BLOCK;
            expect(actual).toEqual(expected);
        });

        test("クラスC（パブリック後半）開始2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["11000000", "10101001", "00000000", "00000000"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.C_PUBLIC_LATTER;
            expect(actual).toEqual(expected);
        });

        test("クラスC（パブリック後半）終了2進数IPアドレス配列に応じたアドレスブロックが返却されること。", () => {

            const binIpAddressArray = ["11011111", "11111111", "11111111", "11111111"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.C_PUBLIC_LATTER;
            expect(actual).toEqual(expected);
        });

        test("2進数IPアドレス配列に一致するアドレスブロックが無い場合、アドレスブロック未定義が返却されること。", () => {

            const binIpAddressArray = ["00000000", "00000000", "00000000", "00000000"];
            const actual = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);
            const expected = AddressBlock.UNDEFINED;
            expect(actual).toEqual(expected);
        });
    });

    describe("createBinSubnetMaskArray", () => {

        test("オクテットを区切るCIDRに応じた2進数サブネットマスク配列を作成できること。", () => {

            const cidr = 24;
            const actual = IpAddressUtils.createBinSubnetMaskArray(cidr);
            const expected = ["11111111", "11111111", "11111111", "00000000"];
            expect(actual).toEqual(expected);
        });

        test("オクテットをまたぐCIDRに応じた2進数サブネットマスク配列を作成できること。", () => {

            const cidr = 20;
            const actual = IpAddressUtils.createBinSubnetMaskArray(cidr);
            const expected = ["11111111", "11111111", "11110000", "00000000"];
            expect(actual).toEqual(expected);
        });
    });

    describe("createBinArraysOfNetworkAndBroadcast", () => {

        test("オクテットを区切るCIDRに応じた、2進数ネットワークアドレス配列および2進数ブロードキャストアドレス配列を作成できること。", () => {

            const binIpAddressArray = ["11000000", "10101000", "00001010", "00000001"];
            const cidr = 24;
            const actual = IpAddressUtils.createBinArraysOfNetworkAndBroadcast(binIpAddressArray, cidr);

            const binNetworkAddressArray = ["11000000", "10101000", "00001010", "00000000"];
            const binBroadcastAddressArray = ["11000000", "10101000", "00001010", "11111111"];
            const expected = {binNetworkAddressArray, binBroadcastAddressArray};

            expect(actual).toEqual(expected);
        });

        test("オクテットをまたぐCIDRに応じた、2進数ネットワークアドレス配列および2進数ブロードキャストアドレス配列を作成できること。", () => {

            const binIpAddressArray = ["11000000", "10101000", "00001010", "00000001"];
            const cidr = 20;
            const actual = IpAddressUtils.createBinArraysOfNetworkAndBroadcast(binIpAddressArray, cidr);

            const binNetworkAddressArray = ["11000000", "10101000", "00000000", "00000000"];
            const binBroadcastAddressArray = ["11000000", "10101000", "00001111", "11111111"];
            const expected = {binNetworkAddressArray, binBroadcastAddressArray};

            expect(actual).toEqual(expected);
        });
    });
});

describe("EventHandlerUtils", () => {

    describe("handleClickButtonByPressingEnter", () => {

        test("指定されたキーボードイベントのEnterキー押下により、ボタン要素のクリックイベントが発火されること。", () => {

            const container = document.createElement("div");
            const buttonElement = document.createElement("button");

            const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
                EventHandlerUtils.handleClickButtonByPressingEnter(event, buttonElement);
            };
            const reactInputElement = createElement("input", {onKeyDown: handleKeyDown});

            const root = createRoot(container);
            act(() => { root.render(reactInputElement) });
            container.appendChild(buttonElement);

            const inputElement = container.querySelector("input");
            expect(inputElement).not.toBeNull();
            expect(inputElement).toBeInstanceOf(HTMLInputElement);
            Assertions.assertNotNull(inputElement);

            const clickButton = jest.spyOn(buttonElement, "click");

            fireEvent.keyDown(inputElement, {key: "Space"});
            expect(clickButton).not.toHaveBeenCalled();

            fireEvent.keyDown(inputElement, {key: "Enter"});
            expect(clickButton).toHaveBeenCalledTimes(1);
        });
    });
});

import { ArrayUtils, ConversionUtils, IpAddressUtils } from "@/app/_lib/utils";
import { describe, expect, test } from "@jest/globals";

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

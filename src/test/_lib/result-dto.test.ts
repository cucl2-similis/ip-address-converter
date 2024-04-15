import { Builder } from "@/app/_lib/builder";
import { ResultDto } from "@/app/_lib/result-dto";
import { describe, expect, test } from "@jest/globals";

describe("ResultDto", () => {

    describe("ResultDtoBuilder", () => {

        test("変換結果DTOビルダーが変換結果DTOインスタンスを生成できること。", () => {

            const actual = Builder.ofResultDto().build();
            expect(actual).toBeInstanceOf(ResultDto);
        });

        test("変換結果DTOの各初期値が空文字または0であること。", () => {

            const actual = Builder.ofResultDto().build();

            expect(actual.getDecIpAddress()).toEqual("");
            expect(actual.getDecSubnetMask()).toEqual("");
            expect(actual.getDecNetworkAddress()).toEqual("");
            expect(actual.getDecBroadcastAddress()).toEqual("");
            expect(actual.getDecFirstAvailableIpAddress()).toEqual("");
            expect(actual.getDecLastAvailableIpAddress()).toEqual("");
            expect(actual.getBinIpAddress()).toEqual("");
            expect(actual.getBinSubnetMask()).toEqual("");
            expect(actual.getBinNetworkAddress()).toEqual("");
            expect(actual.getBinBroadcastAddress()).toEqual("");
            expect(actual.getBinFirstAvailableIpAddress()).toEqual("");
            expect(actual.getBinLastAvailableIpAddress()).toEqual("");
            expect(actual.getCidr()).toEqual(0);
        });
    });

    describe("getter", () => {

        const resultDto = Builder.ofResultDto()
                .decIpAddressArray([192, 168, 10, 1])
                .decSubnetMaskArray([255, 255, 255, 0])
                .decNetworkAddressArray([192, 168, 10, 0])
                .decBroadcastAddressArray([192, 168, 10, 255])
                .decFirstAvailableIpAddressArray([192, 168, 10, 1])
                .decLastAvailableIpAddressArray([192, 168, 10, 254])
                .binIpAddressArray(["11000000", "10101000", "00001010", "00000001"])
                .binSubnetMaskArray(["11111111", "11111111", "11111111", "00000000"])
                .binNetworkAddressArray(["11000000", "10101000", "00001010", "00000000"])
                .binBroadcastAddressArray(["11000000", "10101000", "00001010", "11111111"])
                .binFirstAvailableIpAddressArray(["11000000", "10101000", "00001010", "00000001"])
                .binLastAvailableIpAddressArray(["11000000", "10101000", "00001010", "11111110"])
                .cidr(24)
                .build();

        test("10進数IPアドレスを取得できること。", () => {

            const expected = "192.168.10.1";
            const actual = resultDto.getDecIpAddress();
            expect(actual).toEqual(expected);
        });

        test("10進数サブネットマスクを取得できること。", () => {

            const expected = "255.255.255.0";
            const actual = resultDto.getDecSubnetMask();
            expect(actual).toEqual(expected);
        });

        test("10進数ネットワークアドレスを取得できること。", () => {

            const expected = "192.168.10.0";
            const actual = resultDto.getDecNetworkAddress();
            expect(actual).toEqual(expected);
        });

        test("10進数ブロードキャストアドレスを取得できること。", () => {

            const expected = "192.168.10.255";
            const actual = resultDto.getDecBroadcastAddress();
            expect(actual).toEqual(expected);
        });

        test("10進数利用可能範囲開始IPアドレスを取得できること。", () => {

            const expected = "192.168.10.1";
            const actual = resultDto.getDecFirstAvailableIpAddress();
            expect(actual).toEqual(expected);
        });

        test("10進数利用可能範囲終了IPアドレスを取得できること。", () => {

            const expected = "192.168.10.254";
            const actual = resultDto.getDecLastAvailableIpAddress();
            expect(actual).toEqual(expected);
        });

        test("2進数IPアドレスを取得できること。", () => {

            const expected = "11000000.10101000.00001010.00000001";
            const actual = resultDto.getBinIpAddress();
            expect(actual).toEqual(expected);
        });

        test("2進数サブネットマスクを取得できること。", () => {

            const expected = "11111111.11111111.11111111.00000000";
            const actual = resultDto.getBinSubnetMask();
            expect(actual).toEqual(expected);
        });

        test("2進数ネットワークアドレスを取得できること。", () => {

            const expected = "11000000.10101000.00001010.00000000";
            const actual = resultDto.getBinNetworkAddress();
            expect(actual).toEqual(expected);
        });

        test("2進数ブロードキャストアドレスを取得できること。", () => {

            const expected = "11000000.10101000.00001010.11111111";
            const actual = resultDto.getBinBroadcastAddress();
            expect(actual).toEqual(expected);
        });

        test("2進数利用可能範囲開始IPアドレスを取得できること。", () => {

            const expected = "11000000.10101000.00001010.00000001";
            const actual = resultDto.getBinFirstAvailableIpAddress();
            expect(actual).toEqual(expected);
        });

        test("2進数利用可能範囲終了IPアドレスを取得できること。", () => {

            const expected = "11000000.10101000.00001010.11111110";
            const actual = resultDto.getBinLastAvailableIpAddress();
            expect(actual).toEqual(expected);
        });

        test("CIDRを取得できること。", () => {

            const expected = 24;
            const actual = resultDto.getCidr();
            expect(actual).toEqual(expected);
        });

        test("利用可能IPアドレス数を取得できること。", () => {

            const expected = "254";
            const actual = resultDto.getNumberOfAvailableIps();
            expect(actual).toEqual(expected);
        });
    });
});

import { Builder } from "@/app/_lib/builder";
import { Converter } from "@/app/_lib/converter";
import { describe, expect, test } from "@jest/globals";

describe("Converter", () => {

    describe("convert", () => {

        test("CIDRブロック付10進数IPアドレス文字列を変換結果DTOに変換できること。", () => {

            const decIpAddressWithCidr = "192.168.10.1/24";
            const converter = new Converter();
            const actual = converter.convert(decIpAddressWithCidr);

            const expected = Builder.ofResultDto()
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

            expect(actual).toEqual(expected);
        });
    });
});

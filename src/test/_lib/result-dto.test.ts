import { ResultDto } from "@/app/_lib/result-dto";
import { describe, expect, test } from "@jest/globals";

describe("ResultDto", () => {

    describe("getter/setter", () => {

        test("10進数IPアドレス配列の初期値が空配列であること。", () => {

            const expected: number[] = [];

            const resultDto = new ResultDto();

            const actual = resultDto.getDecIpAddressArray();
            expect(actual).toEqual(expected);
        });

        test("設定した10進数IPアドレス配列を取得できること。", () => {

            const expected = [192, 168, 10, 1];

            const resultDto = new ResultDto();
            resultDto.setDecIpAddressArray(expected);

            const actual = resultDto.getDecIpAddressArray();
            expect(actual).toEqual(expected);
        });

        test("設定した10進数IPアドレス配列の文字列を取得できること。", () => {

            const expected = "192.168.10.1";

            const resultDto = new ResultDto();
            resultDto.setDecIpAddressArray([192, 168, 10, 1]);

            const actual = resultDto.getDecIpAddress();
            expect(actual).toEqual(expected);
        });

        test("CIDRの初期値が0であること。", () => {

            const expected = 0;

            const resultDto = new ResultDto();

            const actual = resultDto.getCidr();
            expect(actual).toEqual(expected);
        });

        test("設定したCIDRを取得できること。", () => {

            const expected = 24;

            const resultDto = new ResultDto();
            resultDto.setCidr(expected);

            const actual = resultDto.getCidr();
            expect(actual).toEqual(expected);
        });
    });
});

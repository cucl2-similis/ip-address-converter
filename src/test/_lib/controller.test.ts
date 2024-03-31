import { Controller } from "@/app/_lib/controller";
import { ResultDto } from "@/app/_lib/result-dto";
import { describe, expect, jest, test } from "@jest/globals";

describe("Controller", () => {

    describe("convert", () => {

        test("<input>要素がnullの場合、変換結果DTO用のstateセッタ関数が呼び出されないこと。", () => {

            const setResultDto = jest.fn();
            const inputElement = null;

            const controller = new Controller();
            controller.convert(inputElement, setResultDto);

            expect(setResultDto).not.toHaveBeenCalled();
        });

        test("<input>要素の値が空文字の場合、変換結果DTO用のstateセッタ関数が呼び出されないこと。", () => {

            const setResultDto = jest.fn();
            const inputElement = document.createElement("input");
            inputElement.value = "";

            const controller = new Controller();
            controller.convert(inputElement, setResultDto);

            expect(setResultDto).not.toHaveBeenCalled();
        });

        test("<input>要素の値に対応した変換結果DTOが、stateセッタ関数によって設定されること。", () => {

            const setResultDto = jest.fn();
            const inputElement = document.createElement("input");
            inputElement.value = "192.168.10.1/24";

            const controller = new Controller();
            controller.convert(inputElement, setResultDto);

            expect(setResultDto).toHaveBeenCalledTimes(1);

            const resultDto = new ResultDto();
            resultDto.setDecIpAddressArray([192, 168, 10, 1]);
            resultDto.setCidr(24)
            expect(setResultDto).toHaveBeenCalledWith(resultDto);
        });
    });
});

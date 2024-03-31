import { Dispatch, SetStateAction } from "react";
import { ResultDto } from "./result-dto";
import { Regex } from "./const";

/**
 * コントローラ
 */
export class Controller {

    /**
     * 入力IPアドレス変換
     * @param inputElement `<input>`要素
     * @param setResultDto 変換結果DTO用 stateセッタ関数
     */
    public convert(inputElement: HTMLInputElement | null, setResultDto: Dispatch<SetStateAction<ResultDto | null>>): void {

        if (inputElement == null || inputElement.value === "") {
            return;
        }

        const decIpAddressArray = inputElement.value              // IP:     1.2.3.4/5
                                    .split(Regex.PERIOD_OR_SLASH) // array = 1,2,3,4,5 ──┐
                                    .map(Number);                 // array = 1,2,3,4  <──┤ pop
        const cidr = Number(decIpAddressArray.pop());             // cidr  = 5        <──┘

        const resultDto = new ResultDto();
        resultDto.setDecIpAddressArray(decIpAddressArray);
        resultDto.setCidr(cidr);

        setResultDto(resultDto);
    }
}

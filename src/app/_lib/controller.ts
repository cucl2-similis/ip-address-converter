import { Dispatch, SetStateAction } from "react";
import { Assertions } from "./assertions";
import { Regex } from "./const";
import { ResultDto } from "./result-dto";
import { Validator } from "./validator";

/**
 * コントローラ
 */
export class Controller {

    /** バリデータ */
    private readonly validator: Validator;

    /** `was-validated`クラス設定要否boolean用 stateセッタ関数 */
    private readonly setWasValidated: Dispatch<SetStateAction<boolean>>;
    /** `invalid-feedback`クラス要素内容文字列用 stateセッタ関数 */
    private readonly setInvalidFeedback: Dispatch<SetStateAction<string>>;
    /** 変換結果DTO用 stateセッタ関数 */
    private readonly setResultDto: Dispatch<SetStateAction<ResultDto | null>>;

    /**
     * コントローラ
     * @param setWasValidated `was-validated`クラス設定要否boolean用 stateセッタ関数
     * @param setInvalidFeedback `invalid-feedback`クラス要素内容文字列用 stateセッタ関数
     * @param setResultDto 変換結果DTO用 stateセッタ関数
     */
    public constructor(setWasValidated: Dispatch<SetStateAction<boolean>>,
                       setInvalidFeedback: Dispatch<SetStateAction<string>>,
                       setResultDto: Dispatch<SetStateAction<ResultDto | null>>) {

        this.validator = new Validator();

        this.setWasValidated = setWasValidated;
        this.setInvalidFeedback = setInvalidFeedback;
        this.setResultDto = setResultDto;
    }

    /**
     * 入力IPアドレス変換
     * @param formElement `<form>`要素
     * @param inputElement `<input>`要素
     */
    public convert(formElement: HTMLFormElement | null, inputElement: HTMLInputElement | null): void {

        Assertions.assertNotNull(formElement);
        Assertions.assertNotNull(inputElement);

        this.validator.validate(formElement, inputElement);

        if (this.validator.hasErrors()) {
            this.setWasValidated(true);
            this.setInvalidFeedback(inputElement.validationMessage);
            return;
        }

        const decIpAddressArray = inputElement.value              // IP:     1.2.3.4/5
                                    .split(Regex.PERIOD_OR_SLASH) // array = 1,2,3,4,5 ──┐
                                    .map(Number);                 // array = 1,2,3,4  <──┤ pop
        const cidr = Number(decIpAddressArray.pop());             // cidr  = 5        <──┘

        const resultDto = new ResultDto();
        resultDto.setDecIpAddressArray(decIpAddressArray);
        resultDto.setCidr(cidr);

        this.setResultDto(resultDto);
    }
}

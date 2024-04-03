import { Dispatch, SetStateAction } from "react";
import { Assertions } from "./assertions";
import { Regex } from "./const";
import { ResultDto } from "./result-dto";
import { Validator } from "./validator";
import { View } from "./view";

/**
 * コントローラ
 */
export class Controller {

    /** バリデータ */
    private readonly validator: Validator;

    /** ビュー（画面表示制御） */
    private readonly view: View;

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
        this.view = new View(setWasValidated, setInvalidFeedback);
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

        // 入力チェックエラーありの場合
        if (this.validator.hasErrors()) {

            // 入力値の変更イベント発生時の関数を設定
            inputElement.oninput = () => {
                this.validator.validate(formElement, inputElement);           // 再検証
                this.view.updateErrorMessage(inputElement.validationMessage); // 画面表示内容更新
            };

            // バリデータによる検証で<input>要素に設定されたエラーメッセージで画面表示内容を更新
            this.view.updateErrorMessage(inputElement.validationMessage);
            return;
        }

        // 入力チェックエラーなしの場合
        inputElement.oninput = () => {}; // 入力値の変更イベント発生時の関数を削除
        this.view.updateErrorMessage();  // エラーメッセージを非表示に更新

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

import { Dispatch, SetStateAction } from "react";
import { Assertions } from "./assertions";
import { Converter } from "./converter";
import { ResultDto } from "./result-dto";
import { Validator } from "./validator";
import { View } from "./view";

/**
 * コントローラ（ボタンイベント管理）
 */
export class Controller {

    /** コンバータ（変換ロジック） */
    private readonly converter: Converter;

    /** バリデータ（入力チェック） */
    private readonly validator: Validator;

    /** ビュー（画面表示制御） */
    private readonly view: View;

    /** 変換結果DTO用 stateセッタ関数 */
    private readonly setResultDto: Dispatch<SetStateAction<ResultDto | null>>;

    /**
     * コントローラ（ボタンイベント管理）
     * @param converter コンバータ（変換ロジック）
     * @param validator バリデータ（入力チェック）
     * @param view ビュー（画面表示制御）
     * @param setResultDto 変換結果DTO用 stateセッタ関数
     */
    public constructor(converter: Converter,
                       validator: Validator,
                       view: View,
                       setResultDto: Dispatch<SetStateAction<ResultDto | null>>) {
        this.converter = converter;
        this.validator = validator;
        this.view = view;
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

        // 入力チェック
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

        // 変換
        const resultDto = this.converter.convert(inputElement.value); // 変換処理実行
        this.setResultDto(resultDto);                                 // 変換結果設定
    }
}

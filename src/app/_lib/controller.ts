import { Assertions } from "./assertions";
import { Converter } from "./converter";
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

    /**
     * コントローラ（ボタンイベント管理）
     * @param converter コンバータ（変換ロジック）
     * @param validator バリデータ（入力チェック）
     * @param view ビュー（画面表示制御）
     */
    public constructor(converter: Converter,
                       validator: Validator,
                       view: View) {
        this.converter = converter;
        this.validator = validator;
        this.view = view;
    }

    /**
     * 入力IPアドレス変換
     * @param formElement `<form>`要素
     * @param inputIpv4 IPv4`<input>`要素
     * @param inputCidr CIDR`<input>`要素
     */
    public convert(formElement: HTMLFormElement | null,
                   inputIpv4: HTMLInputElement | null,
                   inputCidr: HTMLInputElement | null): void {

        Assertions.assertNotNull(formElement);
        Assertions.assertNotNull(inputIpv4);
        Assertions.assertNotNull(inputCidr);

        // 入力チェック
        this.validator.validate(formElement, inputIpv4, inputCidr);

        // 入力チェックエラーありの場合
        if (this.validator.hasErrors()) {

            // 入力値の変更イベント発生時の関数を設定
            const onInputFunction = () => {
                this.validator.validate(formElement, inputIpv4, inputCidr);                              // 再検証
                this.view.updateErrorMessages(inputIpv4.validationMessage, inputCidr.validationMessage); // 画面表示内容更新
            };
            inputIpv4.oninput = onInputFunction; // IPv4アドレス<input>要素に設定
            inputCidr.oninput = onInputFunction; // CIDRブロック<input>要素に設定

            // バリデータの検証によって<input>要素に設定されたエラーメッセージで画面表示内容を更新
            this.view.updateErrorMessages(inputIpv4.validationMessage, inputCidr.validationMessage);
            return;
        }

        // 入力チェックエラーなしの場合
        inputIpv4.oninput = () => {};   // 入力値の変更イベント発生時の関数を削除（IPv4アドレス<input>要素）
        inputCidr.oninput = () => {};   // 入力値の変更イベント発生時の関数を削除（CIDRブロック<input>要素）
        this.view.updateErrorMessage(); // エラーメッセージを非表示に更新

        // 変換
        const resultDto = this.converter.convert(inputIpv4.value, inputCidr.value); // 変換処理実行
        this.view.updateResult(resultDto);                                          // 変換結果更新
    }
}

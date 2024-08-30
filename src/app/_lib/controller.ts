import { Assertions } from "./assertions";
import { Char } from "./const";
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
     * @param ipv4InputElement IPv4アドレス`<input>`要素
     * @param cidrInputElement CIDRブロック`<input>`要素
     * @param defaultCidr CIDRブロックデフォルト値 state変数
     */
    public convert(formElement: HTMLFormElement | null,
                   ipv4InputElement: HTMLInputElement | null,
                   cidrInputElement: HTMLInputElement | null,
                   defaultCidr: string): void {

        Assertions.assertNotNull(formElement);
        Assertions.assertNotNull(ipv4InputElement);
        Assertions.assertNotNull(cidrInputElement);

        // IPv4アドレス<input>要素のデフォルト入力値変更イベント
        const defaultIpv4InputEvent = () => this.view.updateDefaultCidrBasedOn(ipv4InputElement.value);

        // 入力チェック
        this.validator.validate(formElement, ipv4InputElement, cidrInputElement);

        // 入力チェックエラーありの場合
        if (this.validator.hasErrors()) {

            // エラーがある場合の入力値変更イベント
            const inputEventIfErrorExists = () => {
                this.validator.validate(formElement, ipv4InputElement, cidrInputElement);                              // 再検証
                this.view.updateErrorMessages(ipv4InputElement.validationMessage, cidrInputElement.validationMessage); // 画面表示内容更新
            };

            // IPv4アドレス<input>要素の入力値変更イベントを設定
            ipv4InputElement.oninput = () => { defaultIpv4InputEvent();
                                               inputEventIfErrorExists(); };
            // CIDRブロック<input>要素の入力値変更イベントを設定
            cidrInputElement.oninput = inputEventIfErrorExists;

            // バリデータの検証によって<input>要素に設定されたエラーメッセージで画面表示内容を更新
            this.view.updateErrorMessages(ipv4InputElement.validationMessage, cidrInputElement.validationMessage);
            return;
        }

        // 入力チェックエラーなしの場合
        ipv4InputElement.oninput = defaultIpv4InputEvent; // デフォルト入力値変更イベントを設定
        cidrInputElement.oninput = null;                  // 入力値変更イベントを削除
        this.view.updateErrorMessage();                   // エラーメッセージを非表示に更新

        // CIDRブロックの値を設定
        const cidr = cidrInputElement.value === Char.EMPTY ? defaultCidr : cidrInputElement.value;

        // 変換
        const resultDto = this.converter.convert(ipv4InputElement.value, cidr); // 変換処理実行
        this.view.updateResult(resultDto);                                      // 変換結果更新
    }
}

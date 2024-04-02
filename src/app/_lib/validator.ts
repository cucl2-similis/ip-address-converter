import { Symbol } from "./const";

/**
 * バリデータ
 */
export class Validator {

    /** `<form>`要素 */
    private formElement: HTMLFormElement | null = null;

    /**
     * 入力値の検証
     * 
     * `<input>`要素の入力値を検証し、  
     * `<form>`要素にエラー有無を、`<input>`要素にエラーメッセージを設定する。
     * @param formElement `<form>`要素
     * @param inputElement `<input>`要素
     */
    public validate(formElement: HTMLFormElement, inputElement: HTMLInputElement): void {
        this.formElement = formElement;
        VerificationStream.of(inputElement)
            .errorHandle("This field is required.", inputValue => inputValue === Symbol.EMPTY)
            .verify();
    }

    /**
     * 入力チェックエラー有無の確認
     * @returns 入力チェックエラー有の場合は`true`
     * @throws `Error` `Validator#validate()`を実行せずに`hasErrors()`が呼び出された場合
     */
    public hasErrors(): boolean {
        if (this.formElement == null) {
            throw new Error("'Validator#validate()' must be called before 'hasErrors()' is executed.");
        }
        return !this.formElement.checkValidity();
    }
}

/**
 * 検証ストリーム
 * 
 * 指定された検証対象`<input>`要素の入力値に対して、  
 * 追加されたエラーハンドリング関数を使用した入力チェックを行う。
 * 
 * 入力チェックはエラーハンドリング関数が追加された順に実行し、  
 * エラーが一つ見つかった時点で検証を終了し、`<input>`要素にエラーメッセージを追加する。
 */
class VerificationStream {

    /** 検証対象`<input>`要素 */
    private inputElement: HTMLInputElement;

    /** Map<エラーメッセージ, エラーハンドリング関数> */
    private errorHandlerMap = new Map<string, (inputValue: string) => boolean>();

    private constructor(inputElement: HTMLInputElement) {
        this.inputElement = inputElement;
    }

    /**
     * 検証ストリームの生成
     * @param inputElement 検証対象`<input>`要素
     * @returns 検証ストリーム
     */
    public static of(inputElement: HTMLInputElement): VerificationStream {
        return new VerificationStream(inputElement);
    }

    /**
     * エラーハンドリングの追加
     * @param errorMessage エラーメッセージ
     * @param errorHandler エラーハンドリング関数（`true`の場合はエラー）
     * @returns 検証ストリーム
     */
    public errorHandle(errorMessage: string, errorHandler: (inputValue: string) => boolean): VerificationStream {
        this.errorHandlerMap.set(errorMessage, errorHandler);
        return this;
    }

    /**
     * 入力値の検証
     * 
     * `errorHandle`で追加されたエラーハンドリング関数を順に適用し、入力チェックを進める。  
     * エラーが一つでも見つかった場合、その時点で対になるエラーメッセージを設定して検証を終了する。  
     * 入力チェックエラーの有無に応じ、検証対象`<input>`要素のカスタム検証メッセージ設定を行う。
     * - 入力チェックエラーなしの場合
     *   - `<input>`要素のカスタム検証メッセージに空文字を設定し、エラーがないことを明示する。
     * - 入力チェックエラーありの場合
     *   - `<input>`要素のカスタム検証メッセージにエラーメッセージを設定する。
     */
    public verify(): void {

        // 追加された順にエラーメッセージとエラーハンドリング関数のペアを処理
        for (const [errorMessage, errorHandler] of this.errorHandlerMap) {

            // エラーハンドリング関数を適用して入力値を検証
            if (errorHandler(this.inputElement.value)) {
                this.inputElement.setCustomValidity(errorMessage);
                return; // エラーが見つかった場合は検証終了
            }
        }

        // エラーがない場合は空文字を設定
        this.inputElement.setCustomValidity(Symbol.EMPTY);
    }
}

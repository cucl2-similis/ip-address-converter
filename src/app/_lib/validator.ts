import { AddressClass, Char, IpAddress, Regex } from "./const";
import { InvalidCallError } from "./errors";
import { IpAddressUtils } from "./utils";

/**
 * バリデータ（入力チェック）
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
     * @param ipv4InputElement IPv4アドレス`<input>`要素
     * @param cidrInputElement CIDRブロック`<input>`要素
     */
    public validate(formElement: HTMLFormElement,
                    ipv4InputElement: HTMLInputElement,
                    cidrInputElement: HTMLInputElement): void {

        // <form>要素設定
        this.formElement = formElement;

        // IPv4アドレス検証
        VerificationStream.of(ipv4InputElement)
            .errorHandle("IP Address field is required.", ipv4 => ipv4 === Char.EMPTY)
            .errorHandle("IP Address must be in format \"IPv4 (000.000.000.000)\".", ipv4 => ipv4.search(Regex.FORMAT_OF_IPV4_ADDRESS) === -1)
            .errorHandle("All octets must be between 0 and 255.", ipv4 => ipv4.split(Regex.PERIOD).map(Number).some(octet => octet < 0 || 255 < octet))
            .errorHandle("All octets must not start with 0.", ipv4 => ipv4.split(Regex.PERIOD).some(Validations.startsWithZero))
            .verify();

        // CIDRブロック未入力の場合は空のエラーメッセージを設定して検証終了
        if (cidrInputElement.value === Char.EMPTY) {
            cidrInputElement.setCustomValidity(Char.EMPTY);
            return;
        }

        // CIDRブロック検証
        VerificationStream.of(cidrInputElement)
            .errorHandle("CIDR must be numeric.", cidr => cidr.search(Regex.NUMBERS_ONLY) === -1)
            .errorHandle("CIDR must be between 0 and 32.", cidr => Number(cidr) < 0 || 32 < Number(cidr))
            .errorHandle("CIDR must not start with 0.", Validations.startsWithZero)
            .errorHandle("When Address Class is A, CIDR must be between 8 and 15.",  cidr => Validations.isIncorrectRangeOfCidrWhen(AddressClass.A, ipv4InputElement.value, cidr))
            .errorHandle("When Address Class is B, CIDR must be between 16 and 23.", cidr => Validations.isIncorrectRangeOfCidrWhen(AddressClass.B, ipv4InputElement.value, cidr))
            .errorHandle("When Address Class is C, CIDR must be between 24 and 32.", cidr => Validations.isIncorrectRangeOfCidrWhen(AddressClass.C, ipv4InputElement.value, cidr))
            .verify();
    }

    /**
     * 入力チェックエラー有無の確認
     * @returns 入力チェックエラー有の場合は`true`
     * @throws :{@linkcode InvalidCallError} `Validator#validate()`を実行せずに`hasErrors()`が呼び出された場合
     */
    public hasErrors(): boolean {
        if (this.formElement == null) {
            throw new InvalidCallError("'Validator#validate()' must be called before 'hasErrors()' is executed.");
        }
        return !this.formElement.checkValidity();
    }
}

/**
 * バリデーション（入力チェック用ユーティリティメソッドのコレクション）
 */
class Validations {

    /**
     * 入力値が`0`以外の`0`で始まる値であることを検証する。
     * @param inputValue 入力値
     * @returns `0`以外の`0`で始まる値である場合は`true`
     */
    public static startsWithZero(inputValue: string): boolean {
        return inputValue !== IpAddress.BIT_STR_ZERO          // 入力値が「0」でなく
            && inputValue.startsWith(IpAddress.BIT_STR_ZERO); // かつ「0」始まりの場合はtrue
    }

    /**
     * 10進数IPアドレスが、指定されたアドレスクラスの場合、CIDRの範囲が正しいことを検証する。  
     * 10進数IPアドレスが、指定されたアドレスクラスでない場合は、CIDRの値に関わらず`true`を返却する。
     * @param addressClass アドレスクラス
     * @param decIpAddress 10進数IPアドレス
     * @param cidr CIDR
     * @returns CIDRの範囲が正しい（または10進数IPアドレスが指定されたアドレスクラスでない）場合は`true`
     */
    public static isCorrectRangeOfCidrWhen(addressClass: AddressClass, decIpAddress: string, cidr: string): boolean {

        // 10進数IPアドレスが指定されたアドレスクラスでない場合はtrueを返却
        const classOfIpAddrArg = IpAddressUtils.determineAddressClassBy(decIpAddress);
        if (addressClass !== classOfIpAddrArg) {
            return true;
        }

        // 指定されたアドレスクラスに応じた正しいCIDR範囲であることを検証
        return addressClass.cidr <= Number(cidr) && Number(cidr) <= addressClass.lastCidr;
    }

    /**
     * 10進数IPアドレスが、指定されたアドレスクラスの場合、CIDRの範囲が正しくないことを検証する。  
     * 10進数IPアドレスが、指定されたアドレスクラスでない場合は、CIDRの値に関わらず`false`を返却する。
     * @param addressClass アドレスクラス
     * @param decIpAddress 10進数IPアドレス
     * @param cidr CIDR
     * @returns CIDRの範囲が正しくない場合は`true`
     */
    public static isIncorrectRangeOfCidrWhen(addressClass: AddressClass, decIpAddress: string, cidr: string): boolean {
        return !Validations.isCorrectRangeOfCidrWhen(addressClass, decIpAddress, cidr);
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
        this.inputElement.setCustomValidity(Char.EMPTY);
    }
}

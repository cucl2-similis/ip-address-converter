import { AddressClass, IpAddress, Regex, Symbol } from "./const";

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
     * @param inputElement `<input>`要素
     */
    public validate(formElement: HTMLFormElement, inputElement: HTMLInputElement): void {
        this.formElement = formElement;
        VerificationStream.of(inputElement)
            .errorHandle("This field is required.", inputValue => inputValue === Symbol.EMPTY)
            .errorHandle("Input value must be in format \"IP/CIDR (000.000.000.000/00)\".", Validations.isNotFormatOfIpWithCidr)
            .errorHandle("All octets must be between 0 and 255, and CIDR must be between 0 and 32.", Validations.isIncorrectRangeOfOctetsAndCidr)
            .errorHandle("All octets and CIDR must not start with 0.", Validations.startsWithZero)
            .errorHandle("When Address Class is A, CIDR must be between 8 and 15.",  inputValue => Validations.isIncorrectRangeOfCidrWhen(AddressClass.A, inputValue))
            .errorHandle("When Address Class is B, CIDR must be between 16 and 23.", inputValue => Validations.isIncorrectRangeOfCidrWhen(AddressClass.B, inputValue))
            .errorHandle("When Address Class is C, CIDR must be between 24 and 32.", inputValue => Validations.isIncorrectRangeOfCidrWhen(AddressClass.C, inputValue))
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
 * バリデーション（入力チェック用ユーティリティメソッドのコレクション）
 */
class Validations {

    /**
     * 入力値「IPアドレス/CIDRブロック」の各オクテットおよびCIDRブロックが  
     * `0`で始まる値（`0`を除く）であることを検証する。
     * @param inputValue 入力値
     * @returns 各オクテットまたはCIDRブロックが`0`で始まる値（`0`を除く）の場合は`true`
     */
    public static startsWithZero(inputValue: string): boolean {

        const [ipv4, cidr] = inputValue.split(Regex.SLASH);

        // IPv4検証
        for (const octet of ipv4.split(Regex.PERIOD)) {
            // オクテットが「0」の場合は次のオクテットへ進む
            if (octet === IpAddress.BIT_STR_ZERO) {
                continue;
            }
            // オクテットが「0」始まりの場合はtrue
            if (octet.startsWith(IpAddress.BIT_STR_ZERO)) {
                return true;
            }
        }

        // CIDR検証
        return cidr !== IpAddress.BIT_STR_ZERO          // CIDRが「0」でなく
            && cidr.startsWith(IpAddress.BIT_STR_ZERO); // かつ「0」始まりの場合はtrue
    }

    /**
     * 入力値が「IPアドレス/CIDRブロック」の形式に沿っていないことを検証する。
     * - 「IPアドレス/CIDRブロック」の形式：`000.000.000.000/00`
     *   - 第一～第四オクテットが `.` で区切られていること。
     *   - 第一～第四オクテットが1～3桁の数字であること。
     *   - CIDRブロックが `/` で区切られていること。
     *   - CIDRブロックが1～2桁の数字であること。
     * @param inputValue 入力値
     * @returns 入力値が「IPアドレス/CIDRブロック」の形式に沿っていない場合は`true`
     */
    public static isNotFormatOfIpWithCidr(inputValue: string): boolean {
        return inputValue.search(Regex.FORMAT_OF_IP_WITH_CIDR) === -1;
    }

    /**
     * 入力値「IPアドレス/CIDRブロック」の  
     * 各オクテットが0～255の範囲内であること、  
     * CIDRブロックが0～32の範囲内であることを検証する。
     * @param inputValue 入力値
     * @returns 各オクテットおよびCIDRブロックが範囲内の場合は`true`
     */
    public static isCorrectRangeOfOctetsAndCidr(inputValue: string): boolean {

        const [ipv4, cidr] = inputValue.split(Regex.SLASH);

        return Validations.isCorrectRangeOfOctets(ipv4)
            && Validations.isCorrectRangeOfCidr(cidr);
    }

    /**
     * 入力値「IPアドレス/CIDRブロック」の  
     * 各オクテットが0～255の範囲内でないこと、  
     * CIDRブロックが0～32の範囲内でないことを検証する。
     * @param inputValue 入力値
     * @returns 各オクテットまたはCIDRブロックが範囲外の場合は`true`
     */
    public static isIncorrectRangeOfOctetsAndCidr(inputValue: string): boolean {
        return !Validations.isCorrectRangeOfOctetsAndCidr(inputValue);
    }

    /**
     * 入力値「IPアドレス/CIDRブロック」のうち、  
     * IPアドレスが指定されたアドレスクラスの場合、CIDRブロックの範囲が正しいことを検証する。  
     * IPアドレスが指定されたアドレスクラスでない場合は、CIDRブロックの値に関わらず`true`を返却する。
     * @param addressClass アドレスクラス
     * @param inputValue 入力値
     * @returns CIDRブロックの範囲が正しい（またはIPアドレスが指定されたアドレスクラスでない）場合は`true`
     */
    public static isCorrectRangeOfCidrWhen(addressClass: AddressClass, inputValue: string): boolean {

        const [firstOctet, second, third, fourth, cidr] = inputValue.split(Regex.PERIOD_OR_SLASH)
                                                                    .map(Number);
        switch (addressClass) {
            case AddressClass.A:
                return Validations.isCorrectRangeOfCidrWhenClassA(firstOctet, cidr);
            case AddressClass.B:
                return Validations.isCorrectRangeOfCidrWhenClassB(firstOctet, cidr);
            case AddressClass.C:
                return Validations.isCorrectRangeOfCidrWhenClassC(firstOctet, cidr);
            default:
                return true;
        }
    }

    /**
     * 入力値「IPアドレス/CIDRブロック」のうち、  
     * IPアドレスが指定されたアドレスクラスの場合、CIDRブロックの範囲が正しくないことを検証する。  
     * IPアドレスが指定されたアドレスクラスでない場合は、CIDRブロックの値に関わらず`false`を返却する。
     * @param addressClass アドレスクラス
     * @param inputValue 入力値
     * @returns IPアドレスが指定されたアドレスクラスであり、かつCIDRブロックの範囲が正しくない場合は`true`
     */
    public static isIncorrectRangeOfCidrWhen(addressClass: AddressClass, inputValue: string): boolean {
        return !Validations.isCorrectRangeOfCidrWhen(addressClass, inputValue);
    }

    /**
     * 指定されたIPアドレスの各オクテットの範囲が正しい（0～255である）ことを検証する。
     * @param ipv4 IPv4（`.`区切り）文字列
     * @returns 各オクテットの範囲が正しい（0～255である）場合は`true`
     */
    private static isCorrectRangeOfOctets(ipv4: string): boolean {
        return ipv4.split(Regex.PERIOD)                         //「.」で分割
                   .map(Number)                                 // 数値に変換
                   .filter(octet => 0 <= octet && octet <= 255) // 各オクテットの範囲が0～255であることを条件に絞り込み
                   .length == 4;                                // 第一～第四すべてのオクテットが条件を満たす場合はtrue
    }

    /**
     * 指定されたCIDRの範囲が正しい（0～32である）ことを検証する。
     * @param cidr CIDR
     * @returns CIDRの範囲が正しい（0～32である）場合は`true`
     */
    private static isCorrectRangeOfCidr(cidr: string): boolean {
        return 0 <= Number(cidr) && Number(cidr) <= 32;
    }

    /**
     * 指定された第一オクテットから判断できるIPアドレスがクラスAの場合、  
     * CIDRがクラスAの正しい範囲（8～15）であることを検証する。  
     * クラスAでない場合はCIDRの値に関わらず`true`を返却する。
     * @param firstOctet 第一オクテット
     * @param cidr CIDR
     * @returns CIDRの範囲が正しい（またはクラスAでない）場合は`true`
     */
    private static isCorrectRangeOfCidrWhenClassA(firstOctet: number, cidr: number): boolean {
        // 第一オクテットからクラスAでないと判断された場合は検証を行わずtrueを返却
        if (firstOctet < 1 || 126 < firstOctet) {
            return true; //（クラスAは第一オクテットが1～126）
        }
        // CIDRが8～15の範囲内である場合はtrue
        return 8 <= cidr && cidr <= 15;
    }

    /**
     * 指定された第一オクテットから判断できるIPアドレスがクラスBの場合、  
     * CIDRがクラスBの正しい範囲（16～23）であることを検証する。  
     * クラスBでない場合はCIDRの値に関わらず`true`を返却する。
     * @param firstOctet 第一オクテット
     * @param cidr CIDR
     * @returns CIDRの範囲が正しい（またはクラスBでない）場合は`true`
     */
    private static isCorrectRangeOfCidrWhenClassB(firstOctet: number, cidr: number): boolean {
        // 第一オクテットからクラスBでないと判断された場合は検証を行わずtrueを返却
        if (firstOctet < 128 || 191 < firstOctet) {
            return true; //（クラスBは第一オクテットが128～191）
        }
        // CIDRが16～23の範囲内である場合はtrue
        return 16 <= cidr && cidr <= 23;
    }

    /**
     * 指定された第一オクテットから判断できるIPアドレスがクラスCの場合、  
     * CIDRがクラスCの正しい範囲（24～32）であることを検証する。  
     * クラスCでない場合はCIDRの値に関わらず`true`を返却する。
     * @param firstOctet 第一オクテット
     * @param cidr CIDR
     * @returns CIDRの範囲が正しい（またはクラスCでない）場合は`true`
     */
    private static isCorrectRangeOfCidrWhenClassC(firstOctet: number, cidr: number): boolean {
        // 第一オクテットからクラスCでないと判断された場合は検証を行わずtrueを返却
        if (firstOctet < 192 || 223 < firstOctet) {
            return true; //（クラスCは第一オクテットが192～223）
        }
        // CIDRが24～32の範囲内である場合はtrue
        return 24 <= cidr && cidr <= 32;
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

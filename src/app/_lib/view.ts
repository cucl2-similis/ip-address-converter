import { Dispatch, SetStateAction } from "react";
import { Char } from "./const";
import { ResultDto } from "./result-dto";
import { IpAddressUtils } from "./utils";

/**
 * ビュー（画面表示制御）
 */
export class View {

    /** `was-validated`クラス設定要否boolean用 stateセッタ関数 */
    private readonly setWasValidated: Dispatch<SetStateAction<boolean>>;
    /** `invalid-feedback`クラス要素内容文字列用 stateセッタ関数 */
    private readonly setInvalidFeedback: Dispatch<SetStateAction<string>>;
    /** CIDRブロックデフォルト値用 stateセッタ関数 */
    private readonly setDefaultCidr: Dispatch<SetStateAction<string>>;
    /** 変換結果DTO用 stateセッタ関数 */
    private readonly setResultDto: Dispatch<SetStateAction<ResultDto | null>>;

    /**
     * ビュー（画面表示制御）
     * @param setWasValidated `was-validated`クラス設定要否boolean用 stateセッタ関数
     * @param setInvalidFeedback `invalid-feedback`クラス要素内容文字列用 stateセッタ関数
     * @param setDefaultCidr CIDRブロックデフォルト値用 stateセッタ関数
     * @param setResultDto 変換結果DTO用 stateセッタ関数
     */
    public constructor(setWasValidated: Dispatch<SetStateAction<boolean>>,
                       setInvalidFeedback: Dispatch<SetStateAction<string>>,
                       setDefaultCidr: Dispatch<SetStateAction<string>>,
                       setResultDto: Dispatch<SetStateAction<ResultDto | null>>) {
        this.setWasValidated = setWasValidated;
        this.setInvalidFeedback = setInvalidFeedback;
        this.setDefaultCidr = setDefaultCidr;
        this.setResultDto = setResultDto;
    }

    /**
     * CIDRブロックデフォルト値の更新
     * 
     * 指定されたIPv4文字列に基づき、CIDRブロックのデフォルト値を更新する。
     * - IPv4文字列がクラスＡの場合 → CIDRブロックのデフォルト値を「8」で更新
     * - IPv4文字列がクラスＢの場合 → CIDRブロックのデフォルト値を「16」で更新
     * - IPv4文字列がクラスＣの場合 → CIDRブロックのデフォルト値を「24」で更新
     * - IPv4文字列が上記以外の場合 → CIDRブロックのデフォルト値を「0」で更新
     * 
     * 引数のIPv4文字列が`undefined`の場合は何もしない。
     * @param ipv4 IPv4文字列
     */
    public updateDefaultCidrBasedOn(ipv4: string | undefined): void {
        if (ipv4 == undefined) {
            return;
        }
        const addressClass = IpAddressUtils.determineAddressClassBy(ipv4);
        this.setDefaultCidr(String(addressClass.cidr));
    }

    /**
     * エラーメッセージ表示の更新
     * - 引数`errorMessage`省略の場合
     *   - `setWasValidated`で`false`を設定し、エラーメッセージを非表示にする。
     *   - `setInvalidFeedback`により、エラーメッセージ表示域を空文字で更新する。
     * - 引数`errorMessage`ありの場合
     *   - `setWasValidated`で`true`を設定し、エラーメッセージを表示する。
     *   - `setInvalidFeedback`により、指定されたエラーメッセージで表示内容を更新する。
     * @param errorMessage エラーメッセージ
     */
    public updateErrorMessage(errorMessage?: string): void {
        if (errorMessage == undefined) {
            this.setWasValidated(false);
            this.setInvalidFeedback(Char.EMPTY);
            return;
        }
        this.setWasValidated(true);
        this.setInvalidFeedback(errorMessage);
    }

    /**
     * エラーメッセージ表示の更新
     * - 引数`errorMessages`が全て空文字の場合
     *   - 空文字でエラーメッセージ表示内容を更新する。
     *   - {@link updateErrorMessage} を使用し、エラーメッセージ表示の更新を行う。
     * - 引数`errorMessages`にエラーメッセージが含まれる場合
     *   - 空文字でない最初のエラーメッセージで表示内容を更新する。
     *   - {@link updateErrorMessage} を使用し、エラーメッセージ表示の更新を行う。
     * @param errorMessages エラーメッセージ
     */
    public updateErrorMessages(...errorMessages: string[]): void {
        const firstErrMsg = errorMessages.find(errorMessage => errorMessage !== Char.EMPTY);
        this.updateErrorMessage(firstErrMsg == undefined ? Char.EMPTY : firstErrMsg);
    }

    /**
     * 変換結果表示の更新  
     * 
     * 引数に指定された変換結果DTOで変換結果表示を更新する。  
     * 引数が`null`の場合は初期表示へ更新する。
     * @param resultDto 変換結果DTO
     */
    public updateResult(resultDto: ResultDto | null): void {
        this.setResultDto(resultDto);
    }
}

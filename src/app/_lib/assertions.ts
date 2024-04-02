/**
 * アサーション
 */
export class Assertions {

    private constructor() { }

    /**
     * 引数`param`が`null`または`undefined`でないことをアサート
     * @param param アサート対象
     * @throws `Error` 引数`param`が`null`または`undefined`の場合
     */
    public static assertNotNull<T>(param: T | null | undefined): asserts param is T {
        if (param === null) {
            throw new Error(param + " is null.");
        }
        if (param === undefined) {
            throw new Error(param + " is undefined.");
        }
    }
}

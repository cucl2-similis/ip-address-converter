import { AssertionError } from "./errors";

/**
 * アサーション
 */
export class Assertions {

    private constructor() { }

    /**
     * 引数`param`が`null`または`undefined`でないことをアサート
     * @param param アサート対象
     * @throws :{@linkcode AssertionError} 引数`param`が`null`または`undefined`の場合
     */
    public static assertNotNull<T>(param: T | null | undefined): asserts param is T {
        if (param === null) {
            throw new AssertionError("Parameter is null.");
        }
        if (param === undefined) {
            throw new AssertionError("Parameter is undefined.");
        }
    }
}

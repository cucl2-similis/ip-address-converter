import os from "os";

/**
 * アサーションエラー
 */
export class AssertionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AssertionError";
    }
}

/**
 * 無効呼出エラー
 */
export class InvalidCallError extends Error {
    /**
     * 無効呼出エラー
     * @param message エラーメッセージ（複数指定の場合: 改行された複数行文字列）
     */
    constructor(...message: string[]) {
        super(message.join(os.EOL));
        this.name = "InvalidCallError";
    }
}

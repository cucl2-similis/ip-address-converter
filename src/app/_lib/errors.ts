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
    constructor(message: string) {
        super(message);
        this.name = "InvalidCallError";
    }
}


/** 文字 */
export class Char {

    /** ピリオド（ `.` ） */
    public static readonly PERIOD = ".";

    /** 半角スペース（ `" "` ） */
    public static readonly SPACE = " ";

    /** 空文字（ `""` ） */
    public static readonly EMPTY = "";
}

/** 正規表現 */
export class Regex {

    /** ピリオド（ `.` ） */
    public static readonly PERIOD: RegExp = /\./;

    /** スラッシュ（ `/` ） */
    public static readonly SLASH: RegExp = /\//;

    /** ピリオドまたはスラッシュ（ `.` or `/` ） */
    public static readonly PERIOD_OR_SLASH: RegExp = /\.|\//;

    /**
     * 文字列内の全ての8文字のかたまりに一致
     * - `/.{8}/g`（{@link https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions 正規表現}）
     *   - `.`　：改行以外のあらゆる1文字に一致 （{@link https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions/Character_classes 文字クラス}）
     *   - `{n}`：ちょうどn回の出現に一致（{@link https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions/Quantifiers 数量詞}）
     *   - `g`　：全ての一致に対するグローバル検索
     *           （{@link https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions#%E3%83%95%E3%83%A9%E3%82%B0%E3%82%92%E7%94%A8%E3%81%84%E3%81%9F%E9%AB%98%E5%BA%A6%E3%81%AA%E6%A4%9C%E7%B4%A2 フラグ},
     *             {@link https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global global}）
     */
    public static readonly CHUNK_OF_8_CHAR: RegExp = /.{8}/g;

    /**
     * CIDRブロック付IPアドレス形式
     * - 形式「数値1～3桁`.`数値1～3桁`.`数値1～3桁`.`数値1～3桁`/`数値1～2桁」に一致（{@link https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions 正規表現}）
     *   - `^`, `$`：入力の先頭と入力の末尾に一致（{@link https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions/Assertions アサーション}）
     *   - `{n,m}`：n回以上m回以下の出現に一致（{@link https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions/Quantifiers 数量詞}）
     *   - `[0-9]`：あらゆるアラビア数字に一致（{@link https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions/Character_classes 文字クラス}）
     */
    public static readonly FORMAT_OF_IP_WITH_CIDR: RegExp = new RegExp("^"           // 入力の先頭に一致
                                                               .concat("[0-9]{1,3}") // 数値1～3桁
                                                               .concat(".")          //「.」
                                                               .concat("[0-9]{1,3}") // 数値1～3桁
                                                               .concat(".")          //「.」
                                                               .concat("[0-9]{1,3}") // 数値1～3桁
                                                               .concat(".")          //「.」
                                                               .concat("[0-9]{1,3}") // 数値1～3桁
                                                               .concat("/")          //「/」
                                                               .concat("[0-9]{1,2}") // 数値1～2桁
                                                               .concat("$"));        // 入力の末尾に一致
}

/** IPアドレス関連定数 */
export class IpAddress {

    /** ビット文字列: `"0"` */
    public static readonly BIT_STR_ZERO = "0";

    /** ビット文字列: `"1"` */
    public static readonly BIT_STR_ONE = "1";

    /** 基数: 2 */
    public static readonly RADIX_BINARY = 2;

    /** オクテット1ブロックの桁数: 8 */
    public static readonly OCTET_DIGITS = 8;

    /** IPアドレスの桁数: 32 */
    public static readonly IPv4_DIGITS = 32;

    /** 第四オクテットの要素番号: 3 */
    public static readonly FOURTH_OCTET_INDEX = 3;
}

/** ラジオボタン選択肢 */
export const Radio = {
    /** 項目「10進数」 */
    DEC: "Decimal",
    /** 項目「2進数」 */
    BIN: "Binary"
} as const;
export type Radio = typeof Radio[keyof typeof Radio];

/** アドレスクラス */
export const AddressClass = {
    /** クラスA */
    A: {index: 1, name: "A"},
    /** クラスB */
    B: {index: 2, name: "B"},
    /** クラスC */
    C: {index: 3, name: "C"},
    /** 未定義 */
    UNDEFINED: {index: 0, name: "-"}
} as const;
export type AddressClass = typeof AddressClass[keyof typeof AddressClass];

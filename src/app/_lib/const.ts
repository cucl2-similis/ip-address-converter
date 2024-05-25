
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

    /**
     * 数値のみ
     * - `/^[0-9]+$/`（{@link https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions 正規表現}）
     *   - `^`, `$`：入力の先頭と入力の末尾に一致（{@link https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions/Assertions アサーション}）
     *   - `"x"+`：直前のアイテム`"x"`の 1 回以上の繰り返しに一致（{@link https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions/Quantifiers 数量詞}）
     *   - `[0-9]`：あらゆるアラビア数字に一致（{@link https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions/Character_classes 文字クラス}）
     */
    public static readonly NUMBERS_ONLY: RegExp = /^[0-9]+$/;

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
     * IPv4アドレス形式
     * - 形式「数値1～3桁`.`数値1～3桁`.`数値1～3桁`.`数値1～3桁」に一致（{@link https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions 正規表現}）
     *   - `^`, `$`：入力の先頭と入力の末尾に一致（{@link https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions/Assertions アサーション}）
     *   - `{n,m}`：n回以上m回以下の出現に一致（{@link https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions/Quantifiers 数量詞}）
     *   - `[0-9]`：あらゆるアラビア数字に一致（{@link https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions/Character_classes 文字クラス}）
     */
    public static readonly FORMAT_OF_IPV4_ADDRESS: RegExp = new RegExp("^"           // 入力の先頭に一致
                                                               .concat("[0-9]{1,3}") // 数値1～3桁
                                                               .concat("\\.")        //「.」
                                                               .concat("[0-9]{1,3}") // 数値1～3桁
                                                               .concat("\\.")        //「.」
                                                               .concat("[0-9]{1,3}") // 数値1～3桁
                                                               .concat("\\.")        //「.」
                                                               .concat("[0-9]{1,3}") // 数値1～3桁
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

/** アドレス範囲 */
export const AddressRange = {
    /** クラスA（パブリック前半） */
    A_PUBLIC_FORMER: {decFirst: "1.0.0.0",     decLast: "9.255.255.255",   binFirst: "00000001.00000000.00000000.00000000", binLast: "00001001.11111111.11111111.11111111"},
    /** クラスA（プライベート） */
    A_PRIVATE_RANGE: {decFirst: "10.0.0.0",    decLast: "10.255.255.255",  binFirst: "00001010.00000000.00000000.00000000", binLast: "00001010.11111111.11111111.11111111"},
    /** クラスA（パブリック後半） */
    A_PUBLIC_LATTER: {decFirst: "11.0.0.0",    decLast: "126.255.255.255", binFirst: "00001011.00000000.00000000.00000000", binLast: "01111110.11111111.11111111.11111111"},
    /** ローカルホスト */
    LOCALHOST_RANGE: {decFirst: "127.0.0.0",   decLast: "127.255.255.255", binFirst: "01111111.00000000.00000000.00000000", binLast: "01111111.11111111.11111111.11111111"},
    /** クラスB（パブリック前半） */
    B_PUBLIC_FORMER: {decFirst: "128.0.0.0",   decLast: "172.15.255.255",  binFirst: "10000000.00000000.00000000.00000000", binLast: "10101100.00001111.11111111.11111111"},
    /** クラスB（プライベート） */
    B_PRIVATE_RANGE: {decFirst: "172.16.0.0",  decLast: "172.31.255.255",  binFirst: "10101100.00010000.00000000.00000000", binLast: "10101100.00011111.11111111.11111111"},
    /** クラスB（パブリック後半） */
    B_PUBLIC_LATTER: {decFirst: "172.32.0.0",  decLast: "191.255.255.255", binFirst: "10101100.00100000.00000000.00000000", binLast: "10111111.11111111.11111111.11111111"},
    /** クラスC（パブリック前半） */
    C_PUBLIC_FORMER: {decFirst: "192.0.0.0",   decLast: "192.167.255.255", binFirst: "11000000.00000000.00000000.00000000", binLast: "11000000.10100111.11111111.11111111"},
    /** クラスC（プライベート） */
    C_PRIVATE_RANGE: {decFirst: "192.168.0.0", decLast: "192.168.255.255", binFirst: "11000000.10101000.00000000.00000000", binLast: "11000000.10101000.11111111.11111111"},
    /** クラスC（パブリック後半） */
    C_PUBLIC_LATTER: {decFirst: "192.169.0.0", decLast: "223.255.255.255", binFirst: "11000000.10101001.00000000.00000000", binLast: "11011111.11111111.11111111.11111111"},
    /** 未定義 */
    UNDEFINED: {decFirst: Char.EMPTY, decLast: Char.EMPTY, binFirst: Char.EMPTY, binLast: Char.EMPTY}
} as const;
export type AddressRange = typeof AddressRange[keyof typeof AddressRange];

/** アドレスクラス */
export const AddressClass = {
    /** Class A */                     // オクテット1ブロックの桁数 × 1
    A: {name: "A", index: 1, subnetIndex: IpAddress.OCTET_DIGITS * 1},
    /** Class B */                     // オクテット1ブロックの桁数 × 2 +「.」1つ分
    B: {name: "B", index: 2, subnetIndex: IpAddress.OCTET_DIGITS * 2 + 1},
    /** Class C */                     // オクテット1ブロックの桁数 × 3 +「.」2つ分
    C: {name: "C", index: 3, subnetIndex: IpAddress.OCTET_DIGITS * 3 + 2},
    /** ローカルホスト */
    LOCALHOST: {name: "localhost", index: 0, subnetIndex: 0},
    /** 未定義 */
    UNDEFINED: {name: "-", index: 0, subnetIndex: 0}
} as const;
export type AddressClass = typeof AddressClass[keyof typeof AddressClass];

/** アドレスブロック */
export const AddressBlock = {
    /** クラスA（パブリック前半） */
    A_PUBLIC_FORMER: {scope: "Public",  addressRange: AddressRange.A_PUBLIC_FORMER, addressClass: AddressClass.A},
    /** クラスA（プライベート） */
    A_PRIVATE_BLOCK: {scope: "Private", addressRange: AddressRange.A_PRIVATE_RANGE, addressClass: AddressClass.A},
    /** クラスA（パブリック後半） */
    A_PUBLIC_LATTER: {scope: "Public",  addressRange: AddressRange.A_PUBLIC_LATTER, addressClass: AddressClass.A},
    /** ローカルホスト */
    LOCALHOST_BLOCK: {scope: undefined, addressRange: AddressRange.LOCALHOST_RANGE, addressClass: AddressClass.LOCALHOST},
    /** クラスB（パブリック前半） */
    B_PUBLIC_FORMER: {scope: "Public",  addressRange: AddressRange.B_PUBLIC_FORMER, addressClass: AddressClass.B},
    /** クラスB（プライベート） */
    B_PRIVATE_BLOCK: {scope: "Private", addressRange: AddressRange.B_PRIVATE_RANGE, addressClass: AddressClass.B},
    /** クラスB（パブリック後半） */
    B_PUBLIC_LATTER: {scope: "Public",  addressRange: AddressRange.B_PUBLIC_LATTER, addressClass: AddressClass.B},
    /** クラスC（パブリック前半） */
    C_PUBLIC_FORMER: {scope: "Public",  addressRange: AddressRange.C_PUBLIC_FORMER, addressClass: AddressClass.C},
    /** クラスC（プライベート） */
    C_PRIVATE_BLOCK: {scope: "Private", addressRange: AddressRange.C_PRIVATE_RANGE, addressClass: AddressClass.C},
    /** クラスC（パブリック後半） */
    C_PUBLIC_LATTER: {scope: "Public",  addressRange: AddressRange.C_PUBLIC_LATTER, addressClass: AddressClass.C},
    /** 未定義 */
    UNDEFINED: {scope: undefined, addressRange: AddressRange.UNDEFINED, addressClass: AddressClass.UNDEFINED}
} as const;
export type AddressBlock = typeof AddressBlock[keyof typeof AddressBlock];

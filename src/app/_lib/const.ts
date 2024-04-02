
/** 記号 */
export class Symbol {

    /** ピリオド（ `.` ） */
    public static readonly PERIOD = ".";

    /** 半角スペース（ `" "` ） */
    public static readonly SPACE = " ";

    /** 空文字（ `""` ） */
    public static readonly EMPTY = "";
}

/** 正規表現 */
export class Regex {

    /** ピリオドまたはスラッシュ（ `.` or `/` ） */
    public static readonly PERIOD_OR_SLASH: RegExp = /\.|\//;
}

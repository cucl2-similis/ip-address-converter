import { KeyboardEvent } from "react";
import { Assertions } from "./assertions";
import { AddressBlock, AddressClass, Char, IpAddress, Regex } from "./const";
import { AssertionError } from "./errors";

/** 変換ユーティリティ */
export class ConversionUtils {

    private constructor() { }

    /**
     * 10進数`number` を 2進数`string` へ変換
     * @param decimal 10進数`number`
     * @returns 2進数`string`
     */
    public static convertDecimalToBinary(decimal: number): string {
        const binary = decimal.toString(IpAddress.RADIX_BINARY);                // 基数2で文字列変換
        return binary.padStart(IpAddress.OCTET_DIGITS, IpAddress.BIT_STR_ZERO); // 8桁0埋め
    }

    /**
     * 2進数`string` を 10進数`number` へ変換
     * @param binary 2進数`string`
     * @returns 10進数`number`
     */
    public static convertBinaryToDecimal(binary: string): number {
        return parseInt(binary, IpAddress.RADIX_BINARY); // 基数2で数値変換
    }
}

/** 配列ユーティリティ */
export class ArrayUtils {

    private constructor() { }

    /**
     * 配列の要素一つを任意の変換関数で差し替え
     * 
     * 対象配列`array`のうち、要素番号`index`で指定された要素に、変換関数`mapper`を適用し、  
     * 対象要素のみが差し替えられた新規配列を返却する。
     * @param array 対象配列
     * @param index 要素番号
     * @param mapper 変換関数
     * @returns 対象要素に指定の変換関数を適用した新規配列
     */
    public static mapAnElementOfArray<T>(array: T[], index: number, mapper: (element: T) => T): T[] {

        // 要素番号が一致した場合のみ変換関数を配列要素に適用した新規配列を返却
        return Array.from(array, (v, k) => k === index ? mapper(v) : v);
    }
}

/** IPアドレス関連ユーティリティ */
export class IpAddressUtils {

    private constructor() { }

    /**
     * 10進数IPアドレス（数値配列または文字列）から 対応するアドレスクラス を決定
     * @param decIpAddress 10進数IPアドレス（数値配列または文字列）
     * @returns アドレスクラス
     */
    public static determineAddressClassBy(decIpAddress: number[] | string): AddressClass {

        // 10進数IPアドレス文字列がIPv4アドレス形式でない場合はアドレスクラス未定義を返却
        if (typeof decIpAddress === "string"
                && decIpAddress.search(Regex.FORMAT_OF_IPV4_ADDRESS) === -1) {
            return AddressClass.UNDEFINED;
        }

        // 引数10進数IPアドレスが文字列の場合は配列に変換
        const decIpAddressArray = typeof decIpAddress === "string"
                                  ? decIpAddress.split(Regex.PERIOD).map(Number)
                                  : decIpAddress;

        // 指定されたIPアドレスに対応するアドレスクラスを返却
        const binIpAddressArray = decIpAddressArray.map(ConversionUtils.convertDecimalToBinary);
        return IpAddressUtils.determineAddressBlockBy(binIpAddressArray).addressClass;
    }

    /**
     * 2進数IPアドレス配列 から 対応するアドレスブロック を決定
     * @param binIpAddressArray 2進数IPアドレス配列
     * @returns アドレスブロック
     */
    public static determineAddressBlockBy(binIpAddressArray: string[]): AddressBlock {

        return this.selectAddressBlockBy(binIpAddressArray, AddressBlock.A_PUBLIC_FORMER,
                                                            AddressBlock.A_PRIVATE_BLOCK,
                                                            AddressBlock.A_PUBLIC_LATTER,
                                                            AddressBlock.LOCALHOST_BLOCK,
                                                            AddressBlock.B_PUBLIC_FORMER,
                                                            AddressBlock.B_PRIVATE_BLOCK,
                                                            AddressBlock.B_PUBLIC_LATTER,
                                                            AddressBlock.C_PUBLIC_FORMER,
                                                            AddressBlock.C_PRIVATE_BLOCK,
                                                            AddressBlock.C_PUBLIC_LATTER);
    }

    /**
     * CIDR から 2進数サブネットマスク配列 を作成
     * @param cidr CIDR
     * @returns 2進数サブネットマスク配列
     */
    public static createBinSubnetMaskArray(cidr: number): string[] {

        const quotient = Math.floor(cidr / IpAddress.OCTET_DIGITS);                // 商（小数点以下切り捨て）
        const remainder = cidr % IpAddress.OCTET_DIGITS;                           // 余り
        const networkSectionDigit = IpAddress.OCTET_DIGITS * quotient + remainder; // ネットワーク部の桁数
        const hostSectionDigit = IpAddress.IPv4_DIGITS - networkSectionDigit;      // ホスト部の桁数
        const subnetMask = (IpAddress.BIT_STR_ONE.repeat(networkSectionDigit))     // ネットワーク部は「1」
                         + (IpAddress.BIT_STR_ZERO.repeat(hostSectionDigit));      // ホスト部は「0」
        return this.convertBinIpAddressToOctetArray(subnetMask);                   // オクテットごとの配列に変換して返却
    }

    /**
     * 2進数IPアドレス配列とCIDR から 2進数ネットワークアドレス配列と2進数ブロードキャストアドレス配列 を作成
     * @param binIpAddressArray 2進数IPアドレス配列
     * @param cidr CIDR
     * @returns binAddressArrays 2進数アドレス配列
     * @returns binAddressArrays.binNetworkAddressArray 2進数ネットワークアドレス配列
     * @returns binAddressArrays.binBroadcastAddressArray 2進数ブロードキャストアドレス配列
     */
    public static createBinArraysOfNetworkAndBroadcast(binIpAddressArray: string[],
                                                       cidr: number): Readonly<{ binNetworkAddressArray: string[];
                                                                                 binBroadcastAddressArray: string[]; }> {
                                                                                             // 例）192.168.10.1/20 の場合
        const ipAddress = binIpAddressArray.join(Char.EMPTY);                                // 11000000101010000000101000000001 (IPアドレス)
        const networkSection = ipAddress.substring(0, cidr);                                 // 11000000101010000000             (ネットワーク部)
        const hostSectionZero = IpAddress.BIT_STR_ZERO.repeat(IpAddress.IPv4_DIGITS - cidr); //                     000000000000 (ホスト部 - 0)
        const hostSectionOne = IpAddress.BIT_STR_ONE.repeat(IpAddress.IPv4_DIGITS - cidr);   //                     111111111111 (ホスト部 - 1)
        const networkAddress = networkSection + hostSectionZero;                             // 11000000101010000000000000000000 (ネットワークアドレス)
        const broadcastAddress = networkSection + hostSectionOne;                            // 11000000101010000000111111111111 (ブロードキャストアドレス)

        const binNetworkAddressArray = this.convertBinIpAddressToOctetArray(networkAddress);     // オクテットごとの配列に変換
        const binBroadcastAddressArray = this.convertBinIpAddressToOctetArray(broadcastAddress); // オクテットごとの配列に変換

        return {binNetworkAddressArray, binBroadcastAddressArray};
    }

    /**
     * 2進数IPアドレス配列 から 一致するアドレスブロック を選択  
     * 指定されたアドレスブロックのいずれにも一致しない場合は`AddressBlock.UNDEFINED`を返却する。
     * @param binIpAddressArray 2進数IPアドレス配列
     * @param addressBlocks アドレスブロック
     * @returns 指定されたIPアドレス（2進数IPアドレス配列）が属するアドレスブロック
     */
    private static selectAddressBlockBy(binIpAddressArray: string[], ...addressBlocks: AddressBlock[]): AddressBlock {

        const binaryWithoutDots = binIpAddressArray.join(Char.EMPTY);
        const decimal = ConversionUtils.convertBinaryToDecimal(binaryWithoutDots);

        for (const addressBlock of addressBlocks) {

            const binFirstWithoutDots = addressBlock.addressRange.binFirst.replaceAll(Char.PERIOD, Char.EMPTY);
            const binLastWithoutDots = addressBlock.addressRange.binLast.replaceAll(Char.PERIOD, Char.EMPTY);

            if (ConversionUtils.convertBinaryToDecimal(binFirstWithoutDots) <= decimal
                                                                            && decimal <= ConversionUtils.convertBinaryToDecimal(binLastWithoutDots)) {
                return addressBlock;
            }
        }

        return AddressBlock.UNDEFINED;
    }

    /**
     * 2進数IPアドレス を オクテットごとの配列 へ変換
     * - 2進数IPアドレスに`.`が含まれている場合
     *   - `.`で区切った配列を返却する。
     *   - 例）`11000000.10101000.00001010.00000001` → `["11000000", "10101000", "00001010", "00000001"]`
     * - 2進数IPアドレスに`.`が含まれていない場合
     *   - 8桁ごとに区切った配列を返却する。
     *   - 例）`11000000101010000000101000000001` → `["11000000", "10101000", "00001010", "00000001"]`
     * @param binIpAddress 2進数IPアドレス
     * @returns オクテットごとの配列
     * @throws -{@linkcode AssertionError}：2進数IPアドレスを8桁ごとに区切った結果が`null`の場合
     */
    private static convertBinIpAddressToOctetArray(binIpAddress: string): string[] {

        //「.」が含まれている場合：文字列を「.」で区切った配列を返却
        if (binIpAddress.includes(Char.PERIOD)) {
            return binIpAddress.split(Regex.PERIOD);
        }

        //「.」が含まれていない場合：文字列を8桁ごとに区切った配列を返却
        const octetArray = binIpAddress.match(Regex.CHUNK_OF_8_CHAR);
        Assertions.assertNotNull(octetArray);
        return octetArray;
    }
}

/** イベントハンドラユーティリティ */
export class EventHandlerUtils {

    private constructor() { }

    /**
     * Enterキー押下によるボタンクリックイベントの発火
     * 
     * 指定されたキーボードイベントからEnterキー押下を検知し、  
     * 指定されたボタン要素のクリックイベントを発火する。
     * @param keyboardEvent インプット要素のキーボードイベント
     * @param buttonElement ボタン要素
     * @throws -{@linkcode AssertionError}：`buttonElement`が`null`の場合
     */
    public static handleClickButtonByPressingEnter(keyboardEvent: KeyboardEvent<HTMLInputElement>,
                                                   buttonElement: HTMLButtonElement | null): void {
        if (keyboardEvent.key === "Enter") {
            Assertions.assertNotNull(buttonElement);
            buttonElement.click();
        }
    }
}

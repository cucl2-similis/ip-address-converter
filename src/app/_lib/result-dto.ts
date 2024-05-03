import { AddressBlock, AddressClass, Char } from "./const";

/**
 * 変換結果DTO
 */
export class ResultDto {

    /** 10進数IPアドレス配列 */
    private readonly decIpAddressArray: number[];
    /** 10進数サブネットマスク配列 */
    private readonly decSubnetMaskArray: number[];
    /** 10進数ネットワークアドレス配列 */
    private readonly decNetworkAddressArray: number[];
    /** 10進数ブロードキャストアドレス配列 */
    private readonly decBroadcastAddressArray: number[];
    /** 10進数利用可能範囲開始IPアドレス配列 */
    private readonly decFirstAvailableIpAddressArray: number[];
    /** 10進数利用可能範囲終了IPアドレス配列 */
    private readonly decLastAvailableIpAddressArray: number[];

    /** 2進数IPアドレス配列 */
    private readonly binIpAddressArray: string[];
    /** 2進数サブネットマスク配列 */
    private readonly binSubnetMaskArray: string[];
    /** 2進数ネットワークアドレス配列 */
    private readonly binNetworkAddressArray: string[];
    /** 2進数ブロードキャストアドレス配列 */
    private readonly binBroadcastAddressArray: string[];
    /** 2進数利用可能範囲開始IPアドレス配列 */
    private readonly binFirstAvailableIpAddressArray: string[];
    /** 2進数利用可能範囲終了IPアドレス配列 */
    private readonly binLastAvailableIpAddressArray: string[];

    /** CIDR */
    private readonly cidr: number;
    /** アドレスブロック */
    private readonly addressBlock: AddressBlock;
    /** 利用可能IPアドレス数 */
    private readonly numberOfAvailableIps: number;

    /**
     * 変換結果DTO
     * @param decIpAddressArray 10進数IPアドレス配列
     * @param decSubnetMaskArray 10進数サブネットマスク配列
     * @param decNetworkAddressArray 10進数ネットワークアドレス配列
     * @param decBroadcastAddressArray 10進数ブロードキャストアドレス配列
     * @param decFirstAvailableIpAddressArray 10進数利用可能範囲開始IPアドレス配列
     * @param decLastAvailableIpAddressArray 10進数利用可能範囲終了IPアドレス配列
     * @param binIpAddressArray 2進数IPアドレス配列
     * @param binSubnetMaskArray 2進数サブネットマスク配列
     * @param binNetworkAddressArray 2進数ネットワークアドレス配列
     * @param binBroadcastAddressArray 2進数ブロードキャストアドレス配列
     * @param binFirstAvailableIpAddressArray 2進数利用可能範囲開始IPアドレス配列
     * @param binLastAvailableIpAddressArray 2進数利用可能範囲終了IPアドレス配列
     * @param cidr CIDR
     * @param addressBlock アドレスブロック
     * @param numberOfAvailableIps 利用可能IPアドレス数
     */
    public constructor(decIpAddressArray: number[],
                       decSubnetMaskArray: number[],
                       decNetworkAddressArray: number[],
                       decBroadcastAddressArray: number[],
                       decFirstAvailableIpAddressArray: number[],
                       decLastAvailableIpAddressArray: number[],
                       binIpAddressArray: string[],
                       binSubnetMaskArray: string[],
                       binNetworkAddressArray: string[],
                       binBroadcastAddressArray: string[],
                       binFirstAvailableIpAddressArray: string[],
                       binLastAvailableIpAddressArray: string[],
                       cidr: number,
                       addressBlock: AddressBlock,
                       numberOfAvailableIps: number) {
        this.decIpAddressArray = decIpAddressArray;
        this.decSubnetMaskArray = decSubnetMaskArray;
        this.decNetworkAddressArray = decNetworkAddressArray;
        this.decBroadcastAddressArray = decBroadcastAddressArray;
        this.decFirstAvailableIpAddressArray = decFirstAvailableIpAddressArray;
        this.decLastAvailableIpAddressArray = decLastAvailableIpAddressArray;
        this.binIpAddressArray = binIpAddressArray;
        this.binSubnetMaskArray = binSubnetMaskArray;
        this.binNetworkAddressArray = binNetworkAddressArray;
        this.binBroadcastAddressArray = binBroadcastAddressArray;
        this.binFirstAvailableIpAddressArray = binFirstAvailableIpAddressArray;
        this.binLastAvailableIpAddressArray = binLastAvailableIpAddressArray;
        this.cidr = cidr;
        this.addressBlock = addressBlock;
        this.numberOfAvailableIps = numberOfAvailableIps;
    }

    /**
     * 10進数IPアドレス取得
     * @returns 10進数IPアドレス
     */
    public getDecIpAddress(): string {
        return this.decIpAddressArray.join(Char.PERIOD);
    }

    /**
     * 10進数サブネットマスク取得
     * @returns 10進数サブネットマスク
     */
    public getDecSubnetMask(): string {
        return this.decSubnetMaskArray.join(Char.PERIOD);
    }

    /**
     * 10進数ネットワークアドレス取得
     * @returns 10進数ネットワークアドレス
     */
    public getDecNetworkAddress(): string {
        return this.decNetworkAddressArray.join(Char.PERIOD);
    }

    /**
     * 10進数ブロードキャストアドレス取得
     * @returns 10進数ブロードキャストアドレス
     */
    public getDecBroadcastAddress(): string {
        return this.decBroadcastAddressArray.join(Char.PERIOD);
    }

    /**
     * 10進数利用可能範囲開始IPアドレス取得
     * @returns 10進数利用可能範囲開始IPアドレス
     */
    public getDecFirstAvailableIpAddress(): string {
        return this.decFirstAvailableIpAddressArray.join(Char.PERIOD);
    }

    /**
     * 10進数利用可能範囲終了IPアドレス取得
     * @returns 10進数利用可能範囲終了IPアドレス
     */
    public getDecLastAvailableIpAddress(): string {
        return this.decLastAvailableIpAddressArray.join(Char.PERIOD);
    }

    /**
     * 2進数IPアドレス取得
     * @returns 2進数IPアドレス
     */
    public getBinIpAddress(): string {
        return this.binIpAddressArray.join(Char.PERIOD);
    }

    /**
     * 2進数サブネットマスク取得
     * @returns 2進数サブネットマスク
     */
    public getBinSubnetMask(): string {
        return this.binSubnetMaskArray.join(Char.PERIOD);
    }

    /**
     * 2進数ネットワークアドレス取得
     * @returns 2進数ネットワークアドレス
     */
    public getBinNetworkAddress(): string {
        return this.binNetworkAddressArray.join(Char.PERIOD);
    }

    /**
     * 2進数ブロードキャストアドレス取得
     * @returns 2進数ブロードキャストアドレス
     */
    public getBinBroadcastAddress(): string {
        return this.binBroadcastAddressArray.join(Char.PERIOD);
    }

    /**
     * 2進数利用可能範囲開始IPアドレス取得
     * @returns 2進数利用可能範囲開始IPアドレス
     */
    public getBinFirstAvailableIpAddress(): string {
        return this.binFirstAvailableIpAddressArray.join(Char.PERIOD);
    }

    /**
     * 2進数利用可能範囲終了IPアドレス取得
     * @returns 2進数利用可能範囲終了IPアドレス
     */
    public getBinLastAvailableIpAddress(): string {
        return this.binLastAvailableIpAddressArray.join(Char.PERIOD);
    }

    /**
     * CIDR取得
     * @returns CIDR
     */
    public getCidr(): number {
        return this.cidr;
    }

    /**
     * アドレスブロック取得
     * @returns アドレスブロック
     */
    public getAddressBlock(): AddressBlock {
        return this.addressBlock;
    }

    /**
     * アドレスクラス取得
     * @returns アドレスクラス
     */
    public getAddressClass(): AddressClass {
        return this.getAddressBlock().addressClass;
    }

    /**
     * 利用可能IPアドレス数取得  
     * 数値を表す言語依存の文字列（例: `,`区切り）を取得する。
     * @returns 利用可能IPアドレス数
     */
    public getNumberOfAvailableIps(): string {
        return this.numberOfAvailableIps.toLocaleString();
    }
}

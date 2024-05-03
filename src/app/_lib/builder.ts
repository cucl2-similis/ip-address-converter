import { AddressBlock } from "./const";
import { ResultDto } from "./result-dto";

/**
 * ビルダー
 */
export class Builder {

    /**
     * 変換結果DTOビルダー生成
     * @returns 変換結果DTOビルダー
     */
    public static ofResultDto(): ResultDtoBuilder {
        return new ResultDtoBuilder();
    }
}

/**
 * 変換結果DTOビルダー
 */
class ResultDtoBuilder {

    private _decIpAddressArray: number[] = [];
    private _decSubnetMaskArray: number[] = [];
    private _decNetworkAddressArray: number[] = [];
    private _decBroadcastAddressArray: number[] = [];
    private _decFirstAvailableIpAddressArray: number[] = [];
    private _decLastAvailableIpAddressArray: number[] = [];

    private _binIpAddressArray: string[] = [];
    private _binSubnetMaskArray: string[] = [];
    private _binNetworkAddressArray: string[] = [];
    private _binBroadcastAddressArray: string[] = [];
    private _binFirstAvailableIpAddressArray: string[] = [];
    private _binLastAvailableIpAddressArray: string[] = [];

    private _cidr: number = 0;
    private _addressBlock: AddressBlock = AddressBlock.UNDEFINED;
    private _numberOfAvailableIps: number = 0;

    /**
     * 10進数IPアドレス配列 設定（未設定の場合は空配列）
     * @param decIpAddressArray 10進数IPアドレス配列
     * @returns 変換結果DTOビルダー
     */
    public decIpAddressArray(decIpAddressArray: number[]): ResultDtoBuilder {
        this._decIpAddressArray = decIpAddressArray;
        return this;
    }
    /**
     * 10進数サブネットマスク配列 設定（未設定の場合は空配列）
     * @param decSubnetMaskArray 10進数サブネットマスク配列
     * @returns 変換結果DTOビルダー
     */
    public decSubnetMaskArray(decSubnetMaskArray: number[]): ResultDtoBuilder {
        this._decSubnetMaskArray = decSubnetMaskArray;
        return this;
    }
    /**
     * 10進数ネットワークアドレス配列 設定（未設定の場合は空配列）
     * @param decNetworkAddressArray 10進数ネットワークアドレス配列
     * @returns 変換結果DTOビルダー
     */
    public decNetworkAddressArray(decNetworkAddressArray: number[]): ResultDtoBuilder {
        this._decNetworkAddressArray = decNetworkAddressArray;
        return this;
    }
    /**
     * 10進数ブロードキャストアドレス配列 設定（未設定の場合は空配列）
     * @param decBroadcastAddressArray 10進数ブロードキャストアドレス配列
     * @returns 変換結果DTOビルダー
     */
    public decBroadcastAddressArray(decBroadcastAddressArray: number[]): ResultDtoBuilder {
        this._decBroadcastAddressArray = decBroadcastAddressArray;
        return this;
    }
    /**
     * 10進数利用可能範囲開始IPアドレス配列 設定（未設定の場合は空配列）
     * @param decFirstAvailableIpAddressArray 10進数利用可能範囲開始IPアドレス配列
     * @returns 変換結果DTOビルダー
     */
    public decFirstAvailableIpAddressArray(decFirstAvailableIpAddressArray: number[]): ResultDtoBuilder {
        this._decFirstAvailableIpAddressArray = decFirstAvailableIpAddressArray;
        return this;
    }
    /**
     * 10進数利用可能範囲終了IPアドレス配列 設定（未設定の場合は空配列）
     * @param decLastAvailableIpAddressArray 10進数利用可能範囲終了IPアドレス配列
     * @returns 変換結果DTOビルダー
     */
    public decLastAvailableIpAddressArray(decLastAvailableIpAddressArray: number[]): ResultDtoBuilder {
        this._decLastAvailableIpAddressArray = decLastAvailableIpAddressArray;
        return this;
    }
    /**
     * 2進数IPアドレス配列 設定（未設定の場合は空配列）
     * @param binIpAddressArray 2進数IPアドレス配列
     * @returns 変換結果DTOビルダー
     */
    public binIpAddressArray(binIpAddressArray: string[]): ResultDtoBuilder {
        this._binIpAddressArray = binIpAddressArray;
        return this;
    }
    /**
     * 2進数サブネットマスク配列 設定（未設定の場合は空配列）
     * @param binSubnetMaskArray 2進数サブネットマスク配列
     * @returns 変換結果DTOビルダー
     */
    public binSubnetMaskArray(binSubnetMaskArray: string[]): ResultDtoBuilder {
        this._binSubnetMaskArray = binSubnetMaskArray;
        return this;
    }
    /**
     * 2進数ネットワークアドレス配列 設定（未設定の場合は空配列）
     * @param binNetworkAddressArray 2進数ネットワークアドレス配列
     * @returns 変換結果DTOビルダー
     */
    public binNetworkAddressArray(binNetworkAddressArray: string[]): ResultDtoBuilder {
        this._binNetworkAddressArray = binNetworkAddressArray;
        return this;
    }
    /**
     * 2進数ブロードキャストアドレス配列 設定（未設定の場合は空配列）
     * @param binBroadcastAddressArray 2進数ブロードキャストアドレス配列
     * @returns 変換結果DTOビルダー
     */
    public binBroadcastAddressArray(binBroadcastAddressArray: string[]): ResultDtoBuilder {
        this._binBroadcastAddressArray = binBroadcastAddressArray;
        return this;
    }
    /**
     * 2進数利用可能範囲開始IPアドレス配列 設定（未設定の場合は空配列）
     * @param binFirstAvailableIpAddressArray 2進数利用可能範囲開始IPアドレス配列
     * @returns 変換結果DTOビルダー
     */
    public binFirstAvailableIpAddressArray(binFirstAvailableIpAddressArray: string[]): ResultDtoBuilder {
        this._binFirstAvailableIpAddressArray = binFirstAvailableIpAddressArray;
        return this;
    }
    /**
     * 2進数利用可能範囲終了IPアドレス配列 設定（未設定の場合は空配列）
     * @param binLastAvailableIpAddressArray 2進数利用可能範囲終了IPアドレス配列
     * @returns 変換結果DTOビルダー
     */
    public binLastAvailableIpAddressArray(binLastAvailableIpAddressArray: string[]): ResultDtoBuilder {
        this._binLastAvailableIpAddressArray = binLastAvailableIpAddressArray;
        return this;
    }
    /**
     * CIDR 設定（未設定の場合は0）
     * @param cidr CIDR
     * @returns 変換結果DTOビルダー
     */
    public cidr(cidr: number): ResultDtoBuilder {
        this._cidr = cidr;
        return this;
    }

    /**
     * アドレスブロック 設定（未設定の場合は`AddressBlock.UNDEFINED`）
     * @param addressBlock アドレスブロック
     * @returns 変換結果DTOビルダー
     */
    public addressBlock(addressBlock: AddressBlock): ResultDtoBuilder {
        this._addressBlock = addressBlock;
        return this;
    }

    /**
     * 利用可能IPアドレス数 設定（未設定の場合は0）
     * @param numberOfAvailableIps 利用可能IPアドレス数
     * @returns 変換結果DTOビルダー
     */
    public numberOfAvailableIps(numberOfAvailableIps: number): ResultDtoBuilder {
        this._numberOfAvailableIps = numberOfAvailableIps;
        return this;
    }


    /**
     * 変換結果DTO生成
     * @returns 変換結果DTO
     */
    public build(): ResultDto {
        return new ResultDto(this._decIpAddressArray,
                             this._decSubnetMaskArray,
                             this._decNetworkAddressArray,
                             this._decBroadcastAddressArray,
                             this._decFirstAvailableIpAddressArray,
                             this._decLastAvailableIpAddressArray,
                             this._binIpAddressArray,
                             this._binSubnetMaskArray,
                             this._binNetworkAddressArray,
                             this._binBroadcastAddressArray,
                             this._binFirstAvailableIpAddressArray,
                             this._binLastAvailableIpAddressArray,
                             this._cidr,
                             this._addressBlock,
                             this._numberOfAvailableIps);
    }
}

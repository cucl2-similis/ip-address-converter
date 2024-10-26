import { Builder } from "./builder";
import { IpAddress, Regex } from "./const";
import { ResultDto } from "./result-dto";
import { ArrayUtils, ConversionUtils, IpAddressUtils } from "./utils";

/**
 * コンバータ（変換ロジック）
 */
export class Converter {

    /**
     * IPアドレス変換
     * 
     * IPv4アドレス文字列とCIDRブロック文字列に変換処理を適用し、  
     * 必要情報を格納した変換結果DTOを返却する。
     * @param ipv4Str IPv4アドレス文字列
     * @param cidrStr CIDRブロック文字列
     * @returns 変換結果DTO
     */
    public convert(ipv4Str: string, cidrStr: string): ResultDto {

        const decIpAddressArray = ipv4Str.split(Regex.PERIOD).map(Number);
        const cidr = Number(cidrStr);

        const binIpAddressArray = decIpAddressArray.map(ConversionUtils.convertDecimalToBinary);
        const binSubnetMaskArray = IpAddressUtils.createBinSubnetMaskArray(cidr);

        const {binNetworkAddressArray, binBroadcastAddressArray} = IpAddressUtils.createBinArraysOfNetworkAndBroadcast(binIpAddressArray, cidr);

        const decSubnetMaskArray = binSubnetMaskArray.map(ConversionUtils.convertBinaryToDecimal);
        const decNetworkAddressArray = binNetworkAddressArray.map(ConversionUtils.convertBinaryToDecimal);
        const decBroadcastAddressArray = binBroadcastAddressArray.map(ConversionUtils.convertBinaryToDecimal);

        const decFirstAvailableIpAddressArray = ArrayUtils.mapAnElementOfArray(decNetworkAddressArray,
                                                                               IpAddress.FOURTH_OCTET_INDEX,
                                                                               element => element + 1);

        const decLastAvailableIpAddressArray = ArrayUtils.mapAnElementOfArray(decBroadcastAddressArray,
                                                                              IpAddress.FOURTH_OCTET_INDEX,
                                                                              element => element - 1);

        const binFirstAvailableIpAddressArray = ArrayUtils.mapAnElementOfArray(binNetworkAddressArray,
                                                                               IpAddress.FOURTH_OCTET_INDEX,
                                                                               element => { const decimal = ConversionUtils.convertBinaryToDecimal(element);
                                                                                            return ConversionUtils.convertDecimalToBinary(decimal + 1); });

        const binLastAvailableIpAddressArray = ArrayUtils.mapAnElementOfArray(binBroadcastAddressArray,
                                                                              IpAddress.FOURTH_OCTET_INDEX,
                                                                              element => { const decimal = ConversionUtils.convertBinaryToDecimal(element);
                                                                                           return ConversionUtils.convertDecimalToBinary(decimal - 1); });

        const addressBlock = IpAddressUtils.determineAddressBlockBy(binIpAddressArray);

        const numberOfAvailableIps = IpAddress.RADIX_BINARY            // 基数2
                                     ** (IpAddress.IPv4_DIGITS - cidr) // ホスト部の桁数 乗
                                     - 2;                              // - ネットワークアドレス, ブロードキャストアドレス

        return Builder.ofResultDto()
                .decIpAddressArray(decIpAddressArray)                             // 10進数IPアドレス配列
                .cidr(cidr)                                                       // CIDR
                .binIpAddressArray(binIpAddressArray)                             // 2進数IPアドレス配列
                .binSubnetMaskArray(binSubnetMaskArray)                           // 2進数サブネットマスク配列
                .binNetworkAddressArray(binNetworkAddressArray)                   // 2進数ネットワークアドレス配列
                .binBroadcastAddressArray(binBroadcastAddressArray)               // 2進数ブロードキャストアドレス配列
                .decSubnetMaskArray(decSubnetMaskArray)                           // 10進数サブネットマスク配列
                .decNetworkAddressArray(decNetworkAddressArray)                   // 10進数ネットワークアドレス配列
                .decBroadcastAddressArray(decBroadcastAddressArray)               // 10進数ブロードキャストアドレス配列
                .decFirstAvailableIpAddressArray(decFirstAvailableIpAddressArray) // 10進数利用可能範囲開始IPアドレス配列
                .decLastAvailableIpAddressArray(decLastAvailableIpAddressArray)   // 10進数利用可能範囲終了IPアドレス配列
                .binFirstAvailableIpAddressArray(binFirstAvailableIpAddressArray) // 2進数利用可能範囲開始IPアドレス配列
                .binLastAvailableIpAddressArray(binLastAvailableIpAddressArray)   // 2進数利用可能範囲終了IPアドレス配列
                .addressBlock(addressBlock)                                       // アドレスブロック
                .numberOfAvailableIps(numberOfAvailableIps)                       // 利用可能IPアドレス数
                .build();                                                         // 変換結果DTO生成
    }
}

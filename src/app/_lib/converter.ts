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
     * CIDRブロック付10進数IPアドレス文字列に変換処理を適用し、  
     * 必要情報を格納した変換結果DTOを返却する。
     * @param decIpAddressWithCidr CIDRブロック付10進数IPアドレス文字列
     * @returns 変換結果DTO
     */
    public convert(decIpAddressWithCidr: string): ResultDto {

        const decIpAddressArray = decIpAddressWithCidr            // IP:     1.2.3.4/5
                                    .split(Regex.PERIOD_OR_SLASH) // array = 1,2,3,4,5 ──┐
                                    .map(Number);                 // array = 1,2,3,4  <──┤ pop
        const cidr = Number(decIpAddressArray.pop());             // cidr  = 5        <──┘

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
                .build();                                                         // 変換結果DTO生成
    }
}

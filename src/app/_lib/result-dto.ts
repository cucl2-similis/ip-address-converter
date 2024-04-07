import { Symbol } from "./const";

/**
 * 変換結果DTO
 */
export class ResultDto {

    /** 10進数IPアドレス配列（初期値: 空配列） */
    private decIpAddressArray: number[] = [];

    /** CIDR（初期値: 0） */
    private cidr: number = 0;

    /**
     * 10進数IPアドレス配列取得
     * @returns 10進数IPアドレス配列
     */
    public getDecIpAddressArray(): number[] {
        return this.decIpAddressArray;
    }

    /**
     * 10進数IPアドレス取得
     * @returns 10進数IPアドレス
     */
    public getDecIpAddress(): string {
        return this.decIpAddressArray.join(Symbol.PERIOD);
    }

    /**
     * 10進数IPアドレス配列設定
     * @param decIpAddressArray 10進数IPアドレス配列
     */
    public setDecIpAddressArray(decIpAddressArray: number[]): void {
        this.decIpAddressArray = decIpAddressArray;
    }

    /**
     * CIDR取得
     * @returns CIDR
     */
    public getCidr(): number {
        return this.cidr;
    }

    /**
     * CIDR設定
     * @param cidr CIDR
     */
    public setCidr(cidr: number): void {
        this.cidr = cidr;
    }
}
